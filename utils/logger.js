const winston = require('winston');
const path = require('path');

/**
 * 📊 Advanced Logging System for Oak Dragon Covenant
 * Provides structured logging with multiple transports and log levels
 */
class LoggerService {
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const logEntry = {
                        timestamp,
                        level: level.toUpperCase(),
                        message,
                        ...meta
                    };
                    return JSON.stringify(logEntry, null, 2);
                })
            ),
            defaultMeta: { service: 'oak-dragon-covenant' },
            transports: [
                // Console output for development
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, agent, action, ...meta }) => {
                            const agentInfo = agent ? `[${agent}]` : '';
                            const actionInfo = action ? `{${action}}` : '';
                            return `🕐 ${timestamp} ${level}: ${agentInfo}${actionInfo} ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                        })
                    )
                }),
                // File logging for persistent storage
                new winston.transports.File({
                    filename: path.join(__dirname, '../logs/error.log'),
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                new winston.transports.File({
                    filename: path.join(__dirname, '../logs/combined.log'),
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                })
            ]
        });

        // Create logs directory if it doesn't exist
        this.ensureLogsDirectory();
    }

    ensureLogsDirectory() {
        const fs = require('fs');
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    // 🎯 Agent-specific logging methods
    agentAction(agentName, action, message, meta = {}) {
        this.logger.info(message, { agent: agentName, action, ...meta });
    }

    agentError(agentName, action, error, meta = {}) {
        this.logger.error(error.message || error, { 
            agent: agentName, 
            action, 
            stack: error.stack,
            ...meta 
        });
    }

    // 💰 Trading-specific logging
    tradeExecuted(trade) {
        this.logger.info('Trade executed', {
            category: 'trading',
            action: 'execute',
            symbol: trade.symbol,
            side: trade.side,
            amount: trade.amount,
            price: trade.price,
            profit: trade.profit
        });
    }

    tradeError(trade, error) {
        this.logger.error('Trade execution failed', {
            category: 'trading',
            action: 'execute_failed',
            symbol: trade.symbol,
            error: error.message,
            stack: error.stack
        });
    }

    // 🏠 Real Estate logging
    propertyAcquisition(property) {
        this.logger.info('Property acquisition initiated', {
            category: 'real_estate',
            action: 'acquisition',
            property: property.address,
            price: property.price,
            financing: property.financing
        });
    }

    // 🔐 Security logging
    securityEvent(event, details) {
        this.logger.warn('Security event detected', {
            category: 'security',
            event,
            ...details
        });
    }

    // 📊 Performance logging
    performanceMetric(metric, value, unit = '') {
        this.logger.info('Performance metric', {
            category: 'performance',
            metric,
            value,
            unit
        });
    }

    // Standard logging methods
    info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    error(message, meta = {}) {
        this.logger.error(message, meta);
    }

    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
}

module.exports = new LoggerService();
