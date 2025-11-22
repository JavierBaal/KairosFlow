# 🧠 LLM Provider API

KairosFlow uses a provider-agnostic abstraction layer to communicate with Large Language Models. This allows the framework to switch between OpenAI, Anthropic, DeepSeek, or custom local models without changing the core logic.

## Core Interface: `LLMProvider`

Located in: `src/llm/types.ts`

Any class that implements this interface can be used as a provider in KairosFlow.

```typescript
export interface LLMProvider {
    /**
     * Generates a response from the LLM.
     * @param prompt - The user prompt or accumulated context.
     * @param systemPrompt - (Optional) System instructions.
     * @returns A promise resolving to the LLM response.
     */
    generate(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}
```

### `LLMResponse`

```typescript
export interface LLMResponse {
    content: string; // The raw text response
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
```

## `LLMFactory`

Located in: `src/llm/factory.ts`

The factory is responsible for instantiating the correct provider based on the configuration.

```typescript
// Usage
const provider = LLMFactory.createProvider({
    provider: 'openai', // or 'anthropic', 'deepseek', 'custom'
    model: 'gpt-4',
    apiKey: 'sk-...'
});
```

## Adding a New Provider

To add a new provider (e.g., `GeminiProvider`):

1.  Create a new file in `src/llm/providers/gemini.ts`.
2.  Implement the `LLMProvider` interface.
3.  Register it in `LLMFactory.createProvider`.

### Example Implementation

```typescript
import { LLMProvider, LLMResponse, LLMConfig } from '../types';

export class MyCustomProvider implements LLMProvider {
    constructor(private config: LLMConfig) {}

    async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
        // Call your API here
        return {
            content: "Mock response",
            usage: { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 }
        };
    }
}
```
