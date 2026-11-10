import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { LLMFactory } from '../llm/factory';
import { PluginLoader } from '../core/plugins/loader';
import { KairosConfig } from '../core/plugins/types';
import { executePipeline } from '../core/pipeline';

// Load environment variables
dotenv.config();

const DEFAULT_REQUEST =
  'Create a comprehensive marketing strategy for a new coffee brand called "Morning Brew".';

export const runPipeline = async (initialPrompt?: string) => {
  const spinner = ora('Loading pipeline configuration...').start();
  const projectDir = process.cwd();

  const configPath = path.join(projectDir, 'kairos.config.json');
  if (!fs.existsSync(configPath)) {
    spinner.fail(chalk.red('Configuration file not found. Are you in a KAIROS project?'));
    console.log(chalk.yellow('Run "kairos init" to start a new project.'));
    process.exitCode = 1;
    return;
  }

  try {
    const projectConfig: KairosConfig = await fs.readJSON(configPath);

    if (!projectConfig.llm) {
      projectConfig.llm = { provider: 'openai', model: 'gpt-4o' };
      spinner.warn(chalk.yellow('No LLM config found, defaulting to OpenAI gpt-4o.'));
    }

    const pluginLoader = new PluginLoader(projectConfig);
    await pluginLoader.loadPlugins();
    for (const plugin of pluginLoader.getPlugins()) {
      plugin.registerProviders?.(LLMFactory);
    }

    const provider = LLMFactory.createProvider(projectConfig.llm);
    spinner.succeed(
      `Loaded project: ${chalk.cyan(projectConfig.projectName)} using ${chalk.magenta(projectConfig.llm.provider)}`
    );

    let userRequest = initialPrompt;
    if (!userRequest) {
      userRequest = DEFAULT_REQUEST;
      console.log(chalk.yellow('No prompt provided, using the default example request.'));
    }

    console.log(chalk.bold('\n🚀 Starting Pipeline Execution\n'));
    const sharedContext: Record<string, unknown> = {};
    await pluginLoader.executeHook('onPipelineStart', sharedContext);

    let agentSpinner = ora();
    const result = await executePipeline({
      projectDir,
      provider,
      model: projectConfig.llm.model,
      pipeline: projectConfig.pipeline,
      userRequest,
      defaultMaxRetries: projectConfig.maxRetries,
      hooks: {
        onAgentStart: async (name, context) => {
          agentSpinner = ora(`Executing Agent: ${chalk.blue(name)}...`).start();
          await pluginLoader.executeHook('onAgentStart', name, context);
        },
        onAttemptFailed: (name, attempt, errors) => {
          agentSpinner.text = `Agent ${chalk.blue(name)}: attempt ${attempt} rejected (${errors[0] ?? 'invalid output'}). Retrying...`;
        },
        onAgentFinish: async (name, artifact) => {
          agentSpinner.succeed(chalk.green(`Agent ${name} completed.`));
          console.log(
            chalk.gray(
              `   Tokens: ${artifact.metadata.tokens_used ?? 'N/A'} | ${artifact.metadata.execution_time_ms} ms | ` +
                `attempts: ${artifact.metadata.attempts} | artifacts/${name}_output.json`
            )
          );
          await pluginLoader.executeHook('onAgentFinish', name, artifact);
        },
      },
    });

    Object.assign(sharedContext, result.context);
    await pluginLoader.executeHook('onPipelineFinish', sharedContext);

    if (result.success) {
      console.log(chalk.bold.green('\n✨ Pipeline Execution Completed!'));
    } else {
      const failed = result.steps[result.steps.length - 1];
      agentSpinner.fail(chalk.red(`Agent ${failed.agent} failed after ${failed.attempts} attempt(s).`));
      for (const err of failed.errors ?? []) console.error(chalk.yellow(`   - ${err}`));
      console.log(chalk.bold.red('\nPipeline stopped.'));
      process.exitCode = 1;
    }
  } catch (error: any) {
    spinner.fail(chalk.red('Pipeline failed.'));
    console.error(error.message);
    process.exitCode = 1;
  }
};
