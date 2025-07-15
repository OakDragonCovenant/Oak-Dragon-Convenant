// Oak Dragon Covenant Portal JavaScript

class OakDragonPortal {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.activeTab = 'overview';
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.startDataRefresh();
        this.loadInitialData();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Automation toggles
        document.querySelectorAll('.automation-toggle input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.toggleAutomation(e.target.id, e.target.checked);
            });
        });

        // Settings toggles
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateSetting(e.target.id, e.target.checked);
            });
        });
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.activeTab = tabId;
        this.loadTabData(tabId);
    }

    async loadTabData(tabId) {
        try {
            switch (tabId) {
                case 'overview':
                    await this.loadOverviewData();
                    break;
                case 'real-estate':
                    await this.loadRealEstateData();
                    break;
                case 'crypto-trading':
                    await this.loadTradingData();
                    break;
                case 'ai-intelligence':
                    await this.loadAIData();
                    break;
                case 'monitoring':
                    await this.loadMonitoringData();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${tabId} data:`, error);
            this.showError(`Failed to load ${tabId} data`);
        }
    }

    async loadInitialData() {
        await this.updateSystemStatus();
        await this.loadOverviewData();
    }

    async updateSystemStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const health = await response.json();
            
            // Update system status indicator
            const statusElement = document.getElementById('system-status');
            if (health.status === 'healthy') {
                statusElement.querySelector('i').style.color = '#38a169';
                statusElement.querySelector('span').textContent = 'System Online';
            } else {
                statusElement.querySelector('i').style.color = '#e53e3e';
                statusElement.querySelector('span').textContent = 'System Issues';
            }
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    async loadOverviewData() {
        try {
            // Load portfolio status
            const portfolioResponse = await fetch(`${this.apiBaseUrl}/api/strategos/v1/portfolio-status`);
            const portfolioData = await portfolioResponse.json();
            
            if (portfolioData.success) {
                this.updatePortfolioMetrics(portfolioData.data);
            }

            // Load recent activity
            await this.loadRecentActivity();
        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    async loadRealEstateData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/covenant/fund-status`);
            const data = await response.json();
            
            if (data.success) {
                this.updateRealEstateMetrics(data.data);
            }
        } catch (error) {
            console.error('Error loading real estate data:', error);
        }
    }

    async loadTradingData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/strategos/v1/portfolio-status`);
            const data = await response.json();
            
            if (data.success) {
                this.updateTradingDashboard(data.data);
            }
        } catch (error) {
            console.error('Error loading trading data:', error);
        }
    }

    async loadAIData() {
        // Simulate AI intelligence data
        const insights = [
            {
                priority: 'high',
                title: 'Market Volatility Alert',
                content: 'Detected unusual BTC volume patterns suggesting potential 8% move within 4 hours.',
                time: '12 minutes ago'
            },
            {
                priority: 'medium',
                title: 'Real Estate Opportunity',
                content: 'Chicago market showing 15% undervaluation in Lincoln Park area properties.',
                time: '1 hour ago'
            },
            {
                priority: 'low',
                title: 'Portfolio Optimization',
                content: 'Suggested rebalancing could improve risk-adjusted returns by 3.2%.',
                time: '3 hours ago'
            }
        ];

        this.updateAIInsights(insights);
    }

    async loadMonitoringData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const health = await response.json();
            
            this.updateSystemMetrics(health);
        } catch (error) {
            console.error('Error loading monitoring data:', error);
        }
    }

    async loadRecentActivity() {
        const activities = [
            {
                type: 'crypto',
                title: 'BTC Trade Executed',
                time: '2 minutes ago',
                value: '+$450',
                positive: true
            },
            {
                type: 'realty',
                title: 'Property Analysis Complete',
                time: '15 minutes ago',
                value: 'Chicago, IL',
                positive: false
            },
            {
                type: 'ai',
                title: 'Market Intelligence Update',
                time: '1 hour ago',
                value: 'High Confidence',
                positive: false
            }
        ];

        const activityFeed = document.querySelector('.activity-feed');
        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-${this.getActivityIcon(activity.type)} activity-icon ${activity.type}"></i>
                <div class="activity-content">
                    <span class="activity-title">${activity.title}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
                <span class="activity-value ${activity.positive ? 'positive' : ''}">${activity.value}</span>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            crypto: 'coins',
            realty: 'home',
            ai: 'brain'
        };
        return icons[type] || 'circle';
    }

    updatePortfolioMetrics(data) {
        // Update portfolio value in header
        const portfolioElement = document.getElementById('portfolio-value');
        if (portfolioElement && data.totalValue) {
            portfolioElement.querySelector('span').textContent = `$${data.totalValue.toLocaleString()}`;
        }
    }

    updateRealEstateMetrics(data) {
        // Update real estate metrics
        console.log('Updating real estate metrics:', data);
    }

    updateTradingDashboard(data) {
        // Update trading dashboard
        console.log('Updating trading dashboard:', data);
    }

    updateAIInsights(insights) {
        const insightsList = document.querySelector('.insights-list');
        if (insightsList) {
            insightsList.innerHTML = insights.map(insight => `
                <div class="insight-item ${insight.priority}">
                    <div class="insight-priority">${insight.priority.toUpperCase()}</div>
                    <div class="insight-content">
                        <h4>${insight.title}</h4>
                        <p>${insight.content}</p>
                        <span class="insight-time">${insight.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateSystemMetrics(health) {
        // Update system health metrics
        const cpuBar = document.querySelector('.health-item:nth-child(1) .bar-fill');
        const memoryBar = document.querySelector('.health-item:nth-child(2) .bar-fill');
        const responseBar = document.querySelector('.health-item:nth-child(3) .bar-fill');

        if (cpuBar) cpuBar.style.width = '45%';
        if (memoryBar) memoryBar.style.width = '62%';
        if (responseBar) responseBar.style.width = '25%';
    }

    async toggleAutomation(automationId, enabled) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/automation/${automationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled })
            });

            if (response.ok) {
                this.showSuccess(`Automation ${enabled ? 'enabled' : 'disabled'} successfully`);
            } else {
                throw new Error('Failed to update automation');
            }
        } catch (error) {
            console.error('Error toggling automation:', error);
            this.showError('Failed to update automation settings');
        }
    }

    async updateSetting(settingId, value) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/settings/${settingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value })
            });

            if (response.ok) {
                this.showSuccess('Setting updated successfully');
            } else {
                throw new Error('Failed to update setting');
            }
        } catch (error) {
            console.error('Error updating setting:', error);
            this.showError('Failed to update setting');
        }
    }

    startDataRefresh() {
        // Refresh data every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.updateSystemStatus();
            if (this.activeTab === 'overview') {
                this.loadOverviewData();
            }
        }, 30000);
    }

    stopDataRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 1000;
            background-color: ${type === 'success' ? '#38a169' : '#e53e3e'};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global functions for button actions
