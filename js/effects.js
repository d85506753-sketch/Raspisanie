/**
 * Visual Effects: Taco Rain, RGB Disco, Cursor Sparkles, Confetti
 */

class EffectsManager {
    constructor() {
        this.tacoRainActive = false;
        this.tacoParticles = [];
        this.tacoCanvas = null;
        this.tacoCtx = null;
        this.tacoAnimationId = null;

        this.sparklesActive = true;
        this.sparkleCanvas = null;
        this.sparkleCtx = null;
        this.sparkleParticles = [];
        this.sparkleAnimationId = null;

        this.rgbModeActive = false;
        this.discoModeActive = false;

        this.init();
    }

    init() {
        this.setupTacoCanvas();
        this.setupSparkleCanvas();
        this.bindEvents();
    }

    setupTacoCanvas() {
        this.tacoCanvas = document.createElement('canvas');
        this.tacoCanvas.id = 'taco-canvas';
        this.tacoCanvas.style.position = 'fixed';
        this.tacoCanvas.style.top = '0';
        this.tacoCanvas.style.left = '0';
        this.tacoCanvas.style.width = '100vw';
        this.tacoCanvas.style.height = '100vh';
        this.tacoCanvas.style.pointerEvents = 'none';
        this.tacoCanvas.style.zIndex = '9998';
        this.tacoCanvas.style.display = 'none';
        document.body.appendChild(this.tacoCanvas);

        this.tacoCtx = this.tacoCanvas.getContext('2d');
        this.resizeTacoCanvas();
        window.addEventListener('resize', () => this.resizeTacoCanvas());
    }

    resizeTacoCanvas() {
        if (!this.tacoCanvas) return;
        this.tacoCanvas.width = window.innerWidth;
        this.tacoCanvas.height = window.innerHeight;
    }

    setupSparkleCanvas() {
        this.sparkleCanvas = document.createElement('canvas');
        this.sparkleCanvas.id = 'sparkle-canvas';
        this.sparkleCanvas.style.position = 'fixed';
        this.sparkleCanvas.style.top = '0';
        this.sparkleCanvas.style.left = '0';
        this.sparkleCanvas.style.width = '100vw';
        this.sparkleCanvas.style.height = '100vh';
        this.sparkleCanvas.style.pointerEvents = 'none';
        this.sparkleCanvas.style.zIndex = '9999';
        document.body.appendChild(this.sparkleCanvas);

        this.sparkleCtx = this.sparkleCanvas.getContext('2d');
        this.resizeSparkleCanvas();
        window.addEventListener('resize', () => this.resizeSparkleCanvas());
        this.animateSparkles();
    }

    resizeSparkleCanvas() {
        if (!this.sparkleCanvas) return;
        this.sparkleCanvas.width = window.innerWidth;
        this.sparkleCanvas.height = window.innerHeight;
    }

    bindEvents() {
        // Cursor sparkle trail
        window.addEventListener('mousemove', (e) => {
            if (!this.sparklesActive) return;
            for (let i = 0; i < 2; i++) {
                this.sparkleParticles.push({
                    x: e.clientX + (Math.random() - 0.5) * 10,
                    y: e.clientY + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 - 1,
                    size: Math.random() * 4 + 2,
                    color: this.getRandomColor(),
                    alpha: 1,
                    decay: Math.random() * 0.03 + 0.02
                });
            }
        });
    }

    getRandomColor() {
        const colors = ['#00f0ff', '#ff007f', '#ffe600', '#00ff66', '#a855f7', '#ff8000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animateSparkles() {
        if (!this.sparkleCtx) return;
        this.sparkleCtx.clearRect(0, 0, this.sparkleCanvas.width, this.sparkleCanvas.height);

        for (let i = this.sparkleParticles.length - 1; i >= 0; i--) {
            const p = this.sparkleParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.sparkleParticles.splice(i, 1);
                continue;
            }

            this.sparkleCtx.save();
            this.sparkleCtx.globalAlpha = p.alpha;
            this.sparkleCtx.fillStyle = p.color;
            this.sparkleCtx.shadowColor = p.color;
            this.sparkleCtx.shadowBlur = 8;
            this.sparkleCtx.beginPath();
            this.sparkleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.sparkleCtx.fill();
            this.sparkleCtx.restore();
        }

        this.sparkleAnimationId = requestAnimationFrame(() => this.animateSparkles());
    }

