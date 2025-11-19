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
    
    // Create config file
    const config = {
      projectName: answers.projectName,
      version: '1.0.0',
      template: answers.template,
      created_at: new Date().toISOString()
    };
    
    await fs.writeJSON(path.join(projectPath, 'kairos.config.json'), config, { spaces: 2 });

    // Create Default Agent (Agent 001)
    const agentContent = defaultAgentTemplate(answers.template);
    await fs.writeFile(path.join(projectPath, 'agents', '001-product-manager.md'), agentContent);

    // Create README
    await fs.writeFile(path.join(projectPath, 'README.md'), `# ${answers.projectName}\n\nGenerated with KAIROS FLOW CLI.\n\n## Run Pipeline\nUse 'kairos run' to start.`);

    spinner.succeed(chalk.green('Project initialized successfully!'));
    
    console.log(`\nNext steps:\n`);
    console.log(chalk.cyan(`  cd ${answers.projectName}`));
    console.log(chalk.cyan(`  kairos validate agents/001-product-manager.md`));
    console.log(chalk.yellow(`\n  Modify 'agents/001-product-manager.md' to fit your needs.\n`));

  } catch (error) {
    spinner.fail('Failed to initialize project.');
    console.error(error);
  }
};