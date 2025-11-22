# ⚙️ Configuration Schema

KairosFlow uses `kairos.config.json` to define the project structure and execution pipeline.

## `kairos.config.json`

This file must reside in the root of your project.

```json
{
  "projectName": "My Pipeline",
  "llm": {
    "provider": "openai",
    "model": "gpt-4-turbo",
    "apiKey": "sk-...", // Optional if using env vars
    "baseUrl": "..." // Optional override
  },
  "pipeline": [
    "AG001_Researcher.md",
    "AG002_Writer.md"
  ]
}
```

## Internal Types

### `LLMConfig`

Located in: `src/llm/types.ts`

```typescript
export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'deepseek' | 'custom';
    model: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
}
```

### `PipelineConfig`

Currently defined implicitly in `src/commands/run.ts`.

```typescript
interface KairosConfig {
  projectName: string;
  llm: LLMConfig;
  pipeline: string[]; // Array of agent filenames in execution order
}
```

## Environment Variables

KairosFlow automatically loads `.env` files using `dotenv`.

- `OPENAI_API_KEY`: Default key for OpenAI provider.
- `ANTHROPIC_API_KEY`: Default key for Anthropic provider.
- `DEEPSEEK_API_KEY`: Default key for DeepSeek provider.

It is recommended to use environment variables for API keys instead of hardcoding them in `kairos.config.json`.
