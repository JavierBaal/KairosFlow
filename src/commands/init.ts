import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { defaultAgentTemplate } from '../templates/defaults';

export const initProject = async () => {
  console.log(chalk.bold.cyan(`
  _  __      _                  ______ _
  | | / /(_) | ____ | |              
  | ' / __ _  _ _ __ ___   ___  | |__  | | _____      __
  | < / _\` || | '__/ _ \\ / __| |  __| | |/ _ \\ \\ /\\ / /
  | .\\ (_ | || | | | (_) |\\__ \\ | |    | | (_) \\ V  V / 
  | _ |\\_\\__, _ || _ | _ |  \\___ / | ___ / | _ |    | _ |\\___ / \\_ /\\_ /  
                                                       
  🚀 The Enterprise - Grade Agent Framework
  `));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '🏭  Name your new AI Factory:',
      default: 'my-kairos-pipeline',
      validate: (input) => /^[a-z0-9-_]+$/.test(input) ? true : 'Project name may only include letters, numbers, dashes and underscores.'
    },
    {
      type: 'list',
      name: 'template',
      message: '📋  Select a Blueprint:',
      choices: [
        { name: 'Basic (2 Agents: Researcher -> Writer)', value: 'basic' },
        { name: 'Software Factory (10 Agents Full Pipeline)', value: 'software' },
        { name: 'Blank Canvas (Start from scratch)', value: 'blank' }
      ]
    },
    {
      type: 'list',
      name: 'llmProvider',
      message: '🧠  Select your Intelligence Engine:',
      choices: [
        { name: 'DeepSeek V3 (Recommended - $0.05/day)', value: 'deepseek' },
        { name: 'OpenAI (GPT-4o)', value: 'openai' },
        { name: 'Anthropic (Claude 3.5 Sonnet)', value: 'anthropic' },
        { name: 'Custom (Local/Compatible)', value: 'custom' }
      ]
    },
    {
      type: 'input',
      name: 'apiKey',
      message: '🔑  Enter API Key (optional, can be set in .env later):',
      default: ''
    }
  ]);

  const projectPath = path.join(process.cwd(), answers.projectName);

  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`\n❌ Error: Directory "${answers.projectName}" already exists.`));
    process.exit(1);
  }

  const spinner = ora(`🏗️  Constructing factory in ${chalk.green(answers.projectName)}...`).start();

  try {
    // Create directory structure
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'agents'));
    await fs.ensureDir(path.join(projectPath, 'artifacts'));
    await fs.ensureDir(path.join(projectPath, 'context'));
    await fs.ensureDir(path.join(projectPath, 'plugins')); // Added plugins dir

    // Determine default model based on provider
    let defaultModel = 'gpt-4-turbo-preview';
    if (answers.llmProvider === 'anthropic') defaultModel = 'claude-3-5-sonnet-20240620';
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
      },
      plugins: []
    };

    await fs.writeJSON(path.join(projectPath, 'kairos.config.json'), config, { spaces: 2 });

    // Create .env file
    let envContent = `# KairosFlow Environment Variables\n`;
    if (answers.llmProvider === 'openai') {
      envContent += `OPENAI_API_KEY = ${answers.apiKey || 'sk-...'} \n`;
    } else if (answers.llmProvider === 'anthropic') {
      envContent += `ANTHROPIC_API_KEY = ${answers.apiKey || 'sk-ant-...'} \n`;
    } else if (answers.llmProvider === 'deepseek') {
      envContent += `DEEPSEEK_API_KEY = ${answers.apiKey || 'sk-...'} \n`;
    } else {
      envContent += `OPENAI_API_KEY = ${answers.apiKey || 'sk-...'} \n`;
      envContent += `# BASE_URL = https://your-custom-endpoint/v1\n`;
    }

    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // Create Default Agent (Agent 001)
    const agentContent = defaultAgentTemplate(answers.template);
    await fs.writeFile(path.join(projectPath, 'agents', '001-product-manager.md'), agentContent);

    // Create README
    await fs.writeFile(path.join(projectPath, 'README.md'), `# ${answers.projectName}\n\nGenerated with KAIROS FLOW CLI.\n\n## Setup\n1. Check \`.env\` and add your API Key.\n2. Run \`npx kairos-flow run\` to start.`);

    // Create .gitignore
    await fs.writeFile(path.join(projectPath, '.gitignore'), `node_modules\n.env\nartifacts/*\n!artifacts/.gitkeep`);

    spinner.succeed(chalk.green('Factory initialized successfully!'));

    console.log(`\n🚀  **Ready to Launch:**\n`);
    console.log(chalk.cyan(`  cd ${answers.projectName}`));
    console.log(chalk.cyan(`  npx kairos-flow run`));
    console.log(chalk.gray(`\n  "The best way to predict the future is to create it." - Abraham Lincoln (and KairosFlow)`));
    console.log(chalk.yellow(`\n  ⚠️  Don't forget to verify your API Key in the .env file!\n`));

  } catch (error) {
    spinner.fail('Failed to initialize project.');
    console.error(error);
  }
};