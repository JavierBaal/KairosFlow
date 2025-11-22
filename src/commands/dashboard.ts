import { Command } from 'commander';
import { startDashboard } from '../dashboard/server';

export const dashboardCommand = new Command('dashboard')
    .description('Start the Web Dashboard to visualize the pipeline')
    .option('-p, --port <number>', 'Port to run the dashboard on', '3000')
    .action(async (options) => {
        await startDashboard(parseInt(options.port));
    });
