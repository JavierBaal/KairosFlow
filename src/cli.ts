import { Command } from 'commander';
import chalk from 'chalk';
import { initProject } from './commands/init';
import { validateArtifact } from './commands/validate';
import { runPipeline } from './commands/run';

const program = new Command();

program
  .name('kairos')
  .description('KAIROS FLOW - Multi-Agent Prompt Framework CLI')
  .version('1.0.0');

// Command 1: Initialize a new project
// Scaffolds the folder structure and creates default agent templates
program
  .command('init')
  .description('Initialize a new Kairos agent pipeline')
  .action(() => {
    console.log(chalk.cyan('🚀 Initializing KAIROS FLOW environment...'));
    initProject();
  });

// Command 2: Validate an artifact
// Checks if a JSON output meets the GranularArtifactStandard
program
  .command('validate <file>')
  .description('Validate a JSON file against the GranularArtifactStandard')
  .action((file) => {
    validateArtifact(file);
  });

// Command 3: Run the pipeline
// Executes the workflow defined in kairos.config.json
program
  .command('run')
  .description('Execute the agent pipeline')
  .option('-p, --prompt <text>', 'Initial user request')
  .action((options) => {
    console.log(chalk.cyan('⚙️  Starting Pipeline Execution...'));
    runPipeline(options.prompt);
  });

// Parse arguments
program.parse(process.argv);

// Help fallback if no args provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}