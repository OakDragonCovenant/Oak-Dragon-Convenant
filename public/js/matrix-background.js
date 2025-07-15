// 🏰 Oak Dragon Covenant - Matrix Background Effect
// Creates the animated Matrix-style falling code background

class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        
        // Matrix configuration
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$¥€₿₽₴₨₦₡₵₪₯₹₨₦₨₩₴₹₨₦₨₩₴₹₨₦₨₩₴₹₨₦₨₩';
        this.fontSize = 14;
        this.columns = [];
        this.drops = [];
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.setupColumns();
        this.start();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recalculate columns after resize
        this.setupColumns();
    }
    
    setupColumns() {
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        this.columns = Array(columnCount).fill(0);
        this.drops = Array(columnCount).fill(0);
        
        // Initialize drops at random positions
        for (let i = 0; i < this.drops.length; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
    
    getRandomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }
    
    getColor(intensity) {
        // Create gradient from crimson to gold to matrix green
        if (intensity < 0.3) {
            // Dark crimson to crimson
            const alpha = intensity / 0.3;
            return `rgba(139, 0, 0, ${alpha * 0.8})`;
        } else if (intensity < 0.6) {
            // Crimson to gold
            const progress = (intensity - 0.3) / 0.3;
            const r = Math.floor(139 + (255 - 139) * progress);
            const g = Math.floor(0 + (215 - 0) * progress);
            const b = 0;
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        } else {
            // Gold to matrix green
            const progress = (intensity - 0.6) / 0.4;
            const r = Math.floor(255 - 255 * progress);
            const g = Math.floor(215 + (255 - 215) * progress);
            const b = Math.floor(0 + 65 * progress);
            return `rgba(${r}, ${g}, ${b}, 0.9)`;
        }
    }
    
    draw() {
        // Create trailing effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        
        // Draw falling characters
        for (let i = 0; i < this.drops.length; i++) {
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Only draw if on screen
            if (y > 0 && y < this.canvas.height + this.fontSize) {
                const character = this.getRandomCharacter();
                
                // Calculate intensity based on position (newer drops are brighter)
                const intensity = Math.min(1, (this.canvas.height - y) / this.canvas.height + 0.3);
                
                this.ctx.fillStyle = this.getColor(intensity);
                this.ctx.fillText(character, x, y);
                
                // Add glow effect for bright characters
                if (intensity > 0.7) {
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = this.getColor(intensity);
                    this.ctx.fillText(character, x, y);
                    this.ctx.shadowBlur = 0;
                }
            }
            
            // Reset drop when it goes off screen
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            // Move drop down
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // Public methods for controlling the effect
    setSpeed(speed) {
        // Speed multiplier (not implemented in this version)
        this.speed = speed;
    }
    
    setDensity(density) {
        // Adjust character density
        this.density = density;
    }
}

// Enhanced matrix effects
class MatrixEnhancedEffects {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.glitchLines = [];
        this.pulseElements = [];
        
        this.initEnhancements();
    }
    
    initEnhancements() {
        // Add occasional glitch lines
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.addGlitchLine();
            }
        }, 2000);
        
        // Add pulse effects on authentication events
        this.setupAuthenticationEffects();
    }
    
    addGlitchLine() {
        const glitch = {
            y: Math.random() * this.canvas.height,
            intensity: Math.random() * 0.5 + 0.5,
            duration: 100 + Math.random() * 200,
            age: 0
        };
        
        this.glitchLines.push(glitch);
        
        // Remove after duration
        setTimeout(() => {
            const index = this.glitchLines.indexOf(glitch);
            if (index > -1) {
                this.glitchLines.splice(index, 1);
            }
        }, glitch.duration);
    }
    
    drawGlitchLines() {
        this.glitchLines.forEach(glitch => {
            const alpha = 1 - (glitch.age / glitch.duration);
            this.ctx.fillStyle = `rgba(220, 20, 60, ${alpha * glitch.intensity})`;
            this.ctx.fillRect(0, glitch.y, this.canvas.width, 2);
            glitch.age += 16; // Approximate frame time
        });
    }
    
    setupAuthenticationEffects() {
        // Listen for authentication events
        document.addEventListener('auth-success', () => {
            this.createSuccessEffect();
        });
        
        document.addEventListener('auth-error', () => {
            this.createErrorEffect();
        });
    }
    
    createSuccessEffect() {
        // Create a wave of gold color
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.addGoldPulse();
            }, i * 100);
        }
    }
    
    createErrorEffect() {
        // Create red flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(220, 20, 60, 0.3)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '999';
        flash.style.animation = 'flash 0.5s ease-out';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 500);
    }
    
    addGoldPulse() {
        // Add temporary gold characters
        const pulse = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 20 + Math.random() * 30,
            life: 0,
            maxLife: 60
        };
        
        this.pulseElements.push(pulse);
    }
    
    drawPulseElements() {
        this.pulseElements = this.pulseElements.filter(pulse => {
            const alpha = 1 - (pulse.life / pulse.maxLife);
            const scale = 1 + (pulse.life / pulse.maxLife) * 2;
            
            this.ctx.save();
            this.ctx.translate(pulse.x, pulse.y);
            this.ctx.scale(scale, scale);
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.font = `${pulse.size}px 'Courier New', monospace`;
            this.ctx.fillText('🐉', -pulse.size/2, pulse.size/2);
            this.ctx.restore();
            
            pulse.life++;
            return pulse.life < pulse.maxLife;
        });
    }
    
    update() {
        this.drawGlitchLines();
        this.drawPulseElements();
        requestAnimationFrame(() => this.update());
    }
}

// Initialize matrix background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matrixBackground = new MatrixBackground();
    window.matrixEffects = new MatrixEnhancedEffects();
    window.matrixEffects.update();
});

// Add CSS for flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
