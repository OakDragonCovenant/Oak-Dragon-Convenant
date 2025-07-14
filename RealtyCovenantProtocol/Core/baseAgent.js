const logger = require('../../utils/logger');

/**
 * 🤖 Enhanced foundational class for all agents in the Oak Dragon Covenant.
 * Provides advanced logging, error handling, and lifecycle management.
 */
class BaseAgent {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.status = 'initialized';
        this.lastActivity = new Date();
        this.errorCount = 0;
        this.maxErrors = 5;
        
        logger.agentAction(this.name, 'initialize', `Agent [${this.name}] of type [${this.type}] initialized`);
    }

    /**
     * Reports the agent's name and type to the console and logs.
     */
    reportStatus() {
        const statusMessage = `Agent [${this.name}] of type [${this.type}] is ${this.status}`;
        console.log(statusMessage);
        logger.agentAction(this.name, 'status_report', statusMessage);
    }

    /**
     * Activates the agent and sets status to active
     */
    activate() {
        this.status = 'active';
        this.lastActivity = new Date();
        logger.agentAction(this.name, 'activate', `Agent [${this.name}] activated`);
        console.log(`🟢 ${this.name}: Agent activated and ready for operations`);
    }

    /**
     * Deactivates the agent
     */
    deactivate() {
        this.status = 'inactive';
        logger.agentAction(this.name, 'deactivate', `Agent [${this.name}] deactivated`);
        console.log(`🔴 ${this.name}: Agent deactivated`);
    }

    /**
     * Updates the last activity timestamp
     */
    updateActivity() {
        this.lastActivity = new Date();
    }

    /**
     * Safe execution wrapper with error handling
     */
    async safeExecute(actionName, operation) {
        try {
            this.updateActivity();
            logger.agentAction(this.name, actionName, `Executing ${actionName}`);
            
            const result = await operation();
            
            logger.agentAction(this.name, actionName, `Successfully completed ${actionName}`);
            return { success: true, result };
        } catch (error) {
            this.errorCount++;
            logger.agentError(this.name, actionName, error);
            
            if (this.errorCount >= this.maxErrors) {
                this.status = 'error_limit_exceeded';
                logger.agentError(this.name, 'critical_error', 
                    new Error(`Agent exceeded maximum error count (${this.maxErrors})`));
            }
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Gets agent health status
     */
    getHealthStatus() {
        const uptime = Date.now() - this.lastActivity.getTime();
        return {
            name: this.name,
            type: this.type,
            status: this.status,
            lastActivity: this.lastActivity,
            uptime: uptime,
            errorCount: this.errorCount,
            healthy: this.status === 'active' && this.errorCount < this.maxErrors
        };
    }

    /**
     * Resets error count (for recovery scenarios)
     */
    resetErrors() {
        this.errorCount = 0;
        if (this.status === 'error_limit_exceeded') {
            this.status = 'active';
        }
        logger.agentAction(this.name, 'reset_errors', 'Error count reset');
    }
}

module.exports = BaseAgent;