# KairosFlow

[![CI](https://github.com/JavierBaal/KairosFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/JavierBaal/KairosFlow/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command-line framework for multi-agent LLM pipelines. Each agent does one job, returns JSON, and the framework checks that JSON before the next agent sees it.

https://github.com/user-attachments/assets/018e4a85-9486-448d-85c7-eb14c06698a1

KairosFlow is a research project. It started from a practical problem: long, all-purpose prompts become impossible to debug, and models invent details when they are asked to do too many things at once. The approach here is to split the work into small agents, pass only the context each one needs, and reject output that does not match a schema.

---

## What it does

- **Runs agents in a declared order.** A pipeline is a list of Markdown prompts in `agents/`, executed in the order set in `kairos.config.json` (or alphabetically if no order is set).
- **Controls context per agent.** A step can declare which earlier outputs it receives. Everything else stays out of its prompt.
- **Validates every output.** Responses must parse as JSON and, optionally, satisfy a JSON Schema. Invalid output is sent back to the model with the validation errors, up to a set number of retries. If it still fails, the pipeline stops.
- **Keeps a trace.** Each step is saved as an artifact in `artifacts/`, with metadata written by the framework, not the model: timestamp, model, tokens used, execution time and number of attempts.
- **Works with several providers.** OpenAI, Anthropic, DeepSeek, and any OpenAI-compatible endpoint (including local servers that expose that API).
- **Plugins.** Lifecycle hooks (`onPipelineStart`, `onAgentStart`, `onAgentFinish`, `onPipelineFinish`) and custom providers.
- **Dashboard.** A small local web view of pipeline progress and artifacts.

---

## Install

KairosFlow is not published on npm. Install it from GitHub (Node 20 or later):

```bash
npm install -g github:JavierBaal/KairosFlow
```

Or clone and link:

```bash
git clone https://github.com/JavierBaal/KairosFlow.git
cd KairosFlow
npm install
npm link
```

## Quickstart

```bash
kairos init            # asks for a project name and a provider
cd my-kairos-pipeline
# add your API key to .env
kairos run -p "Write a launch plan for a neighbourhood bakery"
```

Other commands:

```bash
kairos validate artifacts/001-product-manager_output.json   # check an artifact
kairos dashboard --port 3000                                # local dashboard
```

---

## Configuring a pipeline

`kairos.config.json`:

```json
{
  "projectName": "content-pipeline",
  "llm": { "provider": "openai", "model": "gpt-4o" },
  "maxRetries": 1,
  "pipeline": [
    "AG001_Research.md",
    {
      "agent": "AG002_Outline.md",
      "context": ["AG001_Research"],
      "outputSchema": "schemas/outline.json",
      "maxRetries": 2
    },
    {
      "agent": "AG003_Draft.md",
      "context": ["AG002_Outline"]
    }
  ]
}
```

A step is either a file name or an object with:

| Field | Meaning |
|---|---|
| `agent` | Markdown prompt in `agents/`. `{{user_request}}` is replaced with the `-p` text. |
| `context` | Names of earlier steps whose output this agent receives. Omit it to pass all earlier outputs. Asking for a step that has not run yet is an error. |
| `outputSchema` | Path to a JSON Schema the output must satisfy. |
| `maxRetries` | Re-prompts allowed after an invalid answer. Defaults to the top-level `maxRetries`, or 1. |

In the example, `AG003_Draft` never sees the research notes, only the outline that was built from them.

## The artifact

Every step is stored in the same envelope (validated with Zod):

```json
{
  "agent_id": "AG002_Outline",
  "agent_name": "AG002_Outline",
  "responsibility": "Agent Execution",
  "input": { "context_keys": ["AG001_Research"] },
  "output": { "...": "the agent's JSON" },
  "metadata": {
    "timestamp": "2026-11-10T10:12:03.511Z",
    "status": "success",
    "model": "gpt-4o",
    "tokens_used": 1834,
    "execution_time_ms": 4120,
    "attempts": 2
  },
  "validation": {
    "is_valid": true,
    "checks_passed": ["json_parse", "output_schema", "artifact_envelope"]
  }
}
```

The model only writes `output`. The rest is filled in by the framework, so fields like timestamps or status cannot be made up by the model.

---

## Case study: Vanguard Hive

https://github.com/user-attachments/assets/c92b1380-0b19-4242-a32c-3cb1973f6597

Vanguard Hive is a virtual creative agency where five agents (account manager, strategist, creative director, copywriter and art director, plus a QA step) prepare an advertising campaign from a conversation with the client. It is where the ideas in this repository were tried first. The product is not publicly available at the moment.

[Read the case study](docs/SHOWCASE_VANGUARD_HIVE.md)

---

## Limitations

- Validation checks structure, not truth. A schema can require a `price` field; it cannot tell whether the price is right.
- Retries cost tokens. Keep schemas strict but realistic.
- Steps run sequentially. There is no branching or parallel execution yet.
- The dashboard is a minimal local tool, not a monitoring product.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Tests cover the pipeline engine (ordering, context selection, schema retries, metadata) with a scripted fake provider, so no API key is needed.

## Docs

- [Getting started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [Backend-owned metadata](docs/concepts/zero-hallucination.md)
- [Running cheap pipelines with DeepSeek](docs/concepts/deepseek-factory.md)

## License

MIT. Designed by [Fran Barbero](https://www.vanguardhive.com).
