# 🧠 Zero-Hallucination Metadata

> **The Problem:** You ask an LLM to "generate a JSON with a unique ID and the current timestamp."
> **The Reality:** The LLM hallucinates a random ID (that might collide) and a timestamp from its training data or a random future date.

## The Kairos Solution: Backend-Driven Metadata

In KairosFlow, we treat the LLM as a **logic engine**, not a **system clock**.

### How It Works

1.  **The Agent's Job:** The Agent is strictly forbidden from generating metadata. It focuses 100% of its attention on the `output` payload.
2.  **The Backend's Job:** The Kairos CLI (running in Node.js) intercepts the agent's output and wraps it in a `GranularArtifact`.
3.  **The Injection:** The CLI calculates the *real* timestamp, generates a *cryptographically secure* UUID, and measures the *actual* token usage.

### Architecture Comparison

#### ❌ The "Toy" Approach (Standard Frameworks)

**Prompt:**
```text
You are a writer. Write a blog post.
Also, please output a JSON object with:
- id: a unique uuid
- timestamp: now
- content: your text
```

**Result (Risk):**
```json
{
  "id": "12345", // Collision risk
  "timestamp": "2023-10-01...", // Hallucinated date
  "content": "..."
}
```

#### ✅ The Kairos Way (Enterprise-Grade)

**Prompt:**
```text
You are a writer. Write a blog post.
Output ONLY the content in JSON format.
```

**Agent Output:**
```json
{
  "title": "My Post",
  "body": "..."
}
```

**System Injection (CLI):**
```typescript
// src/commands/run.ts
const artifact = {
  agent_id: "AG002_Writer",
  output: agentOutput, // Injected here
  metadata: {
    id: crypto.randomUUID(), // Real UUID
    timestamp: new Date().toISOString(), // Real Time
    model: "deepseek-chat", // Real Config
    tokens: usage.total_tokens // Real Metrics
  }
};
```

### Benefits

1.  **Zero Hallucinations:** System data is always correct.
2.  **Token Savings:** You don't waste tokens explaining how to format dates or IDs.
3.  **Security:** Traceability is guaranteed by the runtime, not the AI.
