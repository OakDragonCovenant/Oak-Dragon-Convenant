/**
 * Oak Dragon Covenant - Division Command Center Frontend
 * Interactive dashboard for industry vertical management
 */

class DivisionCommandCenter {
    constructor(containerId, divisionRegistry) {
        this.container = document.getElementById(containerId);
        this.registry = divisionRegistry;
        this.currentDivision = null;
        this.currentEntity = null;
        this.init();
    }

    init() {
        this.renderDivisionButtons();
        this.setupEventListeners();
        this.startActivityPolling();
    }

    renderDivisionButtons() {
        const divisionsContainer = document.createElement('div');
        divisionsContainer.className = 'divisions-grid';
        divisionsContainer.innerHTML = `
            <div class="command-header">
                <h1 class="covenant-title">🧭 Division Command Center</h1>
                <div class="system-stats" id="systemStats"></div>
            </div>
            <div class="divisions-row" id="divisionsRow"></div>
        `;

        const divisions = this.registry.getAllDivisions();
        const divisionsRow = divisionsContainer.querySelector('#divisionsRow');

        divisions.forEach(division => {
            const button = document.createElement('div');
            button.className = 'division-button';
            button.setAttribute('data-division', division.id);
            button.style.borderColor = division.color;
            
            button.innerHTML = `
                <div class="division-glyph" style="color: ${division.color}">${division.glyph}</div>
                <div class="division-name">${division.name}</div>
                <div class="division-entity-count">${division.entities.length} entities</div>
                <div class="division-description">${division.description}</div>
            `;

            button.addEventListener('click', () => this.openDivision(division.id));
            divisionsRow.appendChild(button);
        });

        this.container.innerHTML = '';
        this.container.appendChild(divisionsContainer);
        this.updateSystemStats();
    }

    openDivision(divisionId) {
        this.currentDivision = divisionId;
        const division = this.registry.getDivision(divisionId);
        const entities = this.registry.getEntitiesByDivision(divisionId);

        const divisionView = document.createElement('div');
        divisionView.className = 'division-view';
        divisionView.innerHTML = `
            <div class="division-header">
                <button class="back-button" onclick="this.closest('.division-command-center').divisionCenter.renderDivisionButtons()">
                    ← Back to Divisions
                </button>
                <div class="division-title">
                    <span class="division-glyph" style="color: ${division.color}">${division.glyph}</span>
                    <h2>${division.name}</h2>
                </div>
                <button class="add-entity-button" onclick="this.closest('.division-command-center').divisionCenter.showEntityCreator('${divisionId}')">
                    + Add Entity
                </button>
            </div>

            <div class="division-content">
                <div class="entity-filters">
                    <select id="statusFilter">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Dormant">Dormant</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <select id="tierFilter">
                        <option value="">All Tiers</option>
                        <option value="Core">Core</option>
                        <option value="Seasonal">Seasonal</option>
                        <option value="Legacy">Legacy</option>
                    </select>
                    <input type="text" id="searchEntities" placeholder="Search entities..." />
                </div>

                <div class="entities-grid" id="entitiesGrid">
                    ${this.renderEntitiesGrid(entities)}
                </div>
            </div>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(divisionView);
        this.setupEntityFilters();
    }

    renderEntitiesGrid(entities) {
        if (entities.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-glyph">📋</div>
                    <h3>No entities yet</h3>
                    <p>Create your first legal entity for this division</p>
                </div>
            `;
        }

