// Minimal KairosFlow plugin. Reference it from kairos.config.json:
//   "plugins": ["./plugins/simple-logger/index.js"]
module.exports = {
  name: 'simple-logger',
  version: '1.0.0',

  onInit: async (config) => {
    console.log(`[SimpleLogger] Initialized with project: ${config.projectName}`);
  },

  onPipelineStart: async () => {
    console.log('[SimpleLogger] Pipeline started');
  },

  onAgentStart: async (agentName) => {
    console.log(`[SimpleLogger] Agent ${agentName} is starting`);
  },

  onAgentFinish: async (agentName, artifact) => {
    const keys = artifact.output && typeof artifact.output === 'object' ? Object.keys(artifact.output) : [];
    console.log(`[SimpleLogger] Agent ${agentName} finished. Output keys: ${keys.join(', ')}`);
  },

  onPipelineFinish: async () => {
    console.log('[SimpleLogger] Pipeline finished');
  },
};
