import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { KairosConfig, Plugin } from './types';

export class PluginLoader {
    private plugins: Plugin[] = [];

    constructor(private config: KairosConfig) { }

    async loadPlugins(): Promise<void> {
        const pluginPaths = this.config.plugins || [];

        for (const pluginPath of pluginPaths) {
            try {
                let resolvedPath: string;

                if (pluginPath.startsWith('.')) {
                    // Local plugin
                    resolvedPath = path.resolve(process.cwd(), pluginPath);
                } else {
                    // Node module
                    resolvedPath = require.resolve(pluginPath, { paths: [process.cwd()] });
                }

                // Dynamic import
                const pluginModule = await import(resolvedPath);
                const plugin: Plugin = pluginModule.default || pluginModule;

                if (!plugin.name) {
                    throw new Error(`Plugin at ${pluginPath} does not export a valid plugin object (missing name).`);
                }

                this.plugins.push(plugin);
                console.log(chalk.green(`✔ Loaded plugin: ${chalk.bold(plugin.name)} v${plugin.version}`));

                // Initialize plugin
                if (plugin.onInit) {
                    await plugin.onInit(this.config);
                }

            } catch (error: any) {
                console.error(chalk.red(`✖ Failed to load plugin: ${pluginPath}`));
                console.error(chalk.yellow(error.message));
            }
        }
    }

    getPlugins(): Plugin[] {
        return this.plugins;
    }

    async executeHook(hookName: keyof Plugin, ...args: any[]): Promise<void> {
        for (const plugin of this.plugins) {
            const hook = plugin[hookName];
            if (typeof hook === 'function') {
                try {
                    // @ts-ignore - Dynamic arguments
                    await hook.apply(plugin, args);
                } catch (error: any) {
                    console.error(chalk.red(`✖ Error in plugin ${plugin.name} hook ${hookName}:`));
                    console.error(error);
                }
            }
        }
    }
}