        return entities.map(entity => `
            <div class="entity-card" data-entity="${entity.id}" onclick="this.closest('.division-command-center').divisionCenter.openEntity('${entity.id}')">
                <div class="entity-header">
                    <h3 class="entity-name">${entity.name}</h3>
                    <span class="entity-status status-${entity.status.toLowerCase()}">${entity.status}</span>
                </div>
                <div class="entity-details">
                    <div class="entity-jurisdiction">📍 ${entity.jurisdiction}</div>
                    <div class="entity-type">🏛️ ${entity.entityType}</div>
                    <div class="entity-tier">⚡ ${entity.ritualTier} Tier</div>
                </div>
                <div class="entity-agents">
                    <span>🤖 ${entity.assignedAgents.length} agents assigned</span>
                </div>
                <div class="entity-activity">
                    <span>📊 ${entity.activities.length} recent activities</span>
                </div>
            </div>
        `).join('');
    }

    openEntity(entityId) {
        this.currentEntity = entityId;
        const entity = this.registry.getEntity(entityId);
        const division = this.registry.getDivision(entity.divisionId);

        const entityView = document.createElement('div');
        entityView.className = 'entity-view';
        entityView.innerHTML = `
            <div class="entity-header">
                <button class="back-button" onclick="this.closest('.division-command-center').divisionCenter.openDivision('${entity.divisionId}')">
                    ← Back to ${division.name}
                </button>
                <div class="entity-title">
                    <h2>${entity.name}</h2>
                    <span class="entity-status status-${entity.status.toLowerCase()}">${entity.status}</span>
                </div>
                <div class="entity-actions">
                    <button class="action-button" onclick="this.closest('.division-command-center').divisionCenter.triggerEntityAction('${entityId}', 'monitor')">
                        📊 Monitor
                    </button>
                    <button class="action-button" onclick="this.closest('.division-command-center').divisionCenter.triggerEntityAction('${entityId}', 'command')">
                        🎮 Command
                    </button>
                </div>
            </div>

            <div class="entity-tabs">
                ${entity.tabs.map((tab, index) => `
                    <button class="tab-button ${index === 0 ? 'active' : ''}" data-tab="${tab.replace(/\s+/g, '-').toLowerCase()}">
                        ${tab}
                    </button>
                `).join('')}
            </div>

            <div class="entity-content">
                <div class="tab-content active" data-content="overview">
                    ${this.renderEntityOverview(entity)}
                </div>
                ${entity.tabs.map(tab => `
                    <div class="tab-content" data-content="${tab.replace(/\s+/g, '-').toLowerCase()}">
                        ${this.renderTabContent(entity, tab)}
                    </div>
                `).join('')}
            </div>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(entityView);
        this.setupEntityTabs();
    }

    renderEntityOverview(entity) {
        return `
            <div class="overview-grid">
                <div class="overview-card">
                    <h3>🏛️ Entity Details</h3>
                    <div class="detail-row">
                        <span>Jurisdiction:</span>
                        <span>${entity.jurisdiction}</span>
                    </div>
                    <div class="detail-row">
                        <span>Entity Type:</span>
                        <span>${entity.entityType}</span>
                    </div>
                    <div class="detail-row">
                        <span>Ritual Tier:</span>
                        <span>${entity.ritualTier}</span>
                    </div>
                    <div class="detail-row">
                        <span>Created:</span>
                        <span>${new Date(entity.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div class="overview-card">
                    <h3>🤖 Assigned Agents</h3>
                    <div class="agents-list">
                        ${entity.assignedAgents.length > 0 ? 
                            entity.assignedAgents.map(agent => `<div class="agent-tag">${agent}</div>`).join('') :
                            '<div class="empty-message">No agents assigned</div>'
                        }
                    </div>
                </div>

                <div class="overview-card activity-card">
                    <h3>📊 Recent Activities</h3>
                    <div class="activities-list">
                        ${entity.activities.slice(0, 5).map(activity => `
                            <div class="activity-item">
                                <div class="activity-time">${new Date(activity.timestamp).toLocaleString()}</div>
                                <div class="activity-description">${activity.description}</div>
                                <div class="activity-agent">by ${activity.agentId || 'System'}</div>
                            </div>
                        `).join('')}
                        ${entity.activities.length === 0 ? '<div class="empty-message">No recent activities</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderTabContent(entity, tabName) {
        // Dynamic tab content based on division type and tab name
        const division = this.registry.getDivision(entity.divisionId);
        
        switch (division.id) {
            case 'real-estate':
                return this.renderRealEstateTab(entity, tabName);
            case 'crypto-trading':
                return this.renderCryptoTab(entity, tabName);
            case 'stock-investing':
                return this.renderStockTab(entity, tabName);
            default:
                return this.renderGenericTab(entity, tabName);
        }
    }

    renderRealEstateTab(entity, tabName) {
        switch (tabName) {
            case 'Land Deed Vault':
                return `
                    <div class="tab-content-grid">
                        <div class="content-section">
                            <h3>🗄️ Deed Registry</h3>
                            <div class="deed-list">
                                <div class="placeholder-message">Property deeds will appear here</div>
                            </div>
                        </div>
                        <div class="content-section">
                            <h3>🔐 Vault Security</h3>
                            <div class="security-status">
                                <div class="status-indicator active">Encryption Active</div>
                                <div class="status-indicator active">Backup Verified</div>
                            </div>
                        </div>
                    </div>
                `;
            case 'Zoning & Compliance':
                return `
                    <div class="compliance-dashboard">
                        <h3>📋 Compliance Status</h3>
                        <div class="compliance-grid">
                            <div class="compliance-item">
                                <span>Zoning Approval</span>
                                <span class="status-badge approved">✓ Approved</span>
                            </div>
                            <div class="compliance-item">
                                <span>Environmental Review</span>
                                <span class="status-badge pending">⏳ Pending</span>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return this.renderGenericTab(entity, tabName);
        }
    }

    renderCryptoTab(entity, tabName) {
        switch (tabName) {
            case 'Exchange Registry':
                return `
                    <div class="exchange-grid">
                        <h3>🏦 Connected Exchanges</h3>
                        <div class="exchange-list">
                            <div class="placeholder-message">Exchange connections will appear here</div>
                        </div>
                    </div>
                `;
            case 'Bot Command Center':
                return `
                    <div class="bot-dashboard">
                        <h3>🤖 Active Trading Bots</h3>
                        <div class="bot-list">
                            <div class="placeholder-message">Trading bots will appear here</div>
                        </div>
                    </div>
                `;
            default:
                return this.renderGenericTab(entity, tabName);
        }
    }

    renderStockTab(entity, tabName) {
        switch (tabName) {
            case 'Portfolio Overview':
                return `
                    <div class="portfolio-dashboard">
                        <h3>📊 Portfolio Summary</h3>
                        <div class="portfolio-stats">
                            <div class="placeholder-message">Portfolio data will appear here</div>
                        </div>
                    </div>
                `;
            default:
                return this.renderGenericTab(entity, tabName);
        }
    }

    renderGenericTab(entity, tabName) {
        return `
            <div class="generic-tab">
                <h3>🔧 ${tabName}</h3>
                <div class="tab-placeholder">
                    <p>This tab is being configured for ${entity.name}</p>
                    <p>Tab-specific functionality will be implemented here</p>
                </div>
            </div>
        `;
    }

    setupEntityTabs() {
        const tabButtons = this.container.querySelectorAll('.tab-button');
        const tabContents = this.container.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content visibility
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-content') === tabName) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupEntityFilters() {
        const statusFilter = this.container.querySelector('#statusFilter');
        const tierFilter = this.container.querySelector('#tierFilter');
        const searchInput = this.container.querySelector('#searchEntities');

        const applyFilters = () => {
            const entities = this.registry.getEntitiesByDivision(this.currentDivision);
            let filteredEntities = entities;

            // Apply status filter
            if (statusFilter.value) {
                filteredEntities = filteredEntities.filter(entity => entity.status === statusFilter.value);
            }

            // Apply tier filter
            if (tierFilter.value) {
                filteredEntities = filteredEntities.filter(entity => entity.ritualTier === tierFilter.value);
            }

            // Apply search filter
            if (searchInput.value) {
                const query = searchInput.value.toLowerCase();
                filteredEntities = filteredEntities.filter(entity => 
                    entity.name.toLowerCase().includes(query) ||
                    entity.jurisdiction.toLowerCase().includes(query) ||
                    entity.entityType.toLowerCase().includes(query)
                );
            }

            // Update grid
            const entitiesGrid = this.container.querySelector('#entitiesGrid');
            entitiesGrid.innerHTML = this.renderEntitiesGrid(filteredEntities);
        };

        statusFilter.addEventListener('change', applyFilters);
        tierFilter.addEventListener('change', applyFilters);
        searchInput.addEventListener('input', applyFilters);
    }

    showEntityCreator(divisionId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content entity-creator">
                <div class="modal-header">
                    <h3>Create New Entity</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <form class="entity-form" onsubmit="this.closest('.division-command-center').divisionCenter.createEntity(event, '${divisionId}')">
                    <div class="form-group">
                        <label>Entity Name</label>
                        <input type="text" name="name" required />
                    </div>
                    <div class="form-group">
                        <label>Jurisdiction</label>
                        <select name="jurisdiction" required>
                            <option value="">Select Jurisdiction</option>
                            <option value="Delaware">Delaware</option>
                            <option value="Nevada">Nevada</option>
                            <option value="Wyoming">Wyoming</option>
                            <option value="Cayman Islands">Cayman Islands</option>
                            <option value="British Virgin Islands">British Virgin Islands</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Entity Type</label>
                        <select name="entityType" required>
                            <option value="">Select Type</option>
                            <option value="LLC">LLC</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Trust">Trust</option>
                            <option value="Foundation">Foundation</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ritual Tier</label>
                        <select name="ritualTier" required>
                            <option value="Core">Core</option>
                            <option value="Seasonal">Seasonal</option>
                            <option value="Legacy">Legacy</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit">Create Entity</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
    }

    createEntity(event, divisionId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const entityConfig = {
            name: formData.get('name'),
            jurisdiction: formData.get('jurisdiction'),
            entityType: formData.get('entityType'),
            ritualTier: formData.get('ritualTier'),
            status: 'Active'
        };

        try {
            const entity = this.registry.createEntity(divisionId, entityConfig);
            
            // Add creation activity
            this.registry.addActivityToEntity(entity.id, {
                type: 'creation',
                description: `Entity ${entity.name} created in ${entity.jurisdiction}`,
                agentId: 'CovenantSystem'
            });

            // Close modal and refresh view
            document.querySelector('.modal-overlay').remove();
            this.openDivision(divisionId);
            
        } catch (error) {
            alert('Error creating entity: ' + error.message);
        }
    }

    triggerEntityAction(entityId, action) {
        const entity = this.registry.getEntity(entityId);
        
        switch (action) {
            case 'monitor':
                this.registry.addActivityToEntity(entityId, {
                    type: 'monitoring',
                    description: `Monitoring dashboard activated for ${entity.name}`,
                    agentId: 'MonitoringAgent'
                });
                break;
            case 'command':
                this.registry.addActivityToEntity(entityId, {
                    type: 'command',
                    description: `Command interface accessed for ${entity.name}`,
                    agentId: 'CommandAgent'
                });
                break;
        }

        // Refresh the entity view to show new activity
        this.openEntity(entityId);
    }

    updateSystemStats() {
        const stats = this.registry.getSystemStats();
        const statsContainer = this.container.querySelector('#systemStats');
        
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-value">${stats.totalDivisions}</span>
                    <span class="stat-label">Divisions</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.totalEntities}</span>
                    <span class="stat-label">Entities</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.entitiesByStatus.Active || 0}</span>
                    <span class="stat-label">Active</span>
                </div>
            `;
        }
    }

    startActivityPolling() {
        setInterval(() => {
            this.updateSystemStats();
            // You can add more real-time updates here
        }, 30000); // Update every 30 seconds
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DivisionCommandCenter;
}