window.initiatePropertySearch = async function() {
    try {
        const response = await fetch('/api/covenant/property-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchCriteria: 'default' })
        });
        
        if (response.ok) {
            portal.showSuccess('Property search initiated');
        }
    } catch (error) {
        portal.showError('Failed to initiate property search');
    }
};

window.viewPortfolio = function() {
    portal.switchTab('real-estate');
};

window.triggerAcquisition = async function() {
    try {
        const response = await fetch('/api/covenant/acquisition/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: 'sample-property' })
        });
        
        if (response.ok) {
            portal.showSuccess('Acquisition process initiated');
        }
    } catch (error) {
        portal.showError('Failed to initiate acquisition');
    }
};

window.manageFunds = function() {
    portal.showSuccess('Opening fund management interface');
};

window.viewMarketAnalysis = function() {
    portal.showSuccess('Loading market analysis data');
};

window.executeTradingCycle = async function() {
    try {
        const response = await fetch('/api/strategos/v1/execute-cycle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            portal.showSuccess('Trading cycle executed');
        }
    } catch (error) {
        portal.showError('Failed to execute trading cycle');
    }
};

window.rebalancePortfolio = async function() {
    try {
        const response = await fetch('/api/strategos/v1/rebalance-capital', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            portal.showSuccess('Portfolio rebalancing initiated');
        }
    } catch (error) {
        portal.showError('Failed to rebalance portfolio');
    }
};

