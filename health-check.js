// Oak Dragon Covenant - Health Check Endpoint
const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Oak Dragon Covenant Coinbase Trader',
        version: '2.0.0-enhanced',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        features: {
            enhancementLayer: process.env.ENHANCEMENT_LAYER_ENABLED === 'true',
            aiModels: process.env.AI_MODELS_ENABLED === 'true',
            predictionEngine: process.env.PREDICTION_ENGINE_ENABLED === 'true',
            automation: process.env.AUTOMATION_LEVEL || 'disabled'
        }
    };
    
    res.json(healthStatus);
});

app.get('/', (req, res) => {
    res.json({
        message: '🐉 Oak Dragon Covenant - Coinbase Cloud Trader',
        status: 'operational',
        timestamp: new Date().toISOString(),
        version: '2.0.0-enhanced',
        endpoints: {
            health: '/health',
            trading: '/api/trading',
            monitoring: '/api/monitor'
        }
    });
});

// If this file is run directly, start a simple server
if (require.main === module) {
    const port = process.env.PORT || 10000;
    app.listen(port, () => {
        console.log(`🐉 Oak Dragon Covenant Health Check running on port ${port}`);
        console.log(`🌐 Health endpoint: http://localhost:${port}/health`);
    });
}

module.exports = app;
