import { GranularArtifactSchema } from '../src/schemas/artifact';

describe('GranularArtifactSchema', () => {
    it('should validate a correct artifact', () => {
        const validArtifact = {
            agent_id: 'AG001',
            agent_name: 'Test Agent',
            responsibility: 'Testing',
            input: { key: 'value' },
            output: { result: 'success' },
            metadata: {
                timestamp: new Date().toISOString(),
                status: 'success',
                tokens_used: 100
            },
            validation: {
                is_valid: true,
                checks_passed: ['format']
            }
        };

        const result = GranularArtifactSchema.safeParse(validArtifact);
        expect(result.success).toBe(true);
    });

    it('should fail validation for missing required fields', () => {
        const invalidArtifact = {
            agent_id: 'AG001',
            // Missing agent_name and responsibility
            input: {},
            output: {},
            metadata: {
                timestamp: new Date().toISOString(),
                status: 'success'
            }
        };

        const result = GranularArtifactSchema.safeParse(invalidArtifact);
        expect(result.success).toBe(false);
    });
});
