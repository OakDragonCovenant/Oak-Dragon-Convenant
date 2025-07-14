const BaseAgent = require('./baseAgent');

class OracleAgent extends BaseAgent {
  /**
   * @param {Object} services
   * @param {KnowledgeService} services.knowledgeService
   * @param {CacheService} [services.cacheService]
   */
    constructor({ knowledgeService, cacheService } = {}) {
    super();
    this.knowledgeService = knowledgeService;
    this.cacheService = cacheService;
  }

  /**
   * Executes a query against the knowledge base.
   * @param {string} question
   * @returns {Promise<Answer>}
   */
  async query(question) {
    // TODO: check cache → fetch from knowledgeService → store in cache
  }
}

module.exports = OracleAgent;