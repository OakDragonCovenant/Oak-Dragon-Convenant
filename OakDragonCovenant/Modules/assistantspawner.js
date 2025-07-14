// Modules/assistantSpawner.js

const assistantRegistry = require('./assistantRegistry');

class AssistantSpawner {
  /**
   * @param {string} callerName - Name of the agent that is spawning an assistant.
   */
  constructor(callerName = "UnknownAgent") {
    this.caller = callerName;
  }

  /**
   * Spawn an assistant to help with a specific task.
   * @param {string} taskDescription - Clear description of the task to delegate.
   * @param {string} assistantType - Type of assistant to use (e.g. "DeepResearch", "LegalParse").
   * @returns {object} - Structured instruction output for downstream parsing.
   */
  async spawn(taskDescription, assistantType = "GeneralResearch") {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${this.caller} spawning '${assistantType}' for: ${taskDescription}`);

    let result;

    try {
      result = await this.delegateToAssistant(taskDescription, assistantType);
    } catch (error) {
      result = `Error during assistant delegation: ${error.message}`;
    }

    return {
      module: this.caller,
      action: "assistantDelegation",
      payload: {
        task: taskDescription,
        assistantType,
        result
      },
      timestamp
    };
  }

  /**
   * Internal router that sends task to correct assistant module.
   * @param {string} taskDescription - The instruction to process.
   * @param {string} assistantType - The assistant category.
   * @returns {string} - Assistant response.
   */
  async delegateToAssistant(taskDescription, assistantType) {
    const assistantModule = assistantRegistry[assistantType];

    if (!assistantModule || typeof assistantModule.handle !== "function") {
      throw new Error(`No valid assistant found for type '${assistantType}'`);
    }

    return await assistantModule.handle(taskDescription);
  }
}

module.exports = AssistantSpawner;