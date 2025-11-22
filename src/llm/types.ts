import { z } from 'zod';

export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'deepseek' | 'custom';
    model: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'text' | 'json_object' };
}

export interface LLMResponse {
    content: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface LLMProvider {
    generate(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}
