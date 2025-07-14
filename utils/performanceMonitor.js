const logger = require('./logger');

/**
 * 📊 Performance Monitoring System for Oak Dragon Covenant
 * Tracks system performance, agent efficiency, and resource usage
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.startTime = Date.now();
        this.agentMetrics = new Map();
        this.tradingMetrics = {
            executedTrades: 0,
            totalVolume: 0,
            totalProfit: 0,
            totalLoss: 0,
            winRate: 0
        };
        this.realEstateMetrics = {
            acquisitions: 0,
            totalInvested: 0,
            portfolioValue: 0,
            averageIRR: 0
        };
    }

    /**
     * Records a performance metric
     */
    recordMetric(name, value, unit = '', category = 'system') {
        const timestamp = Date.now();
        const metric = {
            name,
            value,
            unit,
            category,
            timestamp
        };

        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        this.metrics.get(name).push(metric);
        
        // Keep only last 1000 entries per metric
        const entries = this.metrics.get(name);
        if (entries.length > 1000) {
            entries.shift();
        }

        logger.performanceMetric(name, value, unit);
    }

    /**
     * Records agent performance
     */
    recordAgentMetric(agentName, action, duration, success = true) {
        if (!this.agentMetrics.has(agentName)) {
            this.agentMetrics.set(agentName, {
                totalActions: 0,
                successfulActions: 0,
                failedActions: 0,
                averageResponseTime: 0,
                totalResponseTime: 0
            });
        }

        const agentStats = this.agentMetrics.get(agentName);
        agentStats.totalActions++;
        agentStats.totalResponseTime += duration;
        agentStats.averageResponseTime = agentStats.totalResponseTime / agentStats.totalActions;

        if (success) {
            agentStats.successfulActions++;
        } else {
            agentStats.failedActions++;
        }

        this.recordMetric(`agent_${agentName}_response_time`, duration, 'ms', 'agents');
        this.recordMetric(`agent_${agentName}_success_rate`, 
            (agentStats.successfulActions / agentStats.totalActions) * 100, '%', 'agents');
    }

    /**
     * Records trading performance
     */
    recordTradingMetric(trade) {
        this.tradingMetrics.executedTrades++;
        this.tradingMetrics.totalVolume += trade.amount * (trade.price || 0);
        
        if (trade.profit > 0) {
            this.tradingMetrics.totalProfit += trade.profit;
        } else if (trade.profit < 0) {
            this.tradingMetrics.totalLoss += Math.abs(trade.profit);
        }

        const totalTrades = this.tradingMetrics.executedTrades;
        const profitableTrades = this.getMetricValue('profitable_trades') || 0;
        this.tradingMetrics.winRate = (profitableTrades / totalTrades) * 100;

        this.recordMetric('executed_trades', this.tradingMetrics.executedTrades, 'count', 'trading');
        this.recordMetric('trading_volume', this.tradingMetrics.totalVolume, 'USD', 'trading');
        this.recordMetric('win_rate', this.tradingMetrics.winRate, '%', 'trading');
    }

    /**
     * Records real estate performance
     */
    recordRealEstateMetric(property) {
        this.realEstateMetrics.acquisitions++;
        this.realEstateMetrics.totalInvested += property.price;
        this.realEstateMetrics.portfolioValue += property.currentValue || property.price;

        this.recordMetric('property_acquisitions', this.realEstateMetrics.acquisitions, 'count', 'real_estate');
        this.recordMetric('total_invested', this.realEstateMetrics.totalInvested, 'USD', 'real_estate');
        this.recordMetric('portfolio_value', this.realEstateMetrics.portfolioValue, 'USD', 'real_estate');
    }

    /**
     * Records system resource usage
     */
    recordSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        
        this.recordMetric('memory_used', memoryUsage.heapUsed, 'bytes', 'system');
        this.recordMetric('memory_total', memoryUsage.heapTotal, 'bytes', 'system');
        this.recordMetric('memory_external', memoryUsage.external, 'bytes', 'system');
        this.recordMetric('cpu_user', cpuUsage.user, 'microseconds', 'system');
        this.recordMetric('cpu_system', cpuUsage.system, 'microseconds', 'system');
        this.recordMetric('uptime', process.uptime(), 'seconds', 'system');
    }

    /**
     * Gets the latest value for a metric
     */
    getMetricValue(name) {
        const entries = this.metrics.get(name);
        if (!entries || entries.length === 0) {
            return null;
        }
        return entries[entries.length - 1].value;
    }

    /**
     * Gets metric statistics
     */
    getMetricStats(name, periodMinutes = 60) {
        const entries = this.metrics.get(name);
        if (!entries || entries.length === 0) {
            return null;
        }

        const cutoffTime = Date.now() - (periodMinutes * 60 * 1000);
        const recentEntries = entries.filter(entry => entry.timestamp >= cutoffTime);
        
        if (recentEntries.length === 0) {
            return null;
        }

        const values = recentEntries.map(entry => entry.value);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        return {
            count: values.length,
            average: avg,
            minimum: min,
            maximum: max,
            latest: values[values.length - 1],
            trend: this.calculateTrend(values)
        };
    }

    /**
     * Calculates trend direction
     */
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        if (change > 5) return 'increasing';
        if (change < -5) return 'decreasing';
        return 'stable';
    }

    /**
     * Gets comprehensive performance report
     */
    getPerformanceReport() {
        this.recordSystemMetrics();

        const report = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            system: {
                memory: this.getMetricStats('memory_used'),
                cpu: this.getMetricStats('cpu_user')
            },
            agents: {},
            trading: {
                ...this.tradingMetrics,
                volume: this.getMetricStats('trading_volume'),
                winRate: this.getMetricStats('win_rate')
            },
            realEstate: {
                ...this.realEstateMetrics,
                acquisitions: this.getMetricStats('property_acquisitions'),
                portfolioValue: this.getMetricStats('portfolio_value')
            }
        };

        // Add agent performance
        for (const [agentName, stats] of this.agentMetrics) {
            report.agents[agentName] = {
                ...stats,
                responseTime: this.getMetricStats(`agent_${agentName}_response_time`),
                successRate: this.getMetricStats(`agent_${agentName}_success_rate`)
            };
        }

        return report;
    }

    /**
     * Gets metrics for monitoring dashboard
     */
    getDashboardMetrics() {
        return {
            system: {
                uptime: process.uptime(),
                memoryUsage: this.getMetricValue('memory_used'),
                totalMemory: this.getMetricValue('memory_total')
            },
            trading: {
                totalTrades: this.tradingMetrics.executedTrades,
                winRate: this.tradingMetrics.winRate,
                totalVolume: this.tradingMetrics.totalVolume
            },
            realEstate: {
                acquisitions: this.realEstateMetrics.acquisitions,
                portfolioValue: this.realEstateMetrics.portfolioValue,
                totalInvested: this.realEstateMetrics.totalInvested
            },
            activeAgents: this.agentMetrics.size
        };
    }

    /**
     * Starts automatic metric collection
     */
    startMonitoring(intervalMs = 60000) {
        this.monitoringInterval = setInterval(() => {
            this.recordSystemMetrics();
        }, intervalMs);

        logger.info('Performance monitoring started', { interval: intervalMs });
    }

    /**
     * Stops automatic metric collection
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        logger.info('Performance monitoring stopped');
    }
}

module.exports = new PerformanceMonitor();
