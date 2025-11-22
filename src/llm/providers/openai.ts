import OpenAI from 'openai';
import { LLMProvider, LLMResponse, LLMConfig } from '../types';

export class OpenAIProvider implements LLMProvider {
    private client: OpenAI;
    private config: LLMConfig;

    constructor(config: LLMConfig) {
        this.config = config;
        this.client = new OpenAI({
            apiKey: config.apiKey || process.env.OPENAI_API_KEY,
            baseURL: config.baseUrl // Optional: allows using compatible APIs like DeepSeek or LocalAI
        });
    }

    async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        messages.push({ role: 'user', content: prompt });

        const response = await this.client.chat.completions.create({
            model: this.config.model,
            messages: messages,
            temperature: this.config.temperature ?? 0.7,
            max_tokens: this.config.maxTokens,
            response_format: this.config.responseFormat,
        });

        const content = response.choices[0]?.message?.content || '';

        return {
            content,
            usage: response.usage ? {
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens
            } : undefined
        };
    }
}
