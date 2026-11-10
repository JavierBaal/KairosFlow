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
      name: 'llmProvider',
      message: '🧠  Select your Intelligence Engine:',
      choices: [
        { name: 'DeepSeek (deepseek-chat)', value: 'deepseek' },
        { name: 'OpenAI (GPT-4o)', value: 'openai' },
        { name: 'Anthropic (Claude Sonnet 4.5)', value: 'anthropic' },
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
    let defaultModel = 'gpt-4o';
    if (answers.llmProvider === 'anthropic') defaultModel = 'claude-sonnet-4-5';
    if (answers.llmProvider === 'deepseek') defaultModel = 'deepseek-chat';

    // Create config file
    const config = {
      projectName: answers.projectName,
      version: '1.0.0',
      template: 'starter',
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
    const agentContent = defaultAgentTemplate('starter');
    await fs.writeFile(path.join(projectPath, 'agents', '001-product-manager.md'), agentContent);

    // Create README
    await fs.writeFile(path.join(projectPath, 'README.md'), `# ${answers.projectName}\n\nGenerated with KAIROS FLOW CLI.\n\n## Setup\n1. Check \`.env\` and add your API Key.\n2. Run \`kairos run\` to start.`);

    // Create .gitignore
    await fs.writeFile(path.join(projectPath, '.gitignore'), `node_modules\n.env\nartifacts/*\n!artifacts/.gitkeep`);

    spinner.succeed(chalk.green('Factory initialized successfully!'));

    console.log(`\n🚀  **Ready to Launch:**\n`);
    console.log(chalk.cyan(`  cd ${answers.projectName}`));
    console.log(chalk.cyan(`  kairos run`));
    console.log(chalk.yellow(`\n  ⚠️  Don't forget to verify your API Key in the .env file!\n`));

  } catch (error) {
    spinner.fail('Failed to initialize project.');
    console.error(error);
  }
};