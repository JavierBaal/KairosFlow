import { z } from 'zod';

// GranularArtifactStandard v1.0.0 Implementation
export const GranularArtifactSchema = z.object({
  agent_id: z.string().describe("Unique identifier for the agent (e.g., AG001)"),
  agent_name: z.string().describe("Human-readable name of the agent"),
  responsibility: z.string().describe("Single specific responsibility of this agent"),
  input: z.record(z.any()).describe("Context and data provided to the agent"),
  output: z.union([z.record(z.any()), z.string(), z.array(z.any())]).describe("The work produced by the agent"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    tokens_used: z.number().optional(),
    execution_time_ms: z.number().optional(),
    status: z.enum(['success', 'error', 'pending']),
    model: z.string().optional()
  }),
  validation: z.object({
    is_valid: z.boolean(),
    checks_passed: z.array(z.string()),
    errors: z.array(z.string()).optional()
  }).optional()
});

export type GranularArtifact = z.infer<typeof GranularArtifactSchema>;