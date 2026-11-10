import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { executePipeline, extractJson, selectContext } from '../src/core/pipeline';
import { LLMProvider, LLMResponse } from '../src/llm/types';

/** Fake provider: answers in order and records every prompt it receives. */
class ScriptedProvider implements LLMProvider {
  public prompts: string[] = [];
  constructor(private answers: Array<string | ((prompt: string) => string)>) {}
  async generate(prompt: string): Promise<LLMResponse> {
    this.prompts.push(prompt);
    const next = this.answers.shift();
    if (next === undefined) throw new Error('ScriptedProvider ran out of answers');
    const content = typeof next === 'function' ? next(prompt) : next;
    return { content, usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } };
  }
}

async function makeProject(agents: Record<string, string>, files: Record<string, unknown> = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'kairos-'));
  await fs.ensureDir(path.join(dir, 'agents'));
  for (const [name, body] of Object.entries(agents)) {
    await fs.writeFile(path.join(dir, 'agents', name), body);
  }
  for (const [name, json] of Object.entries(files)) {
    await fs.outputJSON(path.join(dir, name), json);
  }
  return dir;
}

describe('executePipeline', () => {
  test('respects the order declared in config.pipeline', async () => {
    const dir = await makeProject({ 'A.md': 'agent A', 'B.md': 'agent B' });
    const provider = new ScriptedProvider(['{"from":"B"}', '{"from":"A"}']);

    const result = await executePipeline({ projectDir: dir, provider, pipeline: ['B.md', 'A.md'] });

    expect(result.success).toBe(true);
    expect(result.steps.map((s) => s.agent)).toEqual(['B', 'A']);
    expect(provider.prompts[0]).toContain('agent B');
  });

  test('falls back to alphabetical order when no pipeline is declared', async () => {
    const dir = await makeProject({ '02_second.md': 'second', '01_first.md': 'first' });
    const provider = new ScriptedProvider(['{"a":1}', '{"b":2}']);

    const result = await executePipeline({ projectDir: dir, provider });

    expect(result.steps.map((s) => s.agent)).toEqual(['01_first', '02_second']);
  });

  test('injects only the context a step asks for', async () => {
    const dir = await makeProject({ 'A.md': 'A', 'B.md': 'B', 'C.md': 'C' });
    const provider = new ScriptedProvider(['{"secret":"from-A"}', '{"public":"from-B"}', '{"done":true}']);

    await executePipeline({
      projectDir: dir,
      provider,
      pipeline: ['A.md', 'B.md', { agent: 'C.md', context: ['B'] }],
    });

    expect(provider.prompts[2]).toContain('from-B');
    expect(provider.prompts[2]).not.toContain('from-A');
  });

  test('fails clearly when a step asks for context that does not exist yet', async () => {
    const dir = await makeProject({ 'A.md': 'A' });
    const provider = new ScriptedProvider([]);

    await expect(
      executePipeline({ projectDir: dir, provider, pipeline: [{ agent: 'A.md', context: ['Z'] }] })
    ).rejects.toThrow('Context key "Z" is not available yet');
  });

  test('retries with the validation errors when the output breaks its schema', async () => {
    const dir = await makeProject(
      { 'A.md': 'Return a title' },
      { 'schemas/a.json': { type: 'object', required: ['title'], properties: { title: { type: 'string' } } } }
    );
    const provider = new ScriptedProvider(['{"name":"wrong field"}', '{"title":"Fixed"}']);

    const result = await executePipeline({
      projectDir: dir,
      provider,
      pipeline: [{ agent: 'A.md', outputSchema: 'schemas/a.json', maxRetries: 1 }],
    });

    expect(result.success).toBe(true);
    expect(result.steps[0].attempts).toBe(2);
    expect(provider.prompts[1]).toContain('YOUR PREVIOUS ANSWER WAS REJECTED');
    expect(provider.prompts[1]).toContain("must have required property 'title'");
    const saved = await fs.readJSON(path.join(dir, 'artifacts', 'A_output.json'));
    expect(saved.output).toEqual({ title: 'Fixed' });
    expect(saved.validation.checks_passed).toEqual(['json_parse', 'output_schema', 'artifact_envelope']);
  });

  test('stops the pipeline when retries are exhausted', async () => {
    const dir = await makeProject({ 'A.md': 'A', 'B.md': 'B' });
    const provider = new ScriptedProvider(['not json', 'still not json']);

    const result = await executePipeline({ projectDir: dir, provider, pipeline: ['A.md', 'B.md'], defaultMaxRetries: 1 });

    expect(result.success).toBe(false);
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].status).toBe('error');
    expect(result.steps[0].attempts).toBe(2);
    expect(fs.existsSync(path.join(dir, 'artifacts', 'A_output.json'))).toBe(false);
  });

  test('writes metadata itself, measuring time and tokens', async () => {
    const dir = await makeProject({ 'A.md': 'A' });
    const provider = new ScriptedProvider(['{"ok":true}']);

    const result = await executePipeline({ projectDir: dir, provider, model: 'test-model' });
    const meta = result.steps[0].artifact!.metadata;

    expect(meta.model).toBe('test-model');
    expect(meta.tokens_used).toBe(2);
    expect(typeof meta.execution_time_ms).toBe('number');
    expect(meta.attempts).toBe(1);
  });
});

describe('helpers', () => {
  test('extractJson reads fenced blocks and bare objects', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extractJson('Sure! {"b":2} hope it helps')).toEqual({ b: 2 });
  });

  test('selectContext returns everything when no keys are given', () => {
    expect(selectContext({ a: 1, b: 2 }, undefined)).toEqual({ a: 1, b: 2 });
    expect(selectContext({ a: 1, b: 2 }, ['b'])).toEqual({ b: 2 });
  });
});
