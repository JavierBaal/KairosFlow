import { LLMConfig, LLMProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';

export class LLMFactory {
    static createProvider(config: LLMConfig): LLMProvider {
        switch (config.provider) {
            case 'openai':
                return new OpenAIProvider(config);

            case 'anthropic':
                return new AnthropicProvider(config);

            case 'deepseek':
                // DeepSeek is API-compatible with OpenAI
                return new OpenAIProvider({
                    ...config,
                    baseUrl: config.baseUrl || 'https://api.deepseek.com/v1',
                    apiKey: config.apiKey || process.env.DEEPSEEK_API_KEY
                });

            case 'custom':
                // Generic OpenAI compatible provider
                return new OpenAIProvider(config);

            default:
                throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }
}
