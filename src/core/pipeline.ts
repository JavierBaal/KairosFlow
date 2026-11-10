import fs from 'fs-extra';
import path from 'path';
import Ajv, { ValidateFunction } from 'ajv';
import { LLMProvider } from '../llm/types';
import { GranularArtifact, GranularArtifactSchema } from '../schemas/artifact';

/**
 * One step of the pipeline as declared in kairos.config.json.
 *
 * A step can be a plain file name ("AG001_Generator.md") or an object:
 * {
 *   "agent": "AG002_Filter.md",
 *   "context": ["AG001_Generator"],          // only these previous outputs are injected
 *   "outputSchema": "schemas/filter.json",   // JSON Schema the agent output must satisfy
 *   "maxRetries": 2                          // re-prompts allowed when the output is invalid
 * }
 */
export type PipelineStepConfig =
  | string
  | {
      agent: string;
      context?: string[];
      outputSchema?: string;
      maxRetries?: number;
    };

export interface ResolvedStep {
  file: string;
  name: string;
  context?: string[];
  outputSchema?: string;
  maxRetries: number;
}

export interface PipelineHooks {
  onAgentStart?: (agentName: string, context: Record<string, unknown>) => Promise<void> | void;
  onAgentFinish?: (agentName: string, artifact: GranularArtifact) => Promise<void> | void;
  onAttemptFailed?: (agentName: string, attempt: number, errors: string[]) => Promise<void> | void;
}

export interface ExecutePipelineOptions {
  projectDir: string;
  provider: LLMProvider;
  model?: string;
  pipeline?: PipelineStepConfig[];
  userRequest?: string;
  defaultMaxRetries?: number;
  hooks?: PipelineHooks;
}

export interface StepResult {
  agent: string;
  status: 'success' | 'error';
  attempts: number;
  artifact?: GranularArtifact;
  errors?: string[];
}

export interface PipelineResult {
  success: boolean;
  steps: StepResult[];
  context: Record<string, unknown>;
}

const SYSTEM_PROMPT =
  'You are a specialized AI agent within the KairosFlow framework. ' +
  'Return only the JSON payload your instructions ask for. Do not add system fields such as agent_id or metadata.';

const DEFAULT_MAX_RETRIES = 1;

/**
 * Builds the ordered list of steps. When the config declares a `pipeline`, its
 * order is used exactly; otherwise every .md file in /agents runs in alphabetical order.
 */
export async function resolveSteps(
  agentsDir: string,
  pipeline: PipelineStepConfig[] | undefined,
  defaultMaxRetries = DEFAULT_MAX_RETRIES
): Promise<ResolvedStep[]> {
  if (pipeline && pipeline.length > 0) {
    return pipeline.map((step) => {
      const cfg = typeof step === 'string' ? { agent: step } : step;
      const file = cfg.agent.endsWith('.md') ? cfg.agent : `${cfg.agent}.md`;
      return {
        file,
        name: path.basename(file, '.md'),
        context: cfg.context,
        outputSchema: cfg.outputSchema,
        maxRetries: cfg.maxRetries ?? defaultMaxRetries,
      };
    });
  }

  const files = (await fs.readdir(agentsDir)).filter((f) => f.endsWith('.md')).sort();
  return files.map((file) => ({
    file,
    name: path.basename(file, '.md'),
    maxRetries: defaultMaxRetries,
  }));
}

/** Extracts a JSON value from a model response (code block, or first { … last }). */
export function extractJson(raw: string): unknown {
  let jsonStr = raw;
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) {
    jsonStr = fenced[1];
  } else {
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first !== -1 && last > first) jsonStr = raw.substring(first, last + 1);
  }
  return JSON.parse(jsonStr);
}

/** Picks only the previous outputs a step asked for. Without a list, the step sees everything. */
export function selectContext(
  all: Record<string, unknown>,
  keys: string[] | undefined
): Record<string, unknown> {
  if (!keys) return { ...all };
  const selected: Record<string, unknown> = {};
  for (const key of keys) {
    if (!(key in all)) {
      throw new Error(`Context key "${key}" is not available yet. Check the pipeline order.`);
    }
    selected[key] = all[key];
  }
  return selected;
}

