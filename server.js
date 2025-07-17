// Supplier Status API
const supplierStatusRoutes = require('./routes/supplierStatus');
app.use('/api/suppliers', supplierStatusRoutes);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const securityRoutes = require('./routes/security');
const path = require('path');

// Internal Modules
const CovenantSystem = require('./RealtyCovenantProtocol/Core/covenantSystem');
const StrategosSystem = require('./StrategosProtocol/Core/StrategosSystem');
const AgentNames = require('./StrategosProtocol/Core/AgentNames');
const config = require('./config/configManager');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Cloud Infrastructure
const healthCheck = require('./health-check');
const LayeredAgentFramework = require('./OakDragonCovenant/Modules/layeredAgentFramework');
const RenderWebsiteControlAgent = require('./agents/renderWebsiteControlAgent');

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
        ? [
            'https://oakdragoncovenant.com',
            'https://www.oakdragoncovenant.com',
            'https://trading.oakdragoncovenant.com',
            'https://dashboard.oakdragoncovenant.com',
            'https://api.oakdragoncovenant.com',
            'https://command.oakdragoncovenant.com',
            'https://portal.oakdragoncovenant.com',
            'https://monitor.oakdragoncovenant.com',
            'https://divisions.oakdragoncovenant.com'
        ] 
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
app.use('/api', securityRoutes);

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
let Covenant, Strategos, RenderAgent;

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

        // Initialize Render Website Control Agent
        logger.info('--- Initializing Render Website Control Agent ---');
        RenderAgent = new RenderWebsiteControlAgent();
        logger.info('✅ Render Website Control Agent initialized successfully');
        logger.info('🌐 Website deployment and Strategos integration active');

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

// 🌐 Domain-based routing middleware
app.use((req, res, next) => {
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];
    
    // Add subdomain info to request for routing decisions
    req.subdomain = subdomain;
    req.domain = host;
    
    // Log domain routing for debugging
    logger.info(`Domain routing: ${host} -> subdomain: ${subdomain}`);
    
    next();
});

// 🌐 Subdomain-specific routing
app.use((req, res, next) => {
    const subdomain = req.subdomain;
    
    switch (subdomain) {
        case 'trading':
            // Trading dashboard routes
            if (req.path === '/' || req.path === '') {
                return res.sendFile(path.join(__dirname, 'public', 'landing.html'));
            }
            break;
            
        case 'dashboard':
        case 'command':
            // Command center dashboard routes
            if (req.path === '/' || req.path === '') {
                return res.sendFile(path.join(__dirname, 'index.html'));
            }
            break;
            
        case 'divisions':
            // Division command center routes
            if (req.path === '/' || req.path === '') {
                return res.sendFile(path.join(__dirname, 'public', 'divisions.html'));
            }
            break;
            
        case 'portal':
            // Member portal routes
            if (req.path === '/' || req.path === '') {
                return res.sendFile(path.join(__dirname, 'public', 'landing.html'));
            }
            break;
            
        case 'api':
            // API routes - handle in regular routing
            break;
            
        case 'monitor':
            // Monitoring routes
            if (req.path === '/' || req.path === '') {
                return res.redirect('/cloud-status');
            }
            break;
            
        default:
            // Main domain or www - continue to regular routing
            break;
    }
    
    next();
});

// --- Authentication Routes ---

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const bankingRoutes = require('./routes/banking');
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/banking', bankingRoutes);

// --- AccountLifecycleAgent API Proxy (for UI integration) ---
// POST /api/accounts -> /api/banking/accounts
app.post('/api/accounts', (req, res, next) => {
  req.url = '/accounts';
  bankingRoutes.handle(req, res, next);
});
// GET /api/accounts -> /api/banking/accounts
app.get('/api/accounts', (req, res, next) => {
  req.url = '/accounts';
  bankingRoutes.handle(req, res, next);
});
// POST /api/accounts/:id/close (simulate close by removing or marking closed)
app.post('/api/accounts/:id/close', (req, res, next) => {
  req.url = `/accounts/${req.params.id}/close`;
  bankingRoutes.handle(req, res, next);
});
// GET /api/accounts/research (demo: return static providers)
app.get('/api/accounts/research', (req, res) => {
  res.json([
    { provider: "Bank A", type: "Business Checking", fees: "$10/mo", api: true },
    { provider: "Bank B", type: "Business Checking", fees: "$0/mo", api: false }
  ]);
});

// --- Division Command Center Routes ---
const divisionRoutes = require('./routes/divisions');
app.use('/api/divisions', divisionRoutes);

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