window.requestAnalysis = function() {
    portal.showSuccess('AI analysis requested');
};

window.viewInsights = function() {
    portal.showSuccess('Loading AI insights');
};

window.createAutomation = function() {
    portal.showSuccess('Opening automation builder');
};

window.viewSchedule = function() {
    portal.showSuccess('Loading automation schedule');
};

window.refreshMetrics = function() {
    portal.loadMonitoringData();
    portal.showSuccess('Metrics refreshed');
};

window.exportLogs = function() {
    portal.showSuccess('Exporting system logs');
};

// Coinbase Integration Functions
window.openCoinbasePortal = function() {
    // Open Coinbase Pro in a new tab
    window.open('https://pro.coinbase.com', '_blank', 'noopener,noreferrer');
    portal.showSuccess('Opening Coinbase Pro in new tab...');
};

window.refreshCoinbaseData = function() {
    portal.showSuccess('Refreshing Coinbase data...');
    
    // Simulate API call to refresh Coinbase data
    setTimeout(() => {
        // Update the portfolio values with fresh data
        updateCoinbasePortfolio();
        portal.showSuccess('Coinbase data updated successfully');
    }, 1500);
};

window.toggleCoinbaseFrame = function() {
    const frameContainer = document.getElementById('coinbase-frame-container');
    const toggleText = document.getElementById('frame-toggle-text');
    
    if (frameContainer.style.display === 'none') {
        frameContainer.style.display = 'block';
        toggleText.textContent = 'Hide Coinbase Dashboard';
        
        // Load the frame if not already loaded
        const iframe = document.getElementById('coinbase-frame');
        if (!iframe.src) {
            iframe.src = 'https://pro.coinbase.com';
        }
        
        portal.showSuccess('Loading Coinbase dashboard...');
    } else {
        frameContainer.style.display = 'none';
        toggleText.textContent = 'Show Coinbase Dashboard';
    }
};

function updateCoinbasePortfolio() {
    // Simulate real-time portfolio updates
    const holdings = [
        { asset: 'BTC', amount: (1.2487 + (Math.random() - 0.5) * 0.01).toFixed(4), value: '$' + (45230 + Math.floor((Math.random() - 0.5) * 1000)).toLocaleString() },
        { asset: 'ETH', amount: (12.5 + (Math.random() - 0.5) * 0.1).toFixed(1), value: '$' + (28750 + Math.floor((Math.random() - 0.5) * 500)).toLocaleString() },
        { asset: 'USD', amount: (26020 + Math.floor((Math.random() - 0.5) * 100)).toLocaleString(), value: '$' + (26020 + Math.floor((Math.random() - 0.5) * 100)).toLocaleString() }
    ];
    
    const holdingsList = document.querySelector('.holdings-list');
    if (holdingsList) {
        holdingsList.innerHTML = holdings.map(holding => `
            <div class="holding-item">
                <span class="asset">${holding.asset}</span>
                <span class="amount">${holding.amount}</span>
                <span class="value">${holding.value}</span>
            </div>
        `).join('');
    }
    
    // Update account balance
    const totalValue = holdings.reduce((sum, holding) => {
        const value = parseFloat(holding.value.replace(/[$,]/g, ''));
        return sum + value;
    }, 0);
    
    const balanceElement = document.querySelector('.coinbase-card .stat-value');
    if (balanceElement) {
        balanceElement.textContent = '$' + totalValue.toLocaleString() + '.00';
    }
}

window.saveSettings = function() {
    portal.showSuccess('Settings saved successfully');
};

window.resetDefaults = function() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        portal.showSuccess('Settings reset to defaults');
    }
};

// Initialize portal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.portal = new OakDragonPortal();
    
    // Initialize Coinbase data
    setTimeout(() => {
        updateCoinbasePortfolio();
    }, 2000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        portal.stopDataRefresh();
    } else {
        portal.startDataRefresh();
    }
});
