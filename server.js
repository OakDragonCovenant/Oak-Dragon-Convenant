const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Internal Modules
const CovenantSystem = require('./RealtyCovenantProtocol/Core/covenantSystem');
const StrategosSystem = require('./StrategosProtocol/Core/StrategosSystem');
const AgentNames = require('./StrategosProtocol/Core/AgentNames');
const config = require('./config/configManager');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

const app = express();

// 🛡️ Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// 🚦 Rate Limiting
const limiter = rateLimit({
    windowMs: config.security.rateLimitWindow,
    max: config.security.rateLimitMax,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.'
        }
    }
});
app.use('/api/', limiter);

// 📝 Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📊 Request Logging
app.use((req, res, next) => {
    logger.info('API Request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
    });
    next();
});

// --- Initialize Systems ---
let Covenant, Strategos;

async function initializeSystems() {
    try {
        logger.info('🚀 Initializing Oak Dragon Covenant Systems...');
        
        // Initialize Covenant System
        logger.info('--- Initializing Oak Dragon Covenant ---');
        Covenant = new CovenantSystem();
        await Covenant.boot();
        logger.info('✅ Covenant System initialized successfully');

        // Initialize Strategos System
        logger.info('--- Initializing Strategos Protocol ---');
        Strategos = new StrategosSystem();
        await Strategos.boot();
        logger.info('✅ Strategos Protocol initialized successfully');

        logger.info('🎯 All systems operational and ready for service');
    } catch (error) {
        logger.error('❌ System initialization failed', error);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

// Initialize systems
initializeSystems();

// --- Static Files & Landing Page ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Authentication Routes ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- Landing Page Routes ---
app.get('/', (req, res) => {
    logger.info('Landing page request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
    });
    
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Oak Dragon Mainframe: Covenant & Strategos Protocols are active',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        status: {
            covenant: Covenant ? 'active' : 'initializing',
            strategos: Strategos ? 'active' : 'initializing'
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: config.server.nodeEnv,
        systems: {
            covenant: Covenant ? 'operational' : 'offline',
            strategos: Strategos ? 'operational' : 'offline'
        }
    });
});

// --- OAK DRAGON COVENANT API (Real Estate) ---
const covenantRouter = express.Router();
app.use('/api/covenant', covenantRouter);

covenantRouter.get('/fund-status', async (req, res) => {
    try {
        if (!Covenant) {
            throw errorHandler.createError(
                errorHandler.errorCodes.SYSTEM_INITIALIZATION_FAILED,
                'Covenant system not initialized'
            );
        }

        const fundManager = Covenant.getAgent("Fund-Steward");
        const statusReport = await fundManager.getFundStatusReport();
        
        logger.info('Fund status requested', { requestId: req.headers['x-request-id'] });
        res.json({ 
            success: true, 
            data: statusReport,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

covenantRouter.post('/acquisition/initiate', async (req, res) => {
    try {
        const validatedData = errorHandler.validate(req.body, 'propertyAcquisition');
        
        const acquisitionAgent = Covenant.getAgent("Realty-Prime");
        const result = await acquisitionAgent.safeExecute('initiate_acquisition', async () => {
            return acquisitionAgent.prepareOffer(validatedData.price);
        });

        if (result.success) {
            logger.info('Property acquisition initiated', validatedData);
            res.json({
                success: true,
                message: 'Property acquisition initiated successfully',
                data: result.result
            });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

// --- STRATEGOS PROTOCOL API (Cryptocurrency) ---
const strategosRouter = express.Router();
app.use('/api/strategos', strategosRouter);

strategosRouter.get('/v1/portfolio-status', async (req, res) => {
    try {
        if (!Strategos) {
            throw errorHandler.createError(
                errorHandler.errorCodes.SYSTEM_INITIALIZATION_FAILED,
                'Strategos system not initialized'
            );
        }

        const portfolioArchon = Strategos.getAgent(AgentNames.Portfolio);
        const portfolioState = await portfolioArchon.getPortfolioState();
        
        logger.info('Portfolio status requested');
        res.json({ 
            success: true, 
            data: portfolioState,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

strategosRouter.post('/v1/execute-cycle', async (req, res) => {
    try {
        logger.info('Strategos cycle initiated by manual trigger');
        const strategyArchon = Strategos.getAgent(AgentNames.Strategy);
        
        const result = await strategyArchon.safeExecute('develop_trade_idea', async () => {
            return strategyArchon.developTradeIdea();
        });

        if (result.success) {
            res.status(202).json({ 
                success: true, 
                message: "Strategos strategy cycle accepted for execution",
                data: result.result
            });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

strategosRouter.post('/v1/rebalance-capital', async (req, res) => {
    try {
        logger.info('Capital rebalance initiated by manual trigger');
        const capitalArchon = Strategos.getAgent(AgentNames.Capital);
        
        const result = await capitalArchon.safeExecute('review_and_rebalance', async () => {
            return capitalArchon.reviewAndRebalance();
        });

        res.json({ 
            success: true, 
            message: "Capital allocation review complete",
            data: result.result || {}
        });
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

strategosRouter.post('/v1/review-performance', async (req, res) => {
    try {
        logger.info('Performance review initiated by manual trigger');
        const adaptationArchon = Strategos.getAgent(AgentNames.Adaptation);
        
        const result = await adaptationArchon.safeExecute('review_performance', async () => {
            return adaptationArchon.reviewPerformance();
        });

        res.json({ 
            success: true, 
            message: "Performance review complete",
            data: result.result || {}
        });
    } catch (error) {
        const errorResponse = errorHandler.createSafeErrorResponse(error);
        res.status(errorHandler.getHttpStatusCode(error.code)).json(errorResponse);
    }
});

// --- Static File Serving ---
app.use(express.static('public'));

// --- Error Handling Middleware ---
app.use(errorHandler.expressErrorHandler());

// --- 404 Handler ---
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'The requested resource was not found',
            timestamp: new Date().toISOString()
        }
    });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', async () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully...');
    
    // Deactivate all agents
    if (Covenant) {
        // Add cleanup logic for Covenant agents
    }
    if (Strategos) {
        // Add cleanup logic for Strategos agents
    }
    
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

// --- Start the Server ---
const server = app.listen(config.server.port, config.server.host, () => {
    logger.info('🚀 Oak Dragon Mainframe Server Started', {
        port: config.server.port,
        host: config.server.host,
        environment: config.server.nodeEnv,
        liveTradingEnabled: config.isLiveTradingEnabled()
    });
    
    console.log(`\n🏰 --- Oak Dragon Mainframe Server ---`);
    console.log(`🌐 Listening on http://${config.server.host}:${config.server.port}`);
    console.log(`🔧 Environment: ${config.server.nodeEnv}`);
    console.log(`💰 Live Trading: ${config.isLiveTradingEnabled() ? '🟢 ENABLED' : '🔴 DISABLED'}`);
    console.log(`📊 Logging Level: ${config.server.logLevel}`);
    console.log(`🛡️ Security: Enhanced with rate limiting and validation`);
});

module.exports = { app, server };