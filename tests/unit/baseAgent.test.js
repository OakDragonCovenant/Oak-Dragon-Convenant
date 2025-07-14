const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

describe('BaseAgent', () => {
    let agent;

    beforeEach(() => {
        agent = new BaseAgent('TestAgent', 'Test');
    });

    describe('constructor', () => {
        it('should create an agent with name and type', () => {
            expect(agent.name).toBe('TestAgent');
            expect(agent.type).toBe('Test');
            expect(agent.status).toBe('initialized');
        });

        it('should set initial values correctly', () => {
            expect(agent.errorCount).toBe(0);
            expect(agent.maxErrors).toBe(5);
            expect(agent.lastActivity).toBeInstanceOf(Date);
        });
    });

    describe('activate', () => {
        it('should set status to active', () => {
            agent.activate();
            expect(agent.status).toBe('active');
        });

        it('should update last activity timestamp', () => {
            const beforeActivation = new Date();
            agent.activate();
            expect(agent.lastActivity.getTime()).toBeGreaterThanOrEqual(beforeActivation.getTime());
        });
    });

    describe('deactivate', () => {
        it('should set status to inactive', () => {
            agent.activate();
            agent.deactivate();
            expect(agent.status).toBe('inactive');
        });
    });

    describe('safeExecute', () => {
        it('should execute operation successfully', async () => {
            const mockOperation = jest.fn().mockResolvedValue('success');
            const result = await agent.safeExecute('test', mockOperation);
            
            expect(result.success).toBe(true);
            expect(result.result).toBe('success');
            expect(mockOperation).toHaveBeenCalled();
        });

        it('should handle errors gracefully', async () => {
            const mockError = new Error('Test error');
            const mockOperation = jest.fn().mockRejectedValue(mockError);
            const result = await agent.safeExecute('test', mockOperation);
            
            expect(result.success).toBe(false);
            expect(result.error).toBe('Test error');
            expect(agent.errorCount).toBe(1);
        });

        it('should deactivate agent after max errors', async () => {
            const mockOperation = jest.fn().mockRejectedValue(new Error('Test error'));
            
            // Execute operations up to max errors
            for (let i = 0; i < 5; i++) {
                await agent.safeExecute('test', mockOperation);
            }
            
            expect(agent.status).toBe('error_limit_exceeded');
        });
    });

    describe('getHealthStatus', () => {
        it('should return comprehensive health information', () => {
            agent.activate();
            const health = agent.getHealthStatus();
            
            expect(health).toHaveProperty('name', 'TestAgent');
            expect(health).toHaveProperty('type', 'Test');
            expect(health).toHaveProperty('status', 'active');
            expect(health).toHaveProperty('errorCount', 0);
            expect(health).toHaveProperty('healthy', true);
        });

        it('should indicate unhealthy when error limit exceeded', async () => {
            const mockOperation = jest.fn().mockRejectedValue(new Error('Test error'));
            
            for (let i = 0; i < 5; i++) {
                await agent.safeExecute('test', mockOperation);
            }
            
            const health = agent.getHealthStatus();
            expect(health.healthy).toBe(false);
        });
    });

    describe('resetErrors', () => {
        it('should reset error count and status', async () => {
            const mockOperation = jest.fn().mockRejectedValue(new Error('Test error'));
            
            // Generate some errors
            await agent.safeExecute('test', mockOperation);
            await agent.safeExecute('test', mockOperation);
            
            agent.resetErrors();
            
            expect(agent.errorCount).toBe(0);
        });

        it('should restore active status after error limit exceeded', async () => {
            const mockOperation = jest.fn().mockRejectedValue(new Error('Test error'));
            
            // Exceed error limit
            for (let i = 0; i < 5; i++) {
                await agent.safeExecute('test', mockOperation);
            }
            
            expect(agent.status).toBe('error_limit_exceeded');
            
            agent.resetErrors();
            
            expect(agent.status).toBe('active');
        });
    });
});
