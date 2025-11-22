import { Plugin, PipelineContext } from '../../../src/core/plugins/types';
import chalk from 'chalk';

const SimpleLoggerPlugin: Plugin = {
    name: 'simple-logger',
    version: '1.0.0',

    onInit: async (config) => {
        console.log(chalk.cyan(`[SimpleLogger] Initialized with project: ${config.projectName}`));
    },

    onPipelineStart: async (context: PipelineContext) => {
        console.log(chalk.cyan('[SimpleLogger] Pipeline started!'));
    },

    onAgentStart: async (agentName: string, context: PipelineContext) => {
        console.log(chalk.cyan(`[SimpleLogger] Agent ${agentName} is starting...`));
    },

    onAgentFinish: async (agentName: string, artifact: any) => {
        console.log(chalk.cyan(`[SimpleLogger] Agent ${agentName} finished. Output keys: ${Object.keys(artifact.output).join(', ')}`));
    },

    onPipelineFinish: async (context: PipelineContext) => {
        console.log(chalk.cyan('[SimpleLogger] Pipeline finished!'));
    }
};

export default SimpleLoggerPlugin;
