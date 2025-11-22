import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { LLMFactory } from '../llm/factory';
import { LLMConfig } from '../llm/types';
import { GranularArtifactSchema } from '../schemas/artifact';

// Load environment variables
dotenv.config();

interface KairosConfig {
  projectName: string;
  llm: LLMConfig;
  pipeline: string[]; // Array of agent file names in execution order
}

export const runPipeline = async (initialPrompt?: string) => {
  const spinner = ora('Loading pipeline configuration...').start();

  // 1. Load Config
  const configPath = path.join(process.cwd(), 'kairos.config.json');
  if (!fs.existsSync(configPath)) {
    spinner.fail(chalk.red('Configuration file not found. Are you in a KAIROS project?'));
    console.log(chalk.yellow('Run "kairos init" to start a new project.'));
    return;
  }

  try {
    const projectConfig = await fs.readJSON(configPath);

    // Validate minimal config
    if (!projectConfig.llm) {
      // Fallback for projects created before LLM config was added
      projectConfig.llm = {
        provider: 'openai',
        model: 'gpt-4-turbo-preview'
      };
      spinner.warn(chalk.yellow('No LLM config found, defaulting to OpenAI GPT-4.'));
    }

    const provider = LLMFactory.createProvider(projectConfig.llm);
    spinner.succeed(`Loaded project: ${chalk.cyan(projectConfig.projectName)} using ${chalk.magenta(projectConfig.llm.provider)}`);

    // 2. Discover Agents
    const agentsDir = path.join(process.cwd(), 'agents');
    if (!fs.existsSync(agentsDir)) {
      throw new Error('Agents directory not found.');
    }

    const agentFiles = await fs.readdir(agentsDir);
    const sortedAgents = agentFiles.sort(); // Simple alphabetical sort for now, or use config.pipeline if exists

    if (sortedAgents.length === 0) {
      spinner.warn('No agents found in /agents directory.');
      return;
    }

    console.log(chalk.bold(`\n🚀 Starting Pipeline Execution (${sortedAgents.length} agents)\n`));

    // Context Accumulator
    let pipelineContext: Record<string, any> = {};

    // 3. Execute Pipeline
    for (const agentFile of sortedAgents) {
      const agentName = path.basename(agentFile, '.md');
      const agentSpinner = ora(`Executing Agent: ${chalk.blue(agentName)}...`).start();

      try {
        // Read Agent Definition
        const agentContent = await fs.readFile(path.join(agentsDir, agentFile), 'utf-8');

        // Construct Prompt
        // Simple template replacement for now. In production, use a robust template engine.
        let prompt = agentContent;

        // Inject Context (if placeholder exists)
        if (prompt.includes('{{user_request}}')) {
          if (initialPrompt) {
            prompt = prompt.replace('{{user_request}}', initialPrompt);
          } else {
            // Fallback if no prompt provided
            prompt = prompt.replace('{{user_request}}', 'Create a comprehensive marketing strategy for a new coffee brand called "Morning Brew".');
            agentSpinner.info(chalk.yellow('No prompt provided, using default example request.'));
          }
        }

        // Inject Previous Context
        const contextString = JSON.stringify(pipelineContext, null, 2);
        prompt += `\n\nAVAILABLE CONTEXT:\n${contextString}`;

        // Call LLM
        const response = await provider.generate(prompt, "You are a specialized AI agent within the KairosFlow framework. You MUST output valid JSON adhering to the GranularArtifactStandard.");

        // Parse and Validate Output
        let artifact;
        try {
          // Robust JSON Extraction Strategy
          let jsonStr = response.content;

          // 1. Try Markdown Code Block
          const jsonMatch = response.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonStr = jsonMatch[1];
          } else {
            // 2. Try finding first '{' and last '}' (if not a code block)
            const firstOpen = response.content.indexOf('{');
            const lastClose = response.content.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
              jsonStr = response.content.substring(firstOpen, lastClose + 1);
            }
          }

          const llmOutput = JSON.parse(jsonStr);

          // Construct Artifact (Backend Responsibility - Prompt Excellence)
          artifact = {
            agent_id: agentName,
            agent_name: agentName,
            responsibility: "Agent Execution",
            input: { context_keys: Object.keys(pipelineContext) },
            output: llmOutput,
            metadata: {
              timestamp: new Date().toISOString(),
              status: 'success',
              model: projectConfig.llm.model,
              tokens_used: response.usage?.total_tokens,
              execution_time_ms: 0 // Placeholder
            }
          };

          // Validate Schema
          const validation = GranularArtifactSchema.safeParse(artifact);
          if (!validation.success) {
            throw new Error(`Schema Validation Failed: ${validation.error.message}`);
          }

          // Add to Pipeline Context
          pipelineContext[agentName] = artifact.output;

          // Save Artifact
          const artifactPath = path.join(process.cwd(), 'artifacts', `${agentName}_output.json`);
          await fs.writeJSON(artifactPath, artifact, { spaces: 2 });

          agentSpinner.succeed(chalk.green(`Agent ${agentName} completed successfully.`));
          console.log(chalk.gray(`   Tokens: ${response.usage?.total_tokens ?? 'N/A'} | Output saved to artifacts/${agentName}_output.json`));

        } catch (parseError: any) {
          agentSpinner.fail(chalk.red(`Agent ${agentName} failed to produce valid JSON.`));
          console.error(chalk.yellow('Raw Output:'), response.content.substring(0, 200) + '...');
          console.error(chalk.red(parseError.message));
          // Break pipeline on error? Or continue? For now, break.
          break;
        }

      } catch (error: any) {
        agentSpinner.fail(chalk.red(`Error executing agent ${agentName}`));
        console.error(error);
        break;
      }
    }

    console.log(chalk.bold.green('\n✨ Pipeline Execution Completed!'));

  } catch (error: any) {
    spinner.fail(chalk.red('Pipeline failed.'));
    console.error(error.message);
  }
};