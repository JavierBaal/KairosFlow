# Basic Example: Two-Agent Content Generator

## Problem

Generate a well-researched blog post.

## Solution: 2-Agent Pipeline

User → [AG001: Researcher] → [AG002: Writer] → Final Post

text

### Agent 001: Researcher

**Prompt:**
You are a research specialist. Your ONLY job is to research.

TASK: Research {{topic}}
OUTPUT: JSON with key_points, sources, unique_angles

DO NOT write the blog post.

text

### Agent 002: Writer

**Prompt:**
You are a content writer. Your ONLY job is to write.

INPUT: {{agent_001_output}}
TASK: Write 500-word blog post using research
OUTPUT: Blog post text

DO NOT research or edit.

text

## Results

| Metric | Single Agent | Two Agents | Improvement |
|--------|-------------|------------|-------------|
| Tokens | 2,000 | 500 | **75%** |
| Quality | 65% | 90% | **38%** |
| Debug | Hard | Easy | **✓** |

## Benefits

✅ Focused agents  
✅ Easy debugging  
✅ Better quality  
✅ Maintainable

---

Try it yourself with your topic!
