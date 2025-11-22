import { LLMFactory } from '../../llm/factory';
import { GranularArtifact } from '../../schemas/artifact';

export interface PipelineContext {
    [key: string]: any;
}

export interface KairosConfig {
    projectName: string;
    plugins?: string[];
    [key: string]: any;
}

export interface Plugin {
    name: string;
    version: string;

    /**
     * Called when the plugin is initialized.
     */
    onInit?: (config: KairosConfig) => Promise<void>;

    /**
     * Called before the pipeline starts execution.
     */
    onPipelineStart?: (context: PipelineContext) => Promise<void>;

    /**
     * Called before an agent starts execution.
     */
    onAgentStart?: (agentName: string, context: PipelineContext) => Promise<void>;

    /**
     * Called after an agent finishes execution.
     */
    onAgentFinish?: (agentName: string, artifact: GranularArtifact) => Promise<void>;

    /**
     * Called after the pipeline finishes execution.
     */
    onPipelineFinish?: (context: PipelineContext) => Promise<void>;

    /**
     * Register custom LLM providers.
     */
    registerProviders?: (factory: typeof LLMFactory) => void;
}