function buildPrompt(
  template: string,
  userRequest: string | undefined,
  context: Record<string, unknown>
): string {
  let prompt = template.split('{{user_request}}').join(userRequest ?? '');
  if (Object.keys(context).length > 0) {
    prompt += `\n\nAVAILABLE CONTEXT:\n${JSON.stringify(context, null, 2)}`;
  }
  return prompt;
}

/**
 * Runs the pipeline. Each agent's output is parsed, checked against its optional
 * JSON Schema, re-prompted with the validation errors when it fails, and stored as a
 * GranularArtifact whose metadata is written by the framework, never by the model.
 */
export async function executePipeline(options: ExecutePipelineOptions): Promise<PipelineResult> {
  const { projectDir, provider, model, pipeline, userRequest, hooks = {} } = options;
  const agentsDir = path.join(projectDir, 'agents');
  const artifactsDir = path.join(projectDir, 'artifacts');

  if (!fs.existsSync(agentsDir)) {
    throw new Error('Agents directory not found.');
  }
  await fs.ensureDir(artifactsDir);

  const steps = await resolveSteps(agentsDir, pipeline, options.defaultMaxRetries);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const accumulated: Record<string, unknown> = {};
  const results: StepResult[] = [];

  for (const step of steps) {
    const agentPath = path.join(agentsDir, step.file);
    if (!fs.existsSync(agentPath)) {
      results.push({ agent: step.name, status: 'error', attempts: 0, errors: [`Agent file not found: ${step.file}`] });
      return { success: false, steps: results, context: accumulated };
    }

    const template = await fs.readFile(agentPath, 'utf-8');
    const context = selectContext(accumulated, step.context);
    await hooks.onAgentStart?.(step.name, context);

    let validateOutput: ValidateFunction | undefined;
    if (step.outputSchema) {
      const schema = await fs.readJSON(path.resolve(projectDir, step.outputSchema));
      validateOutput = ajv.compile(schema);
    }

    const basePrompt = buildPrompt(template, userRequest, context);
    let prompt = basePrompt;
    let lastErrors: string[] = [];
    let artifact: GranularArtifact | undefined;
    let attempts = 0;
    let tokens = 0;
    const started = Date.now();

    while (attempts <= step.maxRetries) {
      attempts++;
      const response = await provider.generate(prompt, SYSTEM_PROMPT);
      tokens += response.usage?.total_tokens ?? 0;
      const checks: string[] = [];

      let output: unknown;
      try {
        output = extractJson(response.content);
        checks.push('json_parse');
      } catch (e: any) {
        lastErrors = [`Response is not valid JSON: ${e.message}`];
      }

      if (output !== undefined && validateOutput) {
        if (validateOutput(output)) {
          checks.push('output_schema');
        } else {
          lastErrors = (validateOutput.errors ?? []).map(
            (err) => `${err.instancePath || '(root)'} ${err.message}`
          );
          output = undefined;
        }
      }

      if (output !== undefined) {
        const candidate = {
          agent_id: step.name,
          agent_name: step.name,
          responsibility: 'Agent Execution',
          input: { context_keys: Object.keys(context) },
          output,
          metadata: {
            timestamp: new Date().toISOString(),
            status: 'success' as const,
            model,
            tokens_used: tokens || undefined,
            execution_time_ms: Date.now() - started,
            attempts,
          },
          validation: { is_valid: true, checks_passed: [...checks, 'artifact_envelope'] },
        };
        const envelope = GranularArtifactSchema.safeParse(candidate);
        if (envelope.success) {
          artifact = envelope.data;
          break;
        }
        lastErrors = envelope.error.issues.map((i) => `${i.path.join('.')} ${i.message}`);
      }

      await hooks.onAttemptFailed?.(step.name, attempts, lastErrors);
      prompt =
        `${basePrompt}\n\nYOUR PREVIOUS ANSWER WAS REJECTED:\n- ${lastErrors.join('\n- ')}\n` +
        'Return only corrected JSON.';
    }

    if (!artifact) {
      results.push({ agent: step.name, status: 'error', attempts, errors: lastErrors });
      return { success: false, steps: results, context: accumulated };
    }

    accumulated[step.name] = artifact.output;
    await fs.writeJSON(path.join(artifactsDir, `${step.name}_output.json`), artifact, { spaces: 2 });
    await hooks.onAgentFinish?.(step.name, artifact);
    results.push({ agent: step.name, status: 'success', attempts, artifact });
  }

  return { success: true, steps: results, context: accumulated };
}
