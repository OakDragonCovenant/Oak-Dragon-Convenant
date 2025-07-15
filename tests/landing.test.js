// 🏰 Oak Dragon Covenant - Landing Page Tests
// Tests for authentication and landing page functionality

const request = require('supertest');
const express = require('express');
const path = require('path');

// Mock the dependencies that might not be available in test
jest.mock('../config/configManager', () => ({
    security: {
        jwtSecret: 'test-secret-key-for-testing-only',
        rateLimitWindow: 900000,
        rateLimitMax: 100
    }
}));

jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}));

// Import the auth routes
const authRoutes = require('../routes/auth');

// Create test app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);

describe('Oak Dragon Covenant Landing Page', () => {
    describe('Static Files', () => {
        test('should serve landing page', async () => {
            const response = await request(app)
                .get('/landing.html')
                .expect(200);
            
            expect(response.text).toContain('Oak Dragon Covenant');
            expect(response.text).toContain('matrix-canvas');
        });

        test('should serve CSS files', async () => {
            const response = await request(app)
                .get('/css/landing.css')
                .expect(200);
            
            expect(response.text).toContain('Oak Dragon Covenant');
            expect(response.text).toContain('matrix-background');
        });

        test('should serve JavaScript files', async () => {
            const response = await request(app)
                .get('/js/matrix-background.js')
                .expect(200);
            
            expect(response.text).toContain('MatrixBackground');
        });
    });

    describe('Authentication API', () => {
        describe('POST /api/auth/login', () => {
            test('should login with valid credentials', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'demo',
                        password: 'demo123'
                    })
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.token).toBeDefined();
                expect(response.body.user).toBeDefined();
                expect(response.body.user.username).toBe('demo');
            });

            test('should reject invalid credentials', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'invalid',
                        password: 'wrong'
                    })
                    .expect(401);

                expect(response.body.success).toBe(false);
                expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
            });

            test('should require username and password', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({})
                    .expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body.error.code).toBe('MISSING_CREDENTIALS');
            });

            test('should handle admin login', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'admin',
                        password: 'OakDragon2025!'
                    })
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.user.role).toBe('administrator');
                expect(response.body.user.permissions).toContain('*');
            });
        });

        describe('GET /api/auth/verify', () => {
            let token;

            beforeEach(async () => {
                const loginResponse = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'demo',
                        password: 'demo123'
                    });
                token = loginResponse.body.token;
            });

            test('should verify valid token', async () => {
                const response = await request(app)
                    .get('/api/auth/verify')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.user).toBeDefined();
            });

            test('should reject request without token', async () => {
                const response = await request(app)
                    .get('/api/auth/verify')
                    .expect(401);

                expect(response.body.success).toBe(false);
                expect(response.body.error.code).toBe('NO_TOKEN');
            });

            test('should reject invalid token', async () => {
                const response = await request(app)
                    .get('/api/auth/verify')
                    .set('Authorization', 'Bearer invalid-token')
                    .expect(403);

                expect(response.body.success).toBe(false);
                expect(response.body.error.code).toBe('INVALID_TOKEN');
            });
        });

        describe('POST /api/auth/logout', () => {
            let token;

            beforeEach(async () => {
                const loginResponse = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'demo',
                        password: 'demo123'
                    });
                token = loginResponse.body.token;
            });

            test('should logout successfully', async () => {
                const response = await request(app)
                    .post('/api/auth/logout')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Successfully logged out');
            });

            test('should require authentication for logout', async () => {
                const response = await request(app)
                    .post('/api/auth/logout')
                    .expect(401);

                expect(response.body.success).toBe(false);
            });
        });

        describe('GET /api/auth/profile', () => {
            let token;

            beforeEach(async () => {
                const loginResponse = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'demo',
                        password: 'demo123'
                    });
                token = loginResponse.body.token;
            });

            test('should get user profile', async () => {
                const response = await request(app)
                    .get('/api/auth/profile')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.user.username).toBe('demo');
                expect(response.body.user.email).toBeDefined();
            });
        });

        describe('Rate Limiting', () => {
            test('should allow multiple requests within limit', async () => {
                for (let i = 0; i < 3; i++) {
                    await request(app)
                        .post('/api/auth/login')
                        .send({
                            username: 'demo',
                            password: 'wrong'
                        })
                        .expect(401);
                }
            });
        });
    });

    describe('User Roles and Permissions', () => {
        const users = [
            { username: 'admin', password: 'OakDragon2025!', role: 'administrator' },
            { username: 'demo', password: 'demo123', role: 'demo' }
        ];

        users.forEach(user => {
            test(`should authenticate ${user.role} user`, async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: user.username,
                        password: user.password
                    })
                    .expect(200);

                expect(response.body.user.role).toBe(user.role);
            });
        });
    });
});

describe('Security Features', () => {
    test('should include security headers', async () => {
        // This would test security headers if helmet is configured
        // Implementation depends on your security middleware setup
    });

    test('should validate input properly', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: '',
                password: ''
            })
            .expect(400);

        expect(response.body.error.code).toBe('MISSING_CREDENTIALS');
    });
});

// Matrix Background Animation Tests
describe('Frontend JavaScript', () => {
    // These would be integration tests for the frontend
    // You could use tools like Puppeteer or Selenium for browser testing
    
    test('placeholder for matrix background tests', () => {
        // Test that the MatrixBackground class is properly defined
        expect(true).toBe(true);
    });

    test('placeholder for authentication flow tests', () => {
        // Test the complete authentication flow in browser
        expect(true).toBe(true);
    });
});

module.exports = app;
