# Vanguard Hive: A KairosFlow Showcase

[https://github.com/user-attachments/assets/457f4891-ca90-4bee-b3ab-a71aad606b38](https://github.com/user-attachments/assets/c92b1380-0b19-4242-a32c-3cb1973f6597)

**Vanguard Hive** is a virtual creative agency built on the [KairosFlow](../README.md) approach: five AI agents, each with one job, prepare an advertising campaign from a conversation. This document is a case study of how it was designed. The product itself is not publicly available at the moment.

The routers described below (state router, semantic router) live in the Vanguard Hive application. The framework in this repository provides the core they are built on: ordered pipelines, the artifact standard, per-agent context and schema validation.

> **"Any sufficiently advanced technology is indistinguishable from magic."** — Fran C. Clarke

Vanguard Hive operates as a **Virtual Creative Agency**, where a team of 5 AI agents collaborates to build professional advertising campaigns. Under the hood, it is a rigorous implementation of KairosFlow's **Atomic Jobs**, **State Routers**, and **Granular Artifacts**.

---

## The Magic vs. The Logic

Here is how specific KairosFlow patterns power the "human" experience of Vanguard Hive.

### 1. The Interview (Alex)
**The User Experience:**  
You chat with **Alex**, your Account Manager. He feels like a senior partner—he listens, asks clarifying questions, and guides you through a briefing process without ever losing the thread. He never "forgets" your previous answers, even in long conversations.

**The KairosFlow Logic:**  
Alex is not a monolith. He is powered by the **Atomic Job Pattern**.  
- **State Router:** Every turn of conversation is analyzed. Is the user still defining the audience? Or have they moved to objectives?  
- **Structured Extraction:** While Alex replies conversationally, his hidden output is a strict JSON object updating the `CreativeBrief` artifact.  
- **Result:** He doesn't just "remember"; he *builds* a deterministic database record of your requirements in real-time.

### 2. The Brainstorming (Laura)
**The User Experience:**  
**Laura** (Creative Strategist) debates ideas with you. You can reject her proposals, ask for "more edge," or pivot entirely. She adapts instantly without hallucinating or breaking the previous context.

**The KairosFlow Logic:**  
Laura relies on the **Semantic Router** and **Context Diet**.  
- **Semantic Classification:** Before every response, a lightweight model classifies your intent: `DISCUSSION` vs. `EXECUTION`.  
- **Context Diet:** We strip away the chat history that isn't relevant to the strategy, feeding her only the *approved* Brief from Alex and the *current* thread.  
- **Zero-Corruption:** She can brainstorm indefinitely. Only when the router detects `EXECUTION` intent does she commit a final `StrategyArtifact` to the pipeline.

### 3. The Execution (Migue & Lucía)
**The User Experience:**  
**Migue** (Copywriter) and **Lucía** (Art Director) produce deliverables that feel cohesive. The copy matches the visual mood. The tone matches the strategy.

**The KairosFlow Logic:**  
This is the **Granular Artifact Standard** in action.  
- **Dependency Graph:** Migue *requires* Laura's `StrategyArtifact`. Lucía *requires* Fran's `CreativeDirection`.  
- **Context Injection:** When Migue writes meaningful copy, we inject his *own* previous draft as context with a `Self-Correction` tag, allowing him to polish his work just like a human writer would.  
- **Outcome:** A multi-modal output (Text + Visual Prompts) that is perfectly aligned because it shares a single, validated truth.

---

## The Agent Team Architecture

Vanguard Hive proves that specialized agents beat generalist models.

| Agent | Visual Role | KairosFlow Implementation | Patterns Used |
| :--- | :--- | :--- | :--- |
| **Alex** | Account Manager | `Job: Briefing` + `State Router` | *Atomic Jobs, Structured Extraction* |
| **Laura** | Creative Strategist | `Job: Strategy` + `Semantic Router` | *Context Diet, Intent Classification* |
| **Fran** | Creative Director | `Job: Concept` | *Granular Artifacts, Dependency Injection* |
| **Migue** | Copywriter | `Job: Copywriting` | *Self-Correction Injection, Multi-Shot* |
| **Lucía** | Art Director | `Job: Art Direction` | *Prompt Engineering, Style Consistency* |
| **Alex QA** | Quality Assurance | `Job: QA` | *Final Validation, Consistency Check* |

---

## Why It Matters

Vanguard Hive is where the idea behind KairosFlow was tested: treat prompts as code and conversations as data structures. That gave a system where:
1.  **Requirements live in the artifact:** if it is not in the JSON brief, downstream agents do not get it.
2.  **Agents can be added independently:** We can add a new agent (for example, video) without retraining the Strategy Agent.
3.  **Costs Less:** Specialized, smaller prompts (Context Diet) are cheaper and faster than massive context windows.

Designed by [Fran Barbero](https://www.vanguardhive.com).
