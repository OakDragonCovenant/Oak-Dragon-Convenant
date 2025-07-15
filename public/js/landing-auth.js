// 🏰 Oak Dragon Covenant - Landing Page Authentication
// Handles user login, session management, and security

class OakDragonAuth {
    constructor() {
        this.apiBase = '/api';
        this.maxAttempts = 3;
        this.lockoutTime = 300000; // 5 minutes
        this.sessionTimeout = 3600000; // 1 hour
        
        this.initializeAuth();
        this.setupEventListeners();
        this.checkExistingSession();
    }
    
    initializeAuth() {
        this.loginForm = document.getElementById('loginForm');
        this.authContainer = document.getElementById('authContainer');
        this.dashboardPreview = document.getElementById('dashboardPreview');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Get stored attempt data
        this.attempts = parseInt(localStorage.getItem('oakdragon_attempts') || '0');
        this.lastAttempt = parseInt(localStorage.getItem('oakdragon_last_attempt') || '0');
        
        this.checkLockout();
    }
    
    setupEventListeners() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Add Enter key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.authContainer.style.display !== 'none') {
                this.handleLogin();
            }
        });
        
        // Session timeout warning
        this.setupSessionTimeout();
    }
    
    checkLockout() {
        const now = Date.now();
        if (this.attempts >= this.maxAttempts && (now - this.lastAttempt) < this.lockoutTime) {
            const remainingTime = Math.ceil((this.lockoutTime - (now - this.lastAttempt)) / 60000);
            this.showError(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
            this.disableForm(true);
            
            // Auto-enable after lockout period
            setTimeout(() => {
                this.resetAttempts();
                this.disableForm(false);
                this.showError('');
            }, this.lockoutTime - (now - this.lastAttempt));
        }
    }
    
    disableForm(disabled) {
        const inputs = this.loginForm.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = disabled;
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!username || !password) {
            this.showError('Please enter both username and password.');
            return;
        }
        
        // Check if locked out
        if (this.attempts >= this.maxAttempts) {
            this.checkLockout();
            return;
        }
        
        this.showLoading(true);
        this.showError('');
        
        try {
            const response = await this.authenticateUser(username, password);
            
            if (response.success) {
                this.handleAuthSuccess(response);
                this.resetAttempts();
                
                // Trigger success effect
                document.dispatchEvent(new CustomEvent('auth-success'));
            } else {
                this.handleAuthFailure(response.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.handleAuthFailure('Connection error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async authenticateUser(username, password) {
        // In a real implementation, this would call your backend API
        // For now, we'll simulate the authentication process
        
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            
            return await response.json();
        } catch (error) {
            // Fallback authentication for development/demo
            return this.simulateAuth(username, password);
        }
    }
    
    simulateAuth(username, password) {
        // Demo credentials for testing
        const validCredentials = [
            { username: 'admin', password: 'OakDragon2025!' },
            { username: 'oakdragon', password: 'Covenant@2025' },
            { username: 'strategist', password: 'Matrix$Gold' },
            { username: 'demo', password: 'demo123' }
        ];
        
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = validCredentials.some(cred => 
                    cred.username === username && cred.password === password
                );
                
                if (isValid) {
                    resolve({
                        success: true,
                        token: this.generateSessionToken(),
                        user: {
                            username: username,
                            role: username === 'admin' ? 'administrator' : 'user',
                            lastLogin: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }
            }, 1000 + Math.random() * 1000); // 1-2 second delay
        });
    }
    
    generateSessionToken() {
        // Generate a secure session token (simplified for demo)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 64; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    
    handleAuthSuccess(response) {
        // Store session data
        localStorage.setItem('oakdragon_session', JSON.stringify({
            token: response.token,
            user: response.user,
            timestamp: Date.now()
        }));
        
        // Show dashboard preview
        this.showDashboard(response.user);
        
        // Auto-redirect to full dashboard after delay
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 5000);
    }
    
    handleAuthFailure(message) {
        this.attempts++;
        this.lastAttempt = Date.now();
        
        // Store attempt data
        localStorage.setItem('oakdragon_attempts', this.attempts.toString());
        localStorage.setItem('oakdragon_last_attempt', this.lastAttempt.toString());
        
        this.showError(message);
        
        // Trigger error effect
        document.dispatchEvent(new CustomEvent('auth-error'));
        
        // Check for lockout
        if (this.attempts >= this.maxAttempts) {
            this.checkLockout();
        } else {
            const remainingAttempts = this.maxAttempts - this.attempts;
            this.showError(`${message}. ${remainingAttempts} attempts remaining.`);
        }
        
        // Clear password field
        document.getElementById('password').value = '';
    }
    
    showDashboard(user) {
        this.authContainer.style.display = 'none';
        this.dashboardPreview.style.display = 'block';
        
        // Update welcome message
        const welcomeMessage = this.dashboardPreview.querySelector('.welcome-message h2');
        welcomeMessage.textContent = `Welcome back, ${user.username}`;
        
        // Simulate loading dashboard data
        this.loadDashboardData();
    }
    
    async loadDashboardData() {
        // Simulate API calls to load dashboard data
        const portfolioValue = document.getElementById('portfolioValue');
        const activeStrategies = document.getElementById('activeStrategies');
        const realEstateValue = document.getElementById('realEstateValue');
        
        // Animate loading
        portfolioValue.textContent = '$Loading...';
        activeStrategies.textContent = 'Loading...';
        realEstateValue.textContent = '$Loading...';
        
        // Simulate gradual data loading
        setTimeout(() => {
            portfolioValue.textContent = '$2,847,592.34';
            portfolioValue.style.color = '#00ff41';
        }, 1000);
        
        setTimeout(() => {
            activeStrategies.textContent = '7 Active';
            activeStrategies.style.color = '#ffd700';
        }, 1500);
        
        setTimeout(() => {
            realEstateValue.textContent = '$8,920,150.00';
            realEstateValue.style.color = '#00ff41';
        }, 2000);
    }
    
    checkExistingSession() {
        const sessionData = localStorage.getItem('oakdragon_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = Date.now();
                
                // Check if session is still valid
                if (now - session.timestamp < this.sessionTimeout) {
                    // Auto-login with existing session
                    this.showDashboard(session.user);
                    return;
                }
            } catch (error) {
                console.error('Invalid session data:', error);
            }
        }
        
        // Clear invalid session
        localStorage.removeItem('oakdragon_session');
    }
    
    setupSessionTimeout() {
        // Warn user before session expires
        setInterval(() => {
            const sessionData = localStorage.getItem('oakdragon_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const timeLeft = this.sessionTimeout - (Date.now() - session.timestamp);
                
                if (timeLeft < 300000 && timeLeft > 0) { // 5 minutes warning
                    this.showSessionWarning(Math.ceil(timeLeft / 60000));
                } else if (timeLeft <= 0) {
                    this.handleSessionExpired();
                }
            }
        }, 60000); // Check every minute
    }
    
    showSessionWarning(minutesLeft) {
        if (!this.sessionWarningShown) {
            this.sessionWarningShown = true;
            const warning = confirm(`Your session will expire in ${minutesLeft} minutes. Would you like to extend it?`);
            if (warning) {
                this.extendSession();
            }
        }
    }
    
    extendSession() {
        const sessionData = localStorage.getItem('oakdragon_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            session.timestamp = Date.now();
            localStorage.setItem('oakdragon_session', JSON.stringify(session));
            this.sessionWarningShown = false;
        }
    }
    
    handleSessionExpired() {
        localStorage.removeItem('oakdragon_session');
        this.showError('Your session has expired. Please log in again.');
        this.dashboardPreview.style.display = 'none';
        this.authContainer.style.display = 'block';
    }
    
    resetAttempts() {
        this.attempts = 0;
        localStorage.removeItem('oakdragon_attempts');
        localStorage.removeItem('oakdragon_last_attempt');
    }
    
    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        if (message) {
            this.errorMessage.style.animation = 'none';
            setTimeout(() => {
                this.errorMessage.style.animation = 'pulse 1s ease-in-out';
            }, 10);
        }
    }
}

// Global logout function
window.logout = function() {
    localStorage.removeItem('oakdragon_session');
    window.location.reload();
};

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.oakDragonAuth = new OakDragonAuth();
});
