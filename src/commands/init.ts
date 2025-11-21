import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { defaultAgentTemplate } from '../templates/defaults';

export const initProject = async () => {
  console.log(chalk.bold.blue('\n🏗️  Welcome to the KAIROS FLOW Setup\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: 'my-kairos-pipeline',
      validate: (input) => /^[a-z0-9-_]+$/.test(input) ? true : 'Project name may only include letters, numbers, dashes and underscores.'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to start with?',
      choices: [
        { name: 'Basic (2 Agents: Researcher -> Writer)', value: 'basic' },
        { name: 'Software Dev (10 Agents Full Pipeline)', value: 'software' },
        { name: 'Blank Canvas', value: 'blank' }
      ]
    },
    {
      type: 'list',
      name: 'llmProvider',
      message: 'Which AI provider do you want to use?',
      choices: [
        { name: 'OpenAI (GPT-4)', value: 'openai' },
        { name: 'Anthropic (Claude 3)', value: 'anthropic' },
        { name: 'DeepSeek (DeepSeek-V3)', value: 'deepseek' },
        { name: 'Custom (OpenAI Compatible)', value: 'custom' }
      ]
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter your API Key (optional, can be set in .env later):',
      default: ''
    }
  ]);

  const projectPath = path.join(process.cwd(), answers.projectName);

  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`\n❌ Error: Directory "${answers.projectName}" already exists.`));
    process.exit(1);
  }

  const spinner = ora(`Scaffolding project in ${chalk.green(answers.projectName)}...`).start();

  try {
    // Create directory structure
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'agents'));
    await fs.ensureDir(path.join(projectPath, 'artifacts'));
    await fs.ensureDir(path.join(projectPath, 'context'));

    // Determine default model based on provider
    let defaultModel = 'gpt-4-turbo-preview';
    if (answers.llmProvider === 'anthropic') defaultModel = 'claude-3-opus-20240229';
    if (answers.llmProvider === 'deepseek') defaultModel = 'deepseek-chat';

    // Create config file
    const config = {
      projectName: answers.projectName,
      version: '1.0.0',
      template: answers.template,
      created_at: new Date().toISOString(),
      llm: {
        provider: answers.llmProvider,
        model: defaultModel,
        // Don't store API key in config.json for security, rely on .env or runtime config
      }
    };

    await fs.writeJSON(path.join(projectPath, 'kairos.config.json'), config, { spaces: 2 });

    // Create .env file
    let envContent = `# KairosFlow Environment Variables\n`;
    if (answers.llmProvider === 'openai') {
      envContent += `OPENAI_API_KEY=${answers.apiKey || 'sk-...'}\n`;
    } else if (answers.llmProvider === 'anthropic') {
      envContent += `ANTHROPIC_API_KEY=${answers.apiKey || 'sk-ant-...'}\n`;
    } else if (answers.llmProvider === 'deepseek') {
      envContent += `DEEPSEEK_API_KEY=${answers.apiKey || 'sk-...'}\n`;
    } else {
      envContent += `OPENAI_API_KEY=${answers.apiKey || 'sk-...'}\n`;
      envContent += `# BASE_URL=https://your-custom-endpoint/v1\n`;
    }

    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // Create Default Agent (Agent 001)
    const agentContent = defaultAgentTemplate(answers.template);
    await fs.writeFile(path.join(projectPath, 'agents', '001-product-manager.md'), agentContent);

    // Create README
    await fs.writeFile(path.join(projectPath, 'README.md'), `# ${answers.projectName}\n\nGenerated with KAIROS FLOW CLI.\n\n## Setup\n1. Check \`.env\` and add your API Key.\n2. Run \`kairos run\` to start.`);

    // Create .gitignore
    await fs.writeFile(path.join(projectPath, '.gitignore'), `node_modules\n.env\nartifacts/*\n!artifacts/.gitkeep`);

    spinner.succeed(chalk.green('Project initialized successfully!'));

    console.log(`\nNext steps:\n`);
    console.log(chalk.cyan(`  cd ${answers.projectName}`));
    console.log(chalk.cyan(`  kairos run`));
    console.log(chalk.yellow(`\n  ⚠️  Don't forget to verify your API Key in the .env file!\n`));

  } catch (error) {
    spinner.fail('Failed to initialize project.');
    console.error(error);
  }
};