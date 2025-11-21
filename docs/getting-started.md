# Getting Started with KAIROS FLOW - Multi-Agent Prompt Framework

Welcome! This guide will get you up and running with the Multi-Agent Prompt Framework in **under 10 minutes**.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Core Concepts](#core-concepts)
- [Your First Agent Pipeline](#your-first-agent-pipeline)
- [Next Steps](#next-steps)

---

## Prerequisites

You'll need:

- Basic understanding of LLMs (GPT-4, Claude, etc.)
- Familiarity with prompt engineering
- A problem that could benefit from multi-agent architecture

**No coding required!** This framework is model-agnostic and works with any LLM.

---

## Core Concepts

### 1. The Henry Ford Principle

> **One agent, one responsibility.**

Instead of:
```
Single Agent → [Do everything] → Output
```

Do this:
```
Agent 1 → [Research] → Agent 2 → [Write] → Agent 3 → [Edit] → Output
```

**Why?** Smaller, focused prompts = better outputs, easier debugging.

### 2. GranularArtifactStandard

All agents exchange data using a standardized format:

```
{
  "agent_id": "AG001",
  "responsibility": "Research",
  "input": {
    "topic": "Multi-agent systems"
  },
  "output": {
    "findings": "...",
    "sources": ["..."]
  },
  "metadata": {
    "timestamp": "2025-11-19T00:00:00Z",
    "tokens_used": 450
  }
}
```

**Why?** Consistency, traceability, easy debugging.

### 3. Context Orchestrator

Instead of passing ALL context to ALL agents:

```
Agent 1 needs: User request only
Agent 2 needs: User request + Agent 1 output
Agent 3 needs: Agent 2 output only (not Agent 1)
```

**Why?** Minimal tokens, faster processing, better focus.

---

## Your First Agent Pipeline

Let's build a simple **blog post generator** with 3 agents.

### Step 1: Define Responsibilities

```
## Agent 001: Researcher
**Responsibility:** Research the topic
**Input:** Topic from user
**Output:** Key points and sources

## Agent 002: Writer
**Responsibility:** Write the draft
**Input:** Research from Agent 001
**Output:** Blog post draft

## Agent 003: Editor
**Responsibility:** Improve the draft
**Input:** Draft from Agent 002
**Output:** Final polished blog post
```

### Step 2: Create Agent Prompts

**Agent 001 (Researcher):**
```
You are a research specialist. Your ONLY job is to research.

CONTEXT:
- Topic: {{user_topic}}

YOUR TASK:
1. Find 3-5 key points about this topic
2. List credible sources
3. Identify unique angles

OUTPUT FORMAT (JSON):
{
  "key_points": ["point 1", "point 2", ...],
  "sources": ["source 1", "source 2", ...],
  "unique_angles": ["angle 1", "angle 2", ...]
}

DO NOT write the blog post. Only research.
```

**Agent 002 (Writer):**
```
You are a content writer. Your ONLY job is to write.

CONTEXT:
- Research: {{agent_001_output}}

YOUR TASK:
1. Write a 500-word blog post
2. Use the research provided
3. Include a hook, body, and conclusion

OUTPUT FORMAT:
Plain text blog post (500 words)

DO NOT edit for grammar. Only write.
```

**Agent 003 (Editor):**
```
You are an editor. Your ONLY job is to edit.

CONTEXT:
- Draft: {{agent_002_output}}

YOUR TASK:
1. Fix grammar and spelling
2. Improve readability
3. Ensure proper structure

OUTPUT FORMAT:
Final polished blog post

DO NOT rewrite completely. Only edit.
```

### Step 3: Run the Pipeline

```
User: "Write a blog post about AI in healthcare"

→ Agent 001 (Researcher)
  Output: {key_points: [...], sources: [...]}

→ Agent 002 (Writer)
  Input: Agent 001 output
  Output: Draft blog post (500 words)

→ Agent 003 (Editor)
  Input: Agent 002 output
  Output: Final polished post
```

### Step 4: Measure Results

**Before framework (single agent):**
- Prompt: 2,000 tokens
- Quality: 60% satisfactory
- Debugging: Difficult

**After framework (3 agents):**
- Total prompts: 600 tokens (200 each)
- Quality: 90% satisfactory
- Debugging: Easy (know exactly which agent failed)

**Improvement:** 70% reduction in complexity! 🎉

---

## Next Steps

### Learn More

- **[Architecture Deep Dive](architecture.md)** - Understand the full system
- **[Best Practices](best-practices.md)** - Production-ready patterns
- **[Anti-Patterns](anti-patterns.md)** - Common mistakes to avoid

### See Examples

- **[Basic Examples](../examples/basic/)** - 2-3 agent systems
- **[Intermediate Examples](../examples/intermediate/)** - 5-agent systems
- **[Advanced Examples](../examples/advanced/)** - Production implementations

### Get Help

- 💬 [GitHub Discussions](https://github.com/javierbaal/multi-agent-prompt-framework/discussions)
- 🐛 [Report Issues](https://github.com/javierbaal/multi-agent-prompt-framework/issues)
- 🐦 [Follow @javierbaal](https://twitter.com/javierbaal)

---

## Quick Tips

### ✅ DO
- Give each agent ONE clear responsibility
- Use GranularArtifactStandard for data exchange
- Inject only necessary context
- Test each agent individually first
- Document your pipeline

### ❌ DON'T
- Make agents do multiple things
- Pass all context to all agents
- Skip validation between agents
- Forget to document responsibilities

---

## Success Checklist

- [ ] I understand the Henry Ford principle
- [ ] I can identify distinct responsibilities
- [ ] I know how to structure agent prompts
- [ ] I've built my first pipeline
- [ ] I measured the improvement

**Ready to build something amazing?** 🚀

Start with a simple problem and apply the framework. You'll see immediate results!

---

**Questions?** Ask in [Discussions](https://github.com/javierbaal/multi-agent-prompt-framework/discussions)!
