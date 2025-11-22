import { LLMFactory } from '../src/llm/factory';
import { OpenAIProvider } from '../src/llm/providers/openai';
import { AnthropicProvider } from '../src/llm/providers/anthropic';
import { LLMConfig } from '../src/llm/types';

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

jest.mock('openai');
jest.mock('@anthropic-ai/sdk');

describe('LLM Module', () => {
    describe('LLMFactory', () => {
        it('should create OpenAIProvider when provider is openai', () => {
            const config: LLMConfig = {
                provider: 'openai',
                model: 'gpt-4',
                apiKey: 'test-key'
            };
            const provider = LLMFactory.createProvider(config);
            expect(provider).toBeInstanceOf(OpenAIProvider);
        });

        it('should create AnthropicProvider when provider is anthropic', () => {
            const config: LLMConfig = {
                provider: 'anthropic',
                model: 'claude-3-opus',
                apiKey: 'test-key'
            };
            const provider = LLMFactory.createProvider(config);
            expect(provider).toBeInstanceOf(AnthropicProvider);
        });

        it('should create OpenAIProvider configured for DeepSeek when provider is deepseek', () => {
            const config: LLMConfig = {
                provider: 'deepseek',
                model: 'deepseek-chat',
                apiKey: 'test-key'
            };
            const provider = LLMFactory.createProvider(config);
            expect(provider).toBeInstanceOf(OpenAIProvider);
        });

        it('should throw error for unsupported provider', () => {
            const config: any = {
                provider: 'unsupported',
                model: 'test',
                apiKey: 'test-key'
            };
            expect(() => LLMFactory.createProvider(config)).toThrow('Unsupported provider: unsupported');
        });
    });

    describe('OpenAIProvider', () => {
        let provider: OpenAIProvider;
        const mockCreate = jest.fn();

        beforeEach(() => {
            jest.clearAllMocks();

            (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate
                    }
                }
            }));

            provider = new OpenAIProvider({
                provider: 'openai',
                model: 'gpt-4',
                apiKey: 'test-key'
            });
        });

        it('should generate response correctly', async () => {
            const mockResponse = {
                choices: [{
                    message: { content: 'Test response' }
                }],
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 5,
                    total_tokens: 15
                }
            };
            mockCreate.mockResolvedValue(mockResponse);

            const result = await provider.generate('Test prompt');

            expect(mockCreate).toHaveBeenCalledWith({
                model: 'gpt-4',
                messages: [{ role: 'user', content: 'Test prompt' }],
                temperature: 0.7
            });
            expect(result).toEqual({
                content: 'Test response',
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 5,
                    total_tokens: 15
                }
            });
        });

        it('should include system prompt if provided', async () => {
            mockCreate.mockResolvedValue({
                choices: [{ message: { content: 'Response' } }]
            });

            await provider.generate('User prompt', 'System prompt');

            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
                messages: [
                    { role: 'system', content: 'System prompt' },
                    { role: 'user', content: 'User prompt' }
                ]
            }));
        });
    });

    describe('AnthropicProvider', () => {
        let provider: AnthropicProvider;
        const mockCreate = jest.fn();

        beforeEach(() => {
            jest.clearAllMocks();

            (Anthropic as unknown as jest.Mock).mockImplementation(() => ({
                messages: {
                    create: mockCreate
                }
            }));

            provider = new AnthropicProvider({
                provider: 'anthropic',
                model: 'claude-3-opus',
                apiKey: 'test-key'
            });
        });

        it('should generate response correctly', async () => {
            const mockResponse = {
                content: [{ type: 'text', text: 'Claude response' }],
                usage: {
                    input_tokens: 10,
                    output_tokens: 5
                }
            };
            mockCreate.mockResolvedValue(mockResponse);

            const result = await provider.generate('Test prompt');

            expect(mockCreate).toHaveBeenCalledWith({
                model: 'claude-3-opus',
                messages: [{ role: 'user', content: 'Test prompt' }],
                max_tokens: 4096,
                temperature: 0.7,
                system: undefined
            });
            expect(result).toEqual({
                content: 'Claude response',
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 5,
                    total_tokens: 15
                }
            });
        });

        it('should include system prompt if provided', async () => {
            mockCreate.mockResolvedValue({
                content: [{ text: 'Response' }],
                usage: { input_tokens: 0, output_tokens: 0 }
            });

            await provider.generate('User prompt', 'System prompt');

            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
                system: 'System prompt',
                messages: [{ role: 'user', content: 'User prompt' }]
            }));
        });
    });
});
