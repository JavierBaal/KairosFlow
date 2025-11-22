import { initProject } from '../src/commands/init';
import { validateArtifact } from '../src/commands/validate';
import { runPipeline } from '../src/commands/run';

// Mock the command handlers
jest.mock('../src/commands/init');
jest.mock('../src/commands/validate');
jest.mock('../src/commands/run');

// Mock console.log to avoid cluttering output
const mockLog = jest.spyOn(console, 'log').mockImplementation(() => { });
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`Process.exit called with ${code}`);
});

describe('CLI Entry Point', () => {
    const originalArgv = process.argv;

    beforeEach(() => {
        jest.clearAllMocks();
        process.argv = [...originalArgv]; // Reset argv
    });

    afterAll(() => {
        process.argv = originalArgv;
        mockLog.mockRestore();
        mockExit.mockRestore();
    });

    const runCLI = () => {
        jest.isolateModules(() => {
            require('../src/cli');
        });
    };

    test('should execute init command', () => {
        process.argv = ['node', 'kairos', 'init'];
        runCLI();
        expect(initProject).toHaveBeenCalled();
    });

    test('should execute validate command with file argument', () => {
        const testFile = 'test-artifact.json';
        process.argv = ['node', 'kairos', 'validate', testFile];
        runCLI();
        expect(validateArtifact).toHaveBeenCalledWith(testFile);
    });

    test('should execute run command', () => {
        process.argv = ['node', 'kairos', 'run'];
        runCLI();
        expect(runPipeline).toHaveBeenCalledWith(undefined);
    });

    test('should execute run command with prompt option', () => {
        const prompt = 'Create a website';
        process.argv = ['node', 'kairos', 'run', '-p', prompt];
        runCLI();
        expect(runPipeline).toHaveBeenCalledWith(prompt);
    });
});
