# 🏭 The DeepSeek Factory

> **Build Enterprise Software for the price of a gumball.**

KairosFlow is optimized to leverage the extreme cost-efficiency of **DeepSeek V3** (and R1) without sacrificing reliability. By combining DeepSeek's low pricing with KairosFlow's **Context Orchestration**, we achieve economics that make "AI Factories" viable.

## The Economics

Let's compare the cost of running a **15-Agent Software Development Pipeline** (Spec -> Arch -> Code -> QA).

| Metric | GPT-4o (Standard Framework) | DeepSeek V3 + KairosFlow |
| :--- | :--- | :--- |
| **Context Strategy** | Full History (10k+ tokens/step) | **Surgical Context** (500 tokens/step) |
| **Input Cost** | $2.50 / 1M tokens | **$0.14 / 1M tokens** |
| **Output Cost** | $10.00 / 1M tokens | **$0.28 / 1M tokens** |
| **Total Pipeline Cost** | ~$4.50 per run | **~$0.05 per run** |
| **Reduction** | - | **99% Cheaper** |

## How We Do It

It's not just about switching models. It's about **Architecture**.

### 1. Surgical Context Injection
DeepSeek V3 is powerful, but like all LLMs, it can get confused with too much noise.
KairosFlow's **Context Orchestrator** ensures that Agent 5 (Frontend Dev) *only* sees the UI Design from Agent 4, not the Database Schema from Agent 3 (unless explicitly requested).
This keeps prompts small (<1k tokens), which maximizes DeepSeek's reasoning capabilities.

### 2. Native JSON Mode
KairosFlow leverages DeepSeek's native JSON mode (via OpenAI compatibility layer) to ensure that even at high speeds, the output adheres to the `GranularArtifactStandard`.

### 3. Caching (Coming Soon)
We are implementing DeepSeek's Context Caching to drive costs down even further for repetitive tasks.

## Configuration

To turn your KairosFlow pipeline into a DeepSeek Factory:

`kairos.config.json`:
```json
{
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "apiKey": "${DEEPSEEK_API_KEY}",
    "baseUrl": "https://api.deepseek.com/v1"
  }
}
```

*Stop burning money. Start building factories.*
