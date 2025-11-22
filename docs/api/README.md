# 📚 Internal API Documentation

This section documents the internal interfaces and modules of KairosFlow. It is intended for contributors and plugin developers who want to extend the framework.

## Modules

- **[LLM Provider API](llm-provider.md)**: Interfaces for implementing new LLM providers.
- **[Configuration Schema](configuration.md)**: Details on `kairos.config.json` and internal configuration objects.

## Directory Structure

- `src/llm/`: Logic for LLM abstraction and providers.
- `src/schemas/`: Zod schemas for validation (Artifacts, Config).
- `src/commands/`: CLI command implementations.
