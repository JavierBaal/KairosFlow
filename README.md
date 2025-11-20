# 🚀 KAIROS FLOW – Multi-Agent Prompt Framework

> **The battle-tested multi-agent framework**  
> Core architecture powering two production-grade platforms: **Kairos Creative** (Marketing) and **Kairos WP** (Software Development).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/javierbaal/multi-agent-prompt-framework?style=social)](https://github.com/javierbaal/multi-agent-prompt-framework)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 The Origin Story: Why We Built KAIROS FLOW

KAIROS FLOW was born from a real production problem: **cognitive overload** and **prompt drift** in complex multi-agent systems.  
In our first projects, trying to make a single LLM handle too many responsibilities (analyze requirements, design architecture, and write code) produced 3,000+ token prompts that were hard to control, expensive, and nearly impossible to debug.  

We needed a framework that could:  

- Split complexity into **small, specialized agents**.  
- Standardize data exchange between agents.  
- Orchestrate context so each agent sees only what it truly needs.  
- Scale from marketing use cases to full software development pipelines.  

That framework became **KAIROS FLOW**.  

---

## 🧠 Core Principles

KAIROS FLOW is built on three non‑negotiable principles:

### 1. Henry Ford Principle – One Agent, One Job

Instead of one giant “god prompt” that tries to do everything, each agent has a **single, sharply defined responsibility** (PM, Architect, Developer, QA, etc.).  

Result:  
- Smaller prompts  
- Less hallucination  
- Easier debugging  

---

### 2. GranularArtifactStandard

All agents speak the same language: a **standard JSON artifact** describing input, output, metadata, and validation.  

Benefits:  
- Consistent structure across agents  
- Traceability of every decision  
- Easy logging, analytics, and debugging  

---

### 3. Context Orchestration

A **Context Orchestrator** decides what each agent really needs to see.  

Instead of:  

- Passing the entire conversation + specs + docs to every agent  

We do:  

- Minimal, tailored context per agent, based on dependencies and role  

Result:  
- Massive token savings  
- More focused reasoning  
- Better control over behavior  

---

## ✨ Key Features

- **Granular Agent Architecture** – From 2–3 simple agents up to 15+ in complex pipelines.  
- **Standardized Artifacts** – `GranularArtifactStandard v1.0.0` for all inputs/outputs.  
- **Context Orchestrator Pattern** – Smart, minimal context injection.  
- **Model-Agnostic** – Works with GPT‑4, Claude, Gemini, DeepSeek, etc.  
- **Domain-Agnostic** – Used in production for **marketing** and **software development**.  
- **Production-Proven** – 79–88% reduction in prompt complexity, verified in real products.  

---

## 🏛️ Architecture Overview

At a high level, a KAIROS FLOW pipeline looks like this:

User Request
↓
[Context Orchestrator]
↓
[Agent Pipeline]
↓
┌─────────────┐ ┌───────────────┐ ┌─────────────┐
│ Agent 001 │ → │ Agent 002 │ → │ Agent 003 │
│ (PM / Spec) │ │ (Architect) │ │ (Dev) │
└─────────────┘ └───────────────┘ └─────────────┘
↓ ↓ ↓
[Artifact] [Artifact] [Artifact]
└────────────────────┬────────────────────┘
↓
[Final Output]

text

Core building blocks:

1. **Agents** – Small, focused roles (PM, Architect, Dev, QA, etc.).  
2. **Artifacts** – JSON payloads passed between agents, validated at each step.  
3. **Orchestrator** – Controls ordering, dependencies, and context injection.  

For a full deep dive, see:  
👉 `docs/architecture.md`  

---

## 🚀 Quick Start

There are two main ways to start using KAIROS FLOW: **conceptual template** and **code examples**.

### Option 1: Use the Software Development Template

1. Open: `templates/software-development-pipeline.md`  
2. Copy the agent prompts and responsibilities.  
3. Adapt them to your stack (Node, Python, PHP, etc.).  
4. Run the pipeline manually in your LLM of choice (Claude, GPT‑4, DeepSeek, etc.).  

This is the fastest way to internalize the **Henry Ford + Orchestrator + Artifacts** pattern.  

---

### Option 2: Run the Examples

Clone the repo:

git clone https://github.com/javierbaal/multi-agent-prompt-framework.git
cd multi-agent-prompt-framework

text

Explore the examples:

- `examples/basic/two-agent-content.md` – Simple 2‑agent content pipeline.  
- `examples/intermediate/` – 5‑agent pipelines (content + QA, etc.).  
- `examples/advanced/` – Full software pipelines (including Kairos WP case study).  

Use them as blueprints to build your own system.  

---

## 📈 Production Case Studies

KAIROS FLOW already powers two commercial platforms in production:

### Case Study 1 – Kairos Creative V2 (Marketing)

High‑volume, low‑cost content and campaign generation.  

| Metric        | Detail                                             | Impact                             |
|--------------|----------------------------------------------------|------------------------------------|
| Domain       | Marketing / Copywriting                            | Scales campaigns for agencies      |
| LLM Used     | DeepSeek R1 / V3                                   | ~0.01€ cost per campaign           |
| Agents       | Strategist, Copywriter, SEO Auditor, QA, etc.      | Structured multi‑step workflows    |
| Outcome      | Consistent, on‑brand campaigns at scale            | Productized as Kairos Creative     |

---

### Case Study 2 – Kairos WP (Software Development)

Complex, high‑fidelity software creation (WordPress plugins).  

| Metric          | Detail                                 | Impact                                     |
|----------------|----------------------------------------|-------------------------------------------|
| Domain         | Software / WordPress plugin dev        | From idea → production‑ready plugins      |
| Agents         | 15 specialized roles (PM, Arch, Dev…)  | 88% reduction in prompt complexity        |
| Core Pattern   | Auditor + Orchestrator + Artifact Flow | Guarantees quality, security, coherence   |
| Output         | Production‑grade PHP/JS code           | Powers the Kairos WP platform             |

These case studies prove that **the same framework** can handle both:  

- Content/marketing pipelines.  
- Complex software engineering pipelines.  

---

## 📚 Documentation

Recommended reading order:

1. `docs/getting-started.md`  
   - Core concepts  
   - First 2–3 agent pipeline  
2. `docs/architecture.md`  
   - Full Henry Ford breakdown  
   - GranularArtifactStandard v1.0.0  
   - Context Orchestrator internals  
3. `templates/software-development-pipeline.md`  
   - 10‑agent software pipeline template  
4. `examples/`  
   - From basic to advanced, including Kairos WP.  

---

## 💡 Example Pipelines

### 1. Content Generation (3 Agents)

- AG001 – Researcher  
- AG002 – Writer  
- AG003 – Editor  

Use: `examples/basic/two-agent-content.md` as starting point and add an editor agent.  

---

### 2. Software Development (10 Agents)

- AG001 – Product Manager  
- AG002 – System Architect  
- AG003 – Database Designer  
- AG004 – Backend Developer  
- AG005 – Frontend Developer  
- AG006 – Security Engineer  
- AG007 – QA Engineer  
- AG008 – Bug Fixer  
- AG009 – Documentation Writer  
- AG010 – DevOps Engineer  

Use: `templates/software-development-pipeline.md` + `examples/advanced/`.  

---

## 🤝 Contributing

Contributions are very welcome:

- 🐛 Fix bugs in docs or templates.  
- 💡 Propose new agents or patterns.  
- 📖 Add real‑world examples.  
- 🌍 Translate documentation.  

Before opening a PR, please read:  

👉 `CONTRIBUTING.md`  

---

## 📜 License

KAIROS FLOW is licensed under the **MIT License**.  

You can:  

- ✅ Use it commercially.  
- ✅ Modify it.  
- ✅ Distribute it.  
- ✅ Embed it into your own products.  

See `LICENSE` for full details.  

---

## 💬 Support & Community

- 🐛 Issues: GitHub **Issues** tab  
- 💡 Ideas & Q&A: GitHub **Discussions**  
- 🔔 Updates: Follow `@javierbaal` on X  

Support:  
[GitHub Discussions](https://github.com/javierbaal/multi-agent-prompt-framework/discussions)  

---

## 👤 Author

**Javier Baal**  

- GitHub: [@javierbaal](https://github.com/javierbaal)  
- X / Twitter: [@javierbaal00](https://twitter.com/javierbaal00)  

---

<div align="center">

**If KAIROS FLOW helps you ship better systems, consider:**

⭐ Starring the repo • 🧩 Sharing your pipelines in Discussions • ☕ Sponsoring future work  

**Built with ❤️ by the creator of Kairos Creative and Kairos WP.**  

</div>