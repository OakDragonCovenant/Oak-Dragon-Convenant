// 🏰 Oak Dragon Covenant - Authentication Routes
// Server-side authentication handling for the landing page

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const config = require('../config/configManager');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Demo users for development (in production, this would be in a database)
const demoUsers = [
    {
        id: 1,
        username: 'admin',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLVw1LsaTQ9N.n2', // OakDragon2025!
        role: 'administrator',
        email: 'admin@oakdragoncovenant.com',
        permissions: ['*']
    },
    {
        id: 2,
        username: 'oakdragon',
        password: '$2b$12$QmYfz8A9k5h8YJLVqA5KuOeL6j8FWcWcGqmU5X0QHqQj8YNwvQr8.', // Covenant@2025
        role: 'user',
        email: 'user@oakdragoncovenant.com',
        permissions: ['read', 'trade', 'realestate']
    },
    {
        id: 3,
        username: 'strategist',
        password: '$2b$12$HhJ9k2LmN8p7QrT5V3wX4O2Y9A1bCdEfGhI6jKlMnO8pQrS7tUv9w', // Matrix$Gold
        role: 'strategist',
        email: 'strategist@oakdragoncovenant.com',
        permissions: ['read', 'trade', 'analytics']
    },
    {
        id: 4,
        username: 'demo',
        password: '$2b$12$1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP', // demo123
        role: 'demo',
        email: 'demo@oakdragoncovenant.com',
        permissions: ['read']
    }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'NO_TOKEN',
                message: 'Access token is required'
            }
        });
    }

    jwt.verify(token, config.security.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired token'
                }
            });
        }

        req.user = user;
        next();
    });
};

// Helper function to find user by username
const findUserByUsername = (username) => {
    return demoUsers.find(user => user.username === username);
};

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: user.permissions
        },
        config.security.jwtSecret,
        { expiresIn: '1h' }
    );
};

// POST /api/auth/login - User login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_CREDENTIALS',
                    message: 'Username and password are required'
                }
            });
        }

        // Find user
        const user = findUserByUsername(username);
        if (!user) {
            logger.warn('Login attempt with invalid username', { username, ip: req.ip });
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid username or password'
                }
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn('Login attempt with invalid password', { username, ip: req.ip });
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid username or password'
                }
            });
        }

        // Generate token
        const token = generateToken(user);

        // Log successful login
        logger.info('Successful login', {
            userId: user.id,
            username: user.username,
            role: user.role,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Return success response
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                permissions: user.permissions,
                lastLogin: new Date().toISOString()
            }
        });

    } catch (error) {
        logger.error('Login error', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An internal server error occurred'
            }
        });
    }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, (req, res) => {
    try {
        logger.info('User logout', {
            userId: req.user.id,
            username: req.user.username,
            ip: req.ip
        });

        res.json({
            success: true,
            message: 'Successfully logged out'
        });
    } catch (error) {
        logger.error('Logout error', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An internal server error occurred'
            }
        });
    }
});

// GET /api/auth/verify - Verify token
router.get('/verify', authenticateToken, (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                username: req.user.username,
                role: req.user.role,
                permissions: req.user.permissions
            }
        });
    } catch (error) {
        logger.error('Token verification error', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An internal server error occurred'
            }
        });
    }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const user = findUserByUsername(req.user.username);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                permissions: user.permissions
            }
        });
    } catch (error) {
        logger.error('Profile fetch error', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An internal server error occurred'
            }
        });
    }
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
    try {
        const user = findUserByUsername(req.user.username);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        const newToken = generateToken(user);

        res.json({
            success: true,
            token: newToken
        });
    } catch (error) {
        logger.error('Token refresh error', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An internal server error occurred'
            }
        });
    }
});

module.exports = router;