// Division Command Center Route
app.get('/divisions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'divisions.html'));
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

// Enhanced Health Check for Cloud Deployment
app.use('/health', healthCheck);

// Enhanced Cloud Trading Dashboard
app.get('/cloud-status', async (req, res) => {
    try {
        // Initialize Cloud Trading Framework
        const cloudFramework = new LayeredAgentFramework('CloudTrader', 'MSO_TEXAS_LLC');
        const systemStatus = cloudFramework.getSystemStatus();
        
        // Get Render Agent status if available
        const renderStatus = RenderAgent ? RenderAgent.getSystemStatus() : null;
        
        res.status(200).json({ 
            status: 'operational',
            service: 'Oak Dragon Covenant - Coinbase Cloud Trader',
            version: '2.0.0-enhanced',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: config.server.nodeEnv,
            systems: {
                covenant: Covenant ? 'operational' : 'offline',
                strategos: Strategos ? 'operational' : 'offline',
                layeredFramework: 'operational',
                renderAgent: RenderAgent ? 'active' : 'inactive',
                enhancementLayer: systemStatus.framework.layersActive >= 9 ? 'active' : 'inactive'
            },
            trading: {
                framework: systemStatus.framework,
                rituals: systemStatus.rituals,
                capabilities: [
                    'AI-Powered Trading',
                    'Multi-Exchange Support', 
                    'Risk Management',
                    'Portfolio Optimization',
                    'Intelligent Automation'
                ]
            },
            website: renderStatus ? {
                deployed: renderStatus.website.deployed,
                platform: renderStatus.website.platform,
                uptime: renderStatus.website.uptime,
                integrations: renderStatus.integrations
            } : {
                deployed: false,
                platform: 'render',
                status: 'agent-not-initialized'
            },
            cloud: {
                provider: process.env.CLOUD_PROVIDER || 'local',
                scaling: process.env.SCALING_MODE || 'manual',
                region: process.env.CLOUD_REGION || 'unknown'
            }
        });
    } catch (error) {
        logger.error('Cloud status check failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Cloud status check failed',
            timestamp: new Date().toISOString()
        });
    }
});

// --- RENDER WEBSITE CONTROL API ---
const websiteRouter = express.Router();
app.use('/api/website', websiteRouter);

websiteRouter.get('/status', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Render Agent not initialized'
            });
        }

        const status = await RenderAgent.executeRitual('!website status');
        res.json(status);
        
    } catch (error) {
        logger.error('Website status check failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

websiteRouter.post('/deploy', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Render Agent not initialized'
            });
        }

        const { environment = 'production', platform = 'render' } = req.body;
        const deployment = await RenderAgent.executeRitual(
            `!deploy website --platform=${platform} --environment=${environment}`
        );
        
        res.json(deployment);
        
    } catch (error) {
        logger.error('Website deployment failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

websiteRouter.get('/monitor', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Render Agent not initialized'
            });
        }

        const monitoring = await RenderAgent.executeRitual('!monitor website --metrics=all --alerts=standard');
        res.json(monitoring);
        
    } catch (error) {
        logger.error('Website monitoring failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// --- STRATEGOS TRADING API ---
const tradingRouter = express.Router();
app.use('/api/trading', tradingRouter);

tradingRouter.get('/status', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Trading agent not available'
            });
        }

        const systemStatus = RenderAgent.getSystemStatus();
        const tradingStatus = {
            strategos: systemStatus.strategos,
            framework: systemStatus.framework,
            website: systemStatus.website,
            integrations: systemStatus.integrations,
            timestamp: new Date().toISOString()
        };
        
        res.json({
            success: true,
            trading: tradingStatus
        });
        
    } catch (error) {
        logger.error('Trading status check failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

tradingRouter.post('/execute', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Trading agent not available'
            });
        }

        const { ritual } = req.body;
        if (!ritual) {
            return res.status(400).json({
                success: false,
                error: 'Ritual command required'
            });
        }

        const result = await RenderAgent.executeRitual(ritual);
        res.json({
            success: true,
            result
        });
        
    } catch (error) {
        logger.error('Trading execution failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

tradingRouter.get('/coinbase', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Trading agent not available'
            });
        }

        const stats = await RenderAgent.executeRitual('!microtrade stats --portfolio=8.89');
        const recommendations = await RenderAgent.executeRitual('!microtrade recommendations --portfolio=8.89 --symbols=BTC/USD,ETH/USD');
        
        res.json({
            success: true,
            coinbase: {
                statistics: stats,
                recommendations: recommendations,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        logger.error('Coinbase data retrieval failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

tradingRouter.post('/enhance', async (req, res) => {
    try {
        if (!RenderAgent) {
            return res.status(503).json({
                success: false,
                error: 'Enhancement agent not available'
            });
        }

        const { feature = 'trading', mode = 'balanced', target = 'profitability' } = req.body;
        const enhancement = await RenderAgent.executeRitual(
            `!enhance ${feature} --mode=${mode} --target=${target}`
        );
        
        res.json({
            success: true,
            enhancement
        });
        
    } catch (error) {
        logger.error('Trading enhancement failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
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