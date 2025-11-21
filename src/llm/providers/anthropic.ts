import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, LLMResponse, LLMConfig } from '../types';

export class AnthropicProvider implements LLMProvider {
    private client: Anthropic;
    private config: LLMConfig;

    constructor(config: LLMConfig) {
        this.config = config;
        this.client = new Anthropic({
            apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
        });
    }

    async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
        const response = await this.client.messages.create({
            model: this.config.model,
            max_tokens: this.config.maxTokens ?? 4096,
            temperature: this.config.temperature ?? 0.7,
            system: systemPrompt,
            messages: [
                { role: 'user', content: prompt }
            ]
        });

        // Handle content block properly
        const contentBlock = response.content[0];
        const content = contentBlock.type === 'text' ? contentBlock.text : '';

        return {
            content,
            usage: {
                prompt_tokens: response.usage.input_tokens,
                completion_tokens: response.usage.output_tokens,
                total_tokens: response.usage.input_tokens + response.usage.output_tokens
            }
        };
    }
}
