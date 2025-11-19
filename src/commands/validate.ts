import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { GranularArtifactSchema } from '../schemas/artifact';

export const validateArtifact = async (filePath: string) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const spinner = ora(`Reading file: ${filePath}...`).start();

  if (!fs.existsSync(absolutePath)) {
    spinner.fail(chalk.red('File not found.'));
    return;
  }

  try {
    const content = await fs.readJSON(absolutePath);
    spinner.text = 'Validating against GranularArtifactStandard...';

    const result = GranularArtifactSchema.safeParse(content);

    if (result.success) {
      spinner.succeed(chalk.green('VALIDATION PASSED ✅'));
      console.log(chalk.gray(`\nAgent ID: ${content.agent_id}`));
      console.log(chalk.gray(`Responsibility: ${content.responsibility}`));
      console.log(chalk.gray(`Tokens Used: ${content.metadata?.tokens_used ?? 'N/A'}\n`));
    } else {
      spinner.fail(chalk.red('VALIDATION FAILED ❌'));
      console.error(chalk.yellow('\nThe artifact does not meet the GranularArtifactStandard:'));
      
      result.error.issues.forEach((issue) => {
        console.error(chalk.red(`- Path: [${issue.path.join(' -> ')}]`));
        console.error(chalk.white(`  Error: ${issue.message}`));
      });
      console.log('');
    }

  } catch (error) {
    spinner.fail(chalk.red('Invalid JSON format.'));
    console.error(chalk.yellow('The file contains syntax errors and cannot be parsed.'));
  }
};