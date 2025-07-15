/**
 * Oak Dragon Covenant - Division Registry System
 * Manages industry verticals and their associated legal entities
 */

class CovenantDivisionRegistry {
    constructor() {
        this.divisions = new Map();
        this.entities = new Map();
        this.initializeDivisions();
    }

    initializeDivisions() {
        // Define all industry divisions with their mythic and operational characteristics
        const divisionConfigs = [
            {
                id: 'real-estate',
                name: 'Real Estate',
                glyph: '🏡',
                color: '#8B4513',
                description: 'Sacred land acquisition, asset tokenization, and property sanctification',
                capabilities: ['Asset Registry', 'Deed Rituals', 'Zoning Overlays', 'Sacred Land Tokens'],
                defaultTabs: ['Land Deed Vault', 'Zoning & Compliance', 'Asset Tokenization', 'Property Timeline']
            },
            {
                id: 'crypto-trading',
                name: 'Crypto Trading',
                glyph: '🪙',
                color: '#FFD700',
                description: 'Multi-exchange automation, bot orchestration, and digital asset mastery',
                capabilities: ['Exchange Mapping', 'Bot Deployments', 'Fee Optimization', 'Trading Rituals'],
                defaultTabs: ['Exchange Registry', 'Bot Command Center', 'Fee Analysis', 'Trading History']
            },
            {
                id: 'stock-investing',
                name: 'Stock Investing',
                glyph: '📈',
                color: '#006400',
                description: 'Traditional market wisdom, portfolio sanctification, and equity governance',
                capabilities: ['Portfolio Management', 'Market Analysis', 'Risk Assessment', 'Dividend Tracking'],
                defaultTabs: ['Portfolio Overview', 'Market Positions', 'Performance Analytics', 'Investment Timeline']
            },
            {
                id: 'e-commerce',
                name: 'E-Commerce',
                glyph: '🛒',
                color: '#FF6347',
                description: 'Digital marketplace mastery, brand sanctums, and commerce rituals',
                capabilities: ['Store Management', 'Inventory Tracking', 'Order Processing', 'Customer Analytics'],
                defaultTabs: ['Store Dashboard', 'Product Catalog', 'Order Management', 'Analytics Hub']
            },
            {
                id: 'education',
                name: 'Education & Coaching',
                glyph: '🎓',
                color: '#4169E1',
                description: 'Knowledge transmission, mentor lineages, and wisdom cultivation',
                capabilities: ['Curriculum Design', 'Student Tracking', 'Certification', 'Mentor Network'],
                defaultTabs: ['Course Library', 'Student Portal', 'Certification Vault', 'Mentor Registry']
            },
            {
                id: 'self-banking',
                name: 'Self Banking',
                glyph: '🏦',
                color: '#2F4F4F',
                description: 'Personal finance sovereignty, cashflow rituals, and monetary sanctification',
                capabilities: ['Account Management', 'Transaction Tracking', 'Budget Planning', 'Investment Allocation'],
                defaultTabs: ['Account Overview', 'Transaction History', 'Budget Dashboard', 'Investment Tracker']
            },
            {
                id: 'private-insurance',
                name: 'Private Insurance',
                glyph: '🛡️',
                color: '#8A2BE2',
                description: 'Risk mitigation, coverage sanctification, and protection protocols',
                capabilities: ['Policy Management', 'Claims Processing', 'Risk Assessment', 'Coverage Analysis'],
                defaultTabs: ['Policy Vault', 'Claims Center', 'Risk Dashboard', 'Coverage Map']
            },
            {
                id: 'business-acquisition',
                name: 'Business Acquisition',
                glyph: '🏢',
                color: '#DC143C',
                description: 'Strategic acquisitions, due diligence rituals, and integration mastery',
                capabilities: ['Target Analysis', 'Due Diligence', 'Deal Management', 'Integration Planning'],
                defaultTabs: ['Target Registry', 'Deal Pipeline', 'Due Diligence', 'Integration Hub']
            }
        ];

        // Initialize all divisions
        divisionConfigs.forEach(config => {
            this.divisions.set(config.id, {
                ...config,
                entities: [],
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            });
        });
    }

    getDivision(divisionId) {
        return this.divisions.get(divisionId);
    }

    getAllDivisions() {
        return Array.from(this.divisions.values());
    }

    createEntity(divisionId, entityConfig) {
        const division = this.divisions.get(divisionId);
        if (!division) {
            throw new Error(`Division ${divisionId} not found`);
        }

        const entity = {
            id: entityConfig.id || `${divisionId}-entity-${Date.now()}`,
            name: entityConfig.name,
            jurisdiction: entityConfig.jurisdiction,
            entityType: entityConfig.entityType,
            status: entityConfig.status || 'Active',
            ritualTier: entityConfig.ritualTier || 'Core',
            assignedAgents: entityConfig.assignedAgents || [],
            tabs: [...division.defaultTabs, ...(entityConfig.customTabs || [])],
            activities: [],
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            divisionId: divisionId
        };

        // Add entity to both division and global registry
        division.entities.push(entity.id);
        this.entities.set(entity.id, entity);
        division.lastUpdated = new Date().toISOString();

        return entity;
    }

    getEntitiesByDivision(divisionId) {
        const division = this.divisions.get(divisionId);
        if (!division) return [];

        return division.entities.map(entityId => this.entities.get(entityId)).filter(Boolean);
    }

    getEntity(entityId) {
        return this.entities.get(entityId);
    }

    addActivityToEntity(entityId, activity) {
        const entity = this.entities.get(entityId);
        if (!entity) {
            throw new Error(`Entity ${entityId} not found`);
        }

        const activityEntry = {
            id: `activity-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: activity.type,
            description: activity.description,
            data: activity.data || {},
            agentId: activity.agentId,
            ritualContext: activity.ritualContext
        };

        entity.activities.unshift(activityEntry);
        entity.lastUpdated = new Date().toISOString();

        // Keep only last 100 activities per entity
        if (entity.activities.length > 100) {
            entity.activities = entity.activities.slice(0, 100);
        }

        return activityEntry;
    }

    searchEntities(query, filters = {}) {
        const allEntities = Array.from(this.entities.values());
        
        let filteredEntities = allEntities;

        // Apply text search
        if (query) {
            filteredEntities = filteredEntities.filter(entity => 
                entity.name.toLowerCase().includes(query.toLowerCase()) ||
                entity.jurisdiction.toLowerCase().includes(query.toLowerCase()) ||
                entity.entityType.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply filters
        if (filters.division) {
            filteredEntities = filteredEntities.filter(entity => entity.divisionId === filters.division);
        }

        if (filters.status) {
            filteredEntities = filteredEntities.filter(entity => entity.status === filters.status);
        }

        if (filters.ritualTier) {
            filteredEntities = filteredEntities.filter(entity => entity.ritualTier === filters.ritualTier);
        }

        return filteredEntities;
    }

    getSystemStats() {
        const stats = {
            totalDivisions: this.divisions.size,
            totalEntities: this.entities.size,
            entitiesByDivision: {},
            entitiesByStatus: {},
            entitiesByTier: {},
            recentActivities: []
        };

        // Count entities by division
        this.divisions.forEach((division, divisionId) => {
            stats.entitiesByDivision[divisionId] = division.entities.length;
        });

        // Count entities by status and tier
        this.entities.forEach(entity => {
            stats.entitiesByStatus[entity.status] = (stats.entitiesByStatus[entity.status] || 0) + 1;
            stats.entitiesByTier[entity.ritualTier] = (stats.entitiesByTier[entity.ritualTier] || 0) + 1;
        });

        // Get recent activities from all entities
        const allActivities = [];
        this.entities.forEach(entity => {
            entity.activities.forEach(activity => {
                allActivities.push({
                    ...activity,
                    entityName: entity.name,
                    entityId: entity.id,
                    divisionId: entity.divisionId
                });
            });
        });

        stats.recentActivities = allActivities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        return stats;
    }

    exportDivisionData(divisionId) {
        const division = this.divisions.get(divisionId);
        if (!division) {
            throw new Error(`Division ${divisionId} not found`);
        }

        const entities = this.getEntitiesByDivision(divisionId);
        
        return {
            division: division,
            entities: entities,
            exportTimestamp: new Date().toISOString(),
            entityCount: entities.length
        };
    }

    importDivisionData(divisionData) {
        const { division, entities } = divisionData;
        
        // Update or create division
        this.divisions.set(division.id, division);
        
        // Import entities
        entities.forEach(entity => {
            this.entities.set(entity.id, entity);
        });
        
        return {
            success: true,
            divisionsImported: 1,
            entitiesImported: entities.length
        };
    }
}

module.exports = CovenantDivisionRegistry;