    // --- TACO RAIN ---
    toggleTacoRain(forceState) {
        this.tacoRainActive = forceState !== undefined ? forceState : !this.tacoRainActive;
        this.tacoCanvas.style.display = this.tacoRainActive ? 'block' : 'none';

        if (this.tacoRainActive) {
            this.tacoParticles = [];
            const count = 45;
            const tacoEmojis = ['🌮', '🌯', '🌶️', '🧀', '🌮', '🥑', '✨', '🌮'];
            for (let i = 0; i < count; i++) {
                this.tacoParticles.push({
                    x: Math.random() * this.tacoCanvas.width,
                    y: Math.random() * -this.tacoCanvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: Math.random() * 4 + 3,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 8,
                    size: Math.random() * 24 + 28,
                    char: tacoEmojis[Math.floor(Math.random() * tacoEmojis.length)]
                });
            }
            this.animateTacos();
        } else {
            if (this.tacoAnimationId) {
                cancelAnimationFrame(this.tacoAnimationId);
                this.tacoAnimationId = null;
            }
            if (this.tacoCtx) {
                this.tacoCtx.clearRect(0, 0, this.tacoCanvas.width, this.tacoCanvas.height);
            }
        }
        return this.tacoRainActive;
    }

    animateTacos() {
        if (!this.tacoRainActive) return;

        this.tacoCtx.clearRect(0, 0, this.tacoCanvas.width, this.tacoCanvas.height);

        this.tacoParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            if (p.y > this.tacoCanvas.height + 50) {
                p.y = -50;
                p.x = Math.random() * this.tacoCanvas.width;
            }

            this.tacoCtx.save();
            this.tacoCtx.translate(p.x, p.y);
            this.tacoCtx.rotate((p.rotation * Math.PI) / 180);
            this.tacoCtx.font = `${p.size}px "Segoe UI Emoji", Apple Color Emoji, sans-serif`;
            this.tacoCtx.textAlign = 'center';
            this.tacoCtx.textBaseline = 'middle';
            this.tacoCtx.fillText(p.char, 0, 0);
            this.tacoCtx.restore();
        });

        this.tacoAnimationId = requestAnimationFrame(() => this.animateTacos());
    }

    // --- RGB & DISCO LIGHTS ---
    toggleRGB(forceState) {
        this.rgbModeActive = forceState !== undefined ? forceState : !this.rgbModeActive;
        if (this.rgbModeActive) {
            document.body.classList.add('rgb-gamer-mode');
        } else {
            document.body.classList.remove('rgb-gamer-mode');
        }
        return this.rgbModeActive;
    }

    toggleDisco(forceState) {
        this.discoModeActive = forceState !== undefined ? forceState : !this.discoModeActive;
        if (this.discoModeActive) {
            document.body.classList.add('disco-party-mode');
        } else {
            document.body.classList.remove('disco-party-mode');
        }
        return this.discoModeActive;
    }

    // --- SCREEN SHAKE & EXPLOSION ---
    screenShake() {
        document.body.classList.add('screen-shake-anim');
        setTimeout(() => {
            document.body.classList.remove('screen-shake-anim');
        }, 500);
    }

    // Confetti burst
    confettiBurst(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
        const count = 70;
        const colors = ['#ff0055', '#00ffcc', '#ffcc00', '#3333ff', '#ff00cc', '#00ff00'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 4;
            this.sparkleParticles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                size: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }
}

// Global instance
window.effectsManager = new EffectsManager();
