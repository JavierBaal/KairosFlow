# 🚀 KAIROS FLOW

> **The Enterprise-Grade Framework for Deterministic AI Pipelines.**  
> Stop building chat toys. Start building software factories.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![DeepSeek Ready](https://img.shields.io/badge/DeepSeek-Ready-purple.svg)](https://deepseek.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🤯 Why KairosFlow?

Most agent frameworks are "toolboxes" that let LLMs wander. **KairosFlow is an assembly line.**

We built this because we were tired of:
- 💸 **Token Waste:** Sending 10k tokens of history to an agent that only needs 500.
- 😵‍💫 **Hallucinations:** Asking LLMs to "please output JSON with a timestamp" and getting broken text.
- 🕸️ **Spaghetti Prompts:** "God Prompts" trying to be PM, Dev, and QA all at once.

### The Kairos Difference

| Feature | The "Toy" Way | The Kairos Way |
| :--- | :--- | :--- |
| **Metadata** | "Please include `timestamp` in your JSON..." (LLM hallucinates it) | **Zero-Hallucination Metadata:** The Backend injects truth. The LLM *never* touches metadata. |
| **Context** | Send full chat history to everyone. | **Surgical Context:** Agents see *only* what they need (Dependency Injection for Prompts). |
| **Cost** | $5.00/run (GPT-4o full context). | **$0.05/run** (DeepSeek V3 + Granular Context). |
| **Architecture** | "Let the LLM figure it out." | **Henry Ford Principle:** One Agent, One Job. Strict Assembly Line. |

---

## 💎 The "Secret Sauce"

### 1. Zero-Hallucination Metadata ™
**Stop asking LLMs to do system work.**

In KairosFlow, the Agent (LLM) is **forbidden** from generating metadata. It only generates the `output` payload. The CLI (Backend) wraps it in a `GranularArtifact` with cryptographically secure IDs, timestamps, and execution stats.

**Result:** 100% valid system data. 0% hallucination.

### 2. The DeepSeek Factory ($0.05/day)
We've optimized the architecture to work perfectly with **DeepSeek V3/R1**.
- **Native JSON Mode:** Enforced at the provider level.
- **Granular Prompts:** Small, focused prompts (<1k tokens) mean you can run complex 15-agent pipelines for pennies.
- **Local-First Design:** Ready for local models via OpenAI-compatible endpoints.

### 3. Plugin Ecosystem 🔌
Don't touch the core. Extend it.
- **Hooks:** `onPipelineStart`, `onAgentFinish`, `onInit`.
- **Use Cases:** Log to Datadog, push to Slack, commit to Git, or run custom validators.
- **Easy Install:** `npm install kairos-plugin-logger` (or write your own in 5 mins).

---

## ⚡ Quick Start

### 1. Initialize
```bash
npx kairos-flow init my-factory
cd my-factory
```

### 2. Configure (DeepSeek Example)
`kairos.config.json`:
```json
{
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "apiKey": "${DEEPSEEK_API_KEY}"
  },
  "plugins": ["./plugins/my-logger"]
}
```

### 3. Run
```bash
npx kairos-flow run
```
*Watch the assembly line go to work.*

---

## 🏛️ Architecture

### The Henry Ford Principle
We break complex tasks into atomic steps. A "Software Engineer" agent doesn't exist. Instead, we have:
1.  **Spec Analyzer** (Input: User Request -> Output: Requirements JSON)
2.  **Architect** (Input: Requirements -> Output: File Structure JSON)
3.  **Code Generator** (Input: File Structure -> Output: Code)

Each agent receives **only** the artifacts from previous steps it depends on.

👉 **[Read the Architecture Deep Dive](docs/architecture.md)**

---

## 📈 Production Case Studies

### Kairos WP (Software Factory)
- **Scale:** 15 Specialized Agents.
- **Output:** Production-ready WordPress Plugins.
- **Efficiency:** **88% reduction** in prompt complexity vs. monolithic prompts.
- **Cost:** <$0.10 per plugin generated using DeepSeek.

### Kairos Creative (Marketing Engine)
- **Scale:** 5 Agents (Strategist, Writer, SEO, QA).
- **Output:** Full SEO Campaigns.
- **Reliability:** 99.9% JSON validity rate thanks to GranularArtifactStandard.

---

## 🤝 Join the Revolution

We are building the standard for **Deterministic AI Engineering**.

- **[⭐ Star the Repo](https://github.com/JavierBaal/KairosFlow)** (It helps!)
- **[📖 Read the Docs](docs/)**
- **[🐛 Report Issues](https://github.com/JavierBaal/KairosFlow/issues)**

> *Built with ❤️ by [Javier Baal](https://x.com/javierbaal00). Powered by the Henry Ford Principle.*
