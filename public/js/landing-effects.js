// 🏰 Oak Dragon Covenant - Landing Page Interactive Effects
// Handles UI animations, interactions, and visual enhancements

class LandingEffects {
    constructor() {
        this.initializeEffects();
        this.setupInteractiveElements();
        this.startAmbientEffects();
    }
    
    initializeEffects() {
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.setupTypingEffect();
        this.setupGlowEffects();
    }
    
    setupParallaxEffects() {
        // Subtle parallax scrolling for depth
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('input, button, .stat-card, .footer-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createHoverGlow(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.removeHoverGlow(e.target);
            });
        });
    }
    
    createHoverGlow(element) {
        // Add glow effect to hovered elements
        const rect = element.getBoundingClientRect();
        const glow = document.createElement('div');
        
        glow.className = 'hover-glow';
        glow.style.position = 'fixed';
        glow.style.left = `${rect.left - 5}px`;
        glow.style.top = `${rect.top - 5}px`;
        glow.style.width = `${rect.width + 10}px`;
        glow.style.height = `${rect.height + 10}px`;
        glow.style.background = 'radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%)';
        glow.style.borderRadius = '10px';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '-1';
        glow.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(glow);
        element._hoverGlow = glow;
        
        // Animate in
        setTimeout(() => {
            glow.style.opacity = '1';
        }, 10);
    }
    
    removeHoverGlow(element) {
        if (element._hoverGlow) {
            const glow = element._hoverGlow;
            glow.style.opacity = '0';
            
            setTimeout(() => {
                if (glow.parentNode) {
                    glow.parentNode.removeChild(glow);
                }
            }, 300);
            
            delete element._hoverGlow;
        }
    }
    
    setupTypingEffect() {
        // Typing effect for dynamic text elements
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid #dc143c';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100 + Math.random() * 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    setupGlowEffects() {
        // Dynamic glow effects for special elements
        const glowElements = document.querySelectorAll('.dragon-symbol, .logo-text');
        
        glowElements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    this.createRandomGlow(element);
                }
            }, 2000);
        });
    }
    
    createRandomGlow(element) {
        const originalFilter = element.style.filter;
        const glowIntensity = 20 + Math.random() * 30;
        
        element.style.filter = `drop-shadow(0 0 ${glowIntensity}px #dc143c)`;
        element.style.transition = 'filter 0.5s ease';
        
        setTimeout(() => {
            element.style.filter = originalFilter;
        }, 500);
    }
    
    setupInteractiveElements() {
        // Setup form interactions
        this.setupFormEffects();
        this.setupPasswordStrengthIndicator();
        this.setupUsernameValidation();
    }
    
    setupFormEffects() {
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                this.createInputRipple(input);
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (!input.value) {
                    input.parentElement.classList.remove('filled');
                }
            });
            
            // Input value detection
            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('filled');
                } else {
                    input.parentElement.classList.remove('filled');
                }
            });
        });
    }
    
    createInputRipple(input) {
        const ripple = document.createElement('div');
        ripple.className = 'input-ripple';
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '2px';
        ripple.style.bottom = '0';
        ripple.style.left = '0';
        ripple.style.background = 'linear-gradient(90deg, transparent, #dc143c, transparent)';
        ripple.style.animation = 'ripple 1s ease-out';
        
        input.parentElement.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }
    
    setupPasswordStrengthIndicator() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;
        
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <span class="strength-text">Password Strength</span>
        `;
        
        passwordInput.parentElement.appendChild(strengthIndicator);
        
        passwordInput.addEventListener('input', () => {
            const strength = this.calculatePasswordStrength(passwordInput.value);
            this.updateStrengthIndicator(strengthIndicator, strength);
        });
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        
        score = checks.filter(check => check).length;
        
        return {
            score: score,
            level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
            percentage: (score / 5) * 100
        };
    }
    
    updateStrengthIndicator(indicator, strength) {
        const fill = indicator.querySelector('.strength-fill');
        const text = indicator.querySelector('.strength-text');
        
        fill.style.width = `${strength.percentage}%`;
        text.textContent = `Password Strength: ${strength.level.toUpperCase()}`;
        
        // Color coding
        const colors = {
            weak: '#dc143c',
            medium: '#ffd700',
            strong: '#00ff41'
        };
        
        fill.style.background = colors[strength.level];
        text.style.color = colors[strength.level];
    }
    
    setupUsernameValidation() {
        const usernameInput = document.getElementById('username');
        if (!usernameInput) return;
        
        usernameInput.addEventListener('input', () => {
            this.validateUsername(usernameInput.value);
        });
    }
    
    validateUsername(username) {
        const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username);
        const input = document.getElementById('username');
        
        if (username.length > 0) {
            if (isValid) {
                input.style.borderColor = '#00ff41';
                input.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
            } else {
                input.style.borderColor = '#dc143c';
                input.style.boxShadow = '0 0 10px rgba(220, 20, 60, 0.3)';
            }
        } else {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }
    }
    
    startAmbientEffects() {
        // Ambient lighting effects
        this.setupAmbientLighting();
        this.setupRandomFlickers();
        this.setupBackgroundPulse();
    }
    
    setupAmbientLighting() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createAmbientLightFlash();
            }
        }, 5000);
    }
    
    createAmbientLightFlash() {
        const flash = document.createElement('div');
        flash.className = 'ambient-flash';
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(220, 20, 60, 0.1) 0%, transparent 50%)`;
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '-1';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 2s ease';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 2000);
        }, 1000);
    }
    
    setupRandomFlickers() {
        const flickerElements = document.querySelectorAll('.logo-text, .tagline');
        
        flickerElements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.05) {
                    this.createFlicker(element);
                }
            }, 1000);
        });
    }
    
    createFlicker(element) {
        const originalOpacity = element.style.opacity || '1';
        
        element.style.opacity = '0.3';
        setTimeout(() => {
            element.style.opacity = originalOpacity;
        }, 50 + Math.random() * 100);
    }
    
    setupBackgroundPulse() {
        const canvas = document.getElementById('matrix-canvas');
        let pulseIntensity = 0;
        let pulseDirection = 1;
        
        const animatePulse = () => {
            pulseIntensity += pulseDirection * 0.01;
            
            if (pulseIntensity >= 1) {
                pulseDirection = -1;
            } else if (pulseIntensity <= 0) {
                pulseDirection = 1;
            }
            
            canvas.style.filter = `brightness(${0.8 + pulseIntensity * 0.2})`;
            requestAnimationFrame(animatePulse);
        };
        
        animatePulse();
    }
    
    // Public methods for external effects
    triggerSuccessEffect() {
        this.createSuccessParticles();
        this.createSuccessGlow();
    }
    
    createSuccessParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle('#ffd700');
            }, i * 50);
        }
    }
    
    createParticle(color) {
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = startY + (Math.random() - 0.5) * 400;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        };
    }
    
    createSuccessGlow() {
        const glow = document.createElement('div');
        glow.style.position = 'fixed';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '999';
        glow.style.opacity = '0';
        glow.style.transition = 'opacity 1s ease';
        
        document.body.appendChild(glow);
        
        setTimeout(() => {
            glow.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            glow.style.opacity = '0';
            setTimeout(() => {
                if (glow.parentNode) {
                    glow.parentNode.removeChild(glow);
                }
            }, 1000);
        }, 500);
    }
}

// Add CSS animations
const effectsStyle = document.createElement('style');
effectsStyle.textContent = `
    @keyframes ripple {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        width: 0%;
        transition: width 0.3s ease, background 0.3s ease;
        border-radius: 2px;
    }
    
    .strength-text {
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
        transition: color 0.3s ease;
    }
    
    .form-group.focused label {
        color: #ffd700;
        text-shadow: 0 0 10px #ffd700;
    }
    
    .form-group.filled label {
        color: #00ff41;
    }
`;
document.head.appendChild(effectsStyle);

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.landingEffects = new LandingEffects();
    
    // Listen for authentication events to trigger effects
    document.addEventListener('auth-success', () => {
        window.landingEffects.triggerSuccessEffect();
    });
});
