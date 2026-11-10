# Backend-owned metadata

> **The problem:** ask a model to "return JSON with an ID and the current timestamp" and it will make both up. The ID may collide; the date may come from its training data.

## How KairosFlow handles it

The model is treated as a reasoning step, not as a system clock.

1. **The agent's job:** return the business payload only. The system prompt tells it not to add `agent_id`, `metadata` or similar fields.
2. **The framework's job:** parse the answer, check it, and wrap it in a `GranularArtifact`.
3. **What the framework writes:** the real timestamp, the configured model name, the token count reported by the provider, the measured execution time and the number of attempts.

### Comparison

**Asking the model for system fields:**

```text
You are a writer. Write a blog post.
Also output a JSON object with:
- id: a unique uuid
- timestamp: now
- content: your text
```

```json
{
  "id": "12345",
  "timestamp": "2023-10-01T00:00:00Z",
  "content": "..."
}
```

**With KairosFlow, the agent returns only the content:**

```json
{
  "title": "My post",
  "body": "..."
}
```

**And the framework builds the envelope** (`src/core/pipeline.ts`):

```typescript
const candidate = {
  agent_id: step.name,
  output,                                   // the agent's JSON
  metadata: {
    timestamp: new Date().toISOString(),
    status: 'success',
    model,                                  // from kairos.config.json
    tokens_used: tokens,                    // reported by the provider
    execution_time_ms: Date.now() - started,
    attempts,
  },
  validation: { is_valid: true, checks_passed: [...checks, 'artifact_envelope'] },
};
```

### What this gives you

1. **Reliable system fields.** Timestamps, model names and metrics in the trace come from the runtime.
2. **Shorter prompts.** No tokens spent explaining date or ID formats.
3. **Traceability.** Each artifact records how many attempts it took and which checks it passed.

### What it does not do

It does not stop the model from inventing things inside `output`. For that, use an `outputSchema` per step (structure) and keep each agent's context limited to what it needs (fewer chances to mix up sources). Checking facts is still a job for a human or a dedicated QA agent.
