# Running pipelines with DeepSeek

KairosFlow works well with low-cost models such as DeepSeek because each agent gets a short prompt and only the context it asked for. Smaller prompts mean fewer tokens per call, and a cheaper model is often enough for a narrow task.

## Why it helps

### Limited context per step
A step declares which earlier outputs it receives:

```json
{ "agent": "AG005_Frontend.md", "context": ["AG004_UIDesign"] }
```

The frontend agent sees the UI design, not the database schema from an earlier step. Prompts stay small and the model has less noise to work through.

### JSON mode
DeepSeek exposes JSON mode through its OpenAI-compatible API. Combined with an `outputSchema` per step and automatic retries, invalid answers are caught before they reach the next agent.

## Cost

Cost depends on prompt sizes, number of agents and retries. Each artifact records `tokens_used`, so you can measure the real cost of your own pipeline instead of relying on estimates. Check current prices at the provider before planning.

## Configuration

`kairos.config.json`:

```json
{
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "responseFormat": { "type": "json_object" }
  }
}
```

Set `DEEPSEEK_API_KEY` in `.env`. The base URL defaults to `https://api.deepseek.com/v1`.

A working example lives in [`examples/e2e-deepseek`](../../examples/e2e-deepseek).
