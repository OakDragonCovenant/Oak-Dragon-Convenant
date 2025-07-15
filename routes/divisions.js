/**
 * Oak Dragon Covenant - Division API Router
 * Backend API for Division Command Center functionality
 */

const express = require('express');
const router = express.Router();
const CovenantDivisionRegistry = require('../OakDragonCovenant/Modules/covenantDivisionRegistry');

// Initialize division registry
const divisionRegistry = new CovenantDivisionRegistry();

// Add some sample data for demonstration
divisionRegistry.createEntity('real-estate', {
    name: 'Dragon Properties LLC',
    jurisdiction: 'Delaware',
    entityType: 'LLC',
    ritualTier: 'Core',
    assignedAgents: ['PropertyAgent', 'ValuationAgent']
});

divisionRegistry.createEntity('crypto-trading', {
    name: 'Covenant Digital Assets Corp',
    jurisdiction: 'Wyoming',
    entityType: 'Corporation',
    ritualTier: 'Core',
    assignedAgents: ['TradingBot', 'AnalyticsAgent']
});

divisionRegistry.createEntity('self-banking', {
    name: 'Oak Financial Trust',
    jurisdiction: 'Nevada',
    entityType: 'Trust',
    ritualTier: 'Legacy',
    assignedAgents: ['BankingAgent', 'ComplianceAgent']
});

// Routes

// Get all divisions
router.get('/divisions', (req, res) => {
    try {
        const divisions = divisionRegistry.getAllDivisions();
        res.json({
            success: true,
            data: divisions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get specific division
router.get('/divisions/:divisionId', (req, res) => {
    try {
        const division = divisionRegistry.getDivision(req.params.divisionId);
        if (!division) {
            return res.status(404).json({
                success: false,
                error: 'Division not found'
            });
        }
        
        const entities = divisionRegistry.getEntitiesByDivision(req.params.divisionId);
        
        res.json({
            success: true,
            data: {
                division,
                entities
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all entities
router.get('/entities', (req, res) => {
    try {
        const { division, status, ritualTier, search } = req.query;
        
        let entities = Array.from(divisionRegistry.entities.values());
        
        // Apply filters
        if (division) {
            entities = entities.filter(entity => entity.divisionId === division);
        }
        
        if (status) {
            entities = entities.filter(entity => entity.status === status);
        }
        
        if (ritualTier) {
            entities = entities.filter(entity => entity.ritualTier === ritualTier);
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            entities = entities.filter(entity => 
                entity.name.toLowerCase().includes(searchLower) ||
                entity.jurisdiction.toLowerCase().includes(searchLower) ||
                entity.entityType.toLowerCase().includes(searchLower)
            );
        }
        
        res.json({
            success: true,
            data: entities,
            count: entities.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get specific entity
router.get('/entities/:entityId', (req, res) => {
    try {
        const entity = divisionRegistry.getEntity(req.params.entityId);
        if (!entity) {
            return res.status(404).json({
                success: false,
                error: 'Entity not found'
            });
        }
        
        res.json({
            success: true,
            data: entity,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create new entity
router.post('/entities', (req, res) => {
    try {
        const { divisionId, name, jurisdiction, entityType, ritualTier, assignedAgents } = req.body;
        
        if (!divisionId || !name || !jurisdiction || !entityType) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: divisionId, name, jurisdiction, entityType'
            });
        }
        
        const entityConfig = {
            name,
            jurisdiction,
            entityType,
            ritualTier: ritualTier || 'Core',
            assignedAgents: assignedAgents || []
        };
        
        const entity = divisionRegistry.createEntity(divisionId, entityConfig);
        
        // Add creation activity
        divisionRegistry.addActivityToEntity(entity.id, {
            type: 'creation',
            description: `Entity ${entity.name} created via API`,
            agentId: 'DivisionAPI'
        });
        
        res.status(201).json({
            success: true,
            data: entity,
            message: 'Entity created successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update entity
router.put('/entities/:entityId', (req, res) => {
    try {
        const entity = divisionRegistry.getEntity(req.params.entityId);
        if (!entity) {
            return res.status(404).json({
                success: false,
                error: 'Entity not found'
            });
        }
        
        const { name, jurisdiction, entityType, status, ritualTier, assignedAgents } = req.body;
        
        // Update entity properties
        if (name) entity.name = name;
        if (jurisdiction) entity.jurisdiction = jurisdiction;
        if (entityType) entity.entityType = entityType;
        if (status) entity.status = status;
        if (ritualTier) entity.ritualTier = ritualTier;
        if (assignedAgents) entity.assignedAgents = assignedAgents;
        
        entity.lastUpdated = new Date().toISOString();
        
        // Add update activity
        divisionRegistry.addActivityToEntity(entity.id, {
            type: 'update',
            description: `Entity ${entity.name} updated via API`,
            agentId: 'DivisionAPI'
        });
        
        res.json({
            success: true,
            data: entity,
            message: 'Entity updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Add activity to entity
router.post('/entities/:entityId/activities', (req, res) => {
    try {
        const entity = divisionRegistry.getEntity(req.params.entityId);
        if (!entity) {
            return res.status(404).json({
                success: false,
                error: 'Entity not found'
            });
        }
        
        const { type, description, agentId, ritualContext, data } = req.body;
        
        if (!type || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, description'
            });
        }
        
        const activity = divisionRegistry.addActivityToEntity(req.params.entityId, {
            type,
            description,
            agentId: agentId || 'API',
            ritualContext,
            data
        });
        
        res.status(201).json({
            success: true,
            data: activity,
            message: 'Activity added successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get entity activities
router.get('/entities/:entityId/activities', (req, res) => {
    try {
        const entity = divisionRegistry.getEntity(req.params.entityId);
        if (!entity) {
            return res.status(404).json({
                success: false,
                error: 'Entity not found'
            });
        }
        
        const { limit = 50 } = req.query;
        const activities = entity.activities.slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: activities,
            count: activities.length,
            totalCount: entity.activities.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get system statistics
router.get('/stats', (req, res) => {
    try {
        const stats = divisionRegistry.getSystemStats();
        
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Export division data
router.get('/divisions/:divisionId/export', (req, res) => {
    try {
        const exportData = divisionRegistry.exportDivisionData(req.params.divisionId);
        
        res.setHeader('Content-Disposition', `attachment; filename="division-${req.params.divisionId}-${Date.now()}.json"`);
        res.setHeader('Content-Type', 'application/json');
        
        res.json({
            success: true,
            data: exportData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check for division system
router.get('/health', (req, res) => {
    try {
        const stats = divisionRegistry.getSystemStats();
        
        res.json({
            success: true,
            status: 'operational',
            service: 'Division Command Center API',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            systemInfo: {
                divisionsLoaded: stats.totalDivisions,
                entitiesTracked: stats.totalEntities,
                activitiesLogged: stats.recentActivities.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'error',
            error: error.message
        });
    }
});

module.exports = router;
