const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * 🛡️ Comprehensive Error Handling & Validation System
 * Provides standardized error handling and input validation across the entire system
 */
class ErrorHandler {
    constructor() {
        this.errorCodes = {
            // System Errors (1000-1999)
            SYSTEM_INITIALIZATION_FAILED: 1001,
            AGENT_SPAWN_FAILED: 1002,
            CONFIGURATION_ERROR: 1003,
            
            // Trading Errors (2000-2999)
            INVALID_TRADE_PARAMETERS: 2001,
            EXCHANGE_CONNECTION_FAILED: 2002,
            INSUFFICIENT_FUNDS: 2003,
            TRADE_EXECUTION_FAILED: 2004,
            RISK_LIMIT_EXCEEDED: 2005,
            
            // Real Estate Errors (3000-3999)
            PROPERTY_VALUATION_FAILED: 3001,
            FINANCING_UNAVAILABLE: 3002,
            ACQUISITION_FAILED: 3003,
            FUND_CAPACITY_EXCEEDED: 3004,
            
            // Security Errors (4000-4999)
            AUTHENTICATION_FAILED: 4001,
            AUTHORIZATION_DENIED: 4002,
            RATE_LIMIT_EXCEEDED: 4003,
            INVALID_API_KEY: 4004,
            
            // Validation Errors (5000-5999)
            INVALID_INPUT: 5001,
            MISSING_REQUIRED_FIELD: 5002,
            FORMAT_ERROR: 5003
        };
    }

    /**
     * Creates a standardized error object
     */
    createError(code, message, details = {}) {
        const error = new Error(message);
        error.code = code;
        error.details = details;
        error.timestamp = new Date().toISOString();
        return error;
    }

    /**
     * Handles errors with appropriate logging and response
     */
    handleError(error, context = {}) {
        const errorInfo = {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message,
            stack: error.stack,
            context,
            timestamp: error.timestamp || new Date().toISOString()
        };

        // Log based on error severity
        if (this.isCriticalError(error.code)) {
            logger.error('Critical error occurred', errorInfo);
        } else {
            logger.warn('Error handled', errorInfo);
        }

        return errorInfo;
    }

    /**
     * Checks if an error is critical
     */
    isCriticalError(errorCode) {
        const criticalCodes = [
            this.errorCodes.SYSTEM_INITIALIZATION_FAILED,
            this.errorCodes.EXCHANGE_CONNECTION_FAILED,
            this.errorCodes.AUTHENTICATION_FAILED
        ];
        return criticalCodes.includes(errorCode);
    }

    /**
     * Validation schemas for different data types
     */
    getValidationSchemas() {
        return {
            tradeOrder: Joi.object({
                symbol: Joi.string().required(),
                side: Joi.string().valid('buy', 'sell').required(),
                amount: Joi.number().positive().required(),
                price: Joi.number().positive().optional(),
                type: Joi.string().valid('market', 'limit').default('market')
            }),

            propertyAcquisition: Joi.object({
                address: Joi.string().required(),
                price: Joi.number().positive().required(),
                financing: Joi.string().required(),
                propertyType: Joi.string().valid('SFR', 'Multi-Family', 'Commercial', 'Land').required()
            }),

            agentConfig: Joi.object({
                name: Joi.string().min(1).max(50).required(),
                type: Joi.string().required(),
                dependencies: Joi.object().default({})
            }),

            fundAllocation: Joi.object({
                series: Joi.string().required(),
                amount: Joi.number().positive().required(),
                purpose: Joi.string().required()
            })
        };
    }

    /**
     * Validates input data against schema
     */
    validate(data, schemaName) {
        const schemas = this.getValidationSchemas();
        const schema = schemas[schemaName];
        
        if (!schema) {
            throw this.createError(
                this.errorCodes.INVALID_INPUT,
                `Unknown validation schema: ${schemaName}`
            );
        }

        const { error, value } = schema.validate(data);
        
        if (error) {
            throw this.createError(
                this.errorCodes.INVALID_INPUT,
                `Validation failed: ${error.details[0].message}`,
                { validationErrors: error.details }
            );
        }

        return value;
    }

    /**
     * Express error middleware
     */
    expressErrorHandler() {
        return (err, req, res, next) => {
            const errorInfo = this.handleError(err, {
                url: req.url,
                method: req.method,
                userAgent: req.get('User-Agent'),
                ip: req.ip
            });

            const statusCode = this.getHttpStatusCode(err.code);
            
            res.status(statusCode).json({
                success: false,
                error: {
                    code: errorInfo.code,
                    message: errorInfo.message,
                    timestamp: errorInfo.timestamp
                }
            });
        };
    }

    /**
     * Maps error codes to HTTP status codes
     */
    getHttpStatusCode(errorCode) {
        const codeMap = {
            [this.errorCodes.INVALID_INPUT]: 400,
            [this.errorCodes.MISSING_REQUIRED_FIELD]: 400,
            [this.errorCodes.FORMAT_ERROR]: 400,
            [this.errorCodes.AUTHENTICATION_FAILED]: 401,
            [this.errorCodes.AUTHORIZATION_DENIED]: 403,
            [this.errorCodes.RATE_LIMIT_EXCEEDED]: 429,
            [this.errorCodes.SYSTEM_INITIALIZATION_FAILED]: 500,
            [this.errorCodes.TRADE_EXECUTION_FAILED]: 500
        };

        return codeMap[errorCode] || 500;
    }

    /**
     * Creates a safe error response for APIs
     */
    createSafeErrorResponse(error) {
        return {
            success: false,
            error: {
                code: error.code || 'INTERNAL_ERROR',
                message: error.message || 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            }
        };
    }
}

module.exports = new ErrorHandler();
