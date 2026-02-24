import { generateProceduralLayout } from './useProceduralLayout.js';
import { DashboardCard } from './DashboardCard.js';

/**
 * Main orchestrator for the procedural background system
 */
export class BackgroundSystem {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.container - The DOM element to render into
     * @param {Array<Object>} [options.cardsConfig] - Optional JSON array of card configurations
     */
    constructor({ container, cardsConfig = null }) {
        this.container = container;
        this.cardsConfig = cardsConfig;

        // Default configurations if none provided
        this.defaultConfigs = [
            { chartType: 'line', theme: 'green', title: 'Receita Mensal', value: 'R$ 19.922,62', indicator: '+8.4%' },
            { chartType: 'bar', theme: 'blue', title: 'Relatórios Financeiros', value: 'Visão Geral', indicator: null },
            { chartType: 'metric', theme: 'green', title: 'Clientes Ativos', value: '2.284', indicator: '+12%' },
            { chartType: 'line', theme: 'red', title: 'Despesas', value: 'R$ 4.300,00', indicator: '-2.1%' },
            { chartType: 'bar', theme: 'green', title: 'Vendas Anuais', value: '84.5k', indicator: '+15%' },
            { chartType: 'metric', theme: 'blue', title: 'Novos Leads', value: '450', indicator: '+5%' },

            { chartType: 'line', theme: 'blue', title: 'Crescimento Semanal', value: '6.8%', indicator: '+1.2%' },
            { chartType: 'metric', theme: 'green', title: 'Conversão', value: '3.42%', indicator: '+0.4%' },
            { chartType: 'bar', theme: 'red', title: 'Cancelamentos', value: '128', indicator: '-3%' },
            { chartType: 'line', theme: 'green', title: 'Fluxo de Caixa', value: 'R$ 52.340', indicator: '+6%' },
            { chartType: 'metric', theme: 'blue', title: 'Usuários Online', value: '1.904', indicator: '+9%' },
            { chartType: 'bar', theme: 'green', title: 'Performance de Vendas', value: 'Q1 2026', indicator: '+11%' },

            { chartType: 'line', theme: 'red', title: 'Taxa de Rejeição', value: '41%', indicator: '-2%' },
            { chartType: 'metric', theme: 'green', title: 'Retenção', value: '87%', indicator: '+3%' },
            { chartType: 'bar', theme: 'blue', title: 'Engajamento', value: 'Média Mensal', indicator: '+7%' },
            { chartType: 'line', theme: 'green', title: 'Lucro Líquido', value: 'R$ 12.780', indicator: '+4%' },
            { chartType: 'metric', theme: 'red', title: 'Chamados Abertos', value: '32', indicator: '-5%' },
            { chartType: 'bar', theme: 'green', title: 'Meta Atingida', value: '92%', indicator: '+8%' },

            { chartType: 'line', theme: 'blue', title: 'Tráfego Orgânico', value: '18.4k', indicator: '+13%' },
            { chartType: 'metric', theme: 'green', title: 'ROI Campanhas', value: '4.2x', indicator: '+0.8x' },
            { chartType: 'bar', theme: 'red', title: 'Custos Operacionais', value: 'R$ 8.900', indicator: '-1.5%' },
            { chartType: 'line', theme: 'green', title: 'Assinaturas Ativas', value: '5.480', indicator: '+10%' },
            { chartType: 'metric', theme: 'blue', title: 'Tempo Médio Sessão', value: '3m 42s', indicator: '+6%' },
            { chartType: 'bar', theme: 'green', title: 'Distribuição Regional', value: 'Brasil', indicator: '+5%' }
        ];

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('BackgroundSystem: container not found.');
            return;
        }

        // Setup container styles
        this.container.classList.add('procedural-bg-container');

        // Add a master wrapper for mouse parallax
        this.parallaxWrapper = document.createElement('div');
        this.parallaxWrapper.className = 'procedural-parallax-wrapper';
        this.container.appendChild(this.parallaxWrapper);

        this.cardInstances = []; // Store instances for animation loop
        this.animationFrameId = null;

        this.render();
        this.bindEvents();
        this.startAnimationLoop();
    }

    getCardCountThreshold() {
        const width = window.innerWidth;
        if (width < 768) return 6; // Mobile: drastically reduce cards
        if (width < 1200) return 15; // Tablet: fewer cards
        return 30; // Desktop: full experience
    }

    render() {
        // Clear existing
        this.parallaxWrapper.innerHTML = '';
        this.cardInstances = [];

        const cardCount = this.getCardCountThreshold();

        // Generate layout configuration
        const layout = generateProceduralLayout(cardCount, {
            gridCols: window.innerWidth < 768 ? 2 : 4,
            spacingX: window.innerWidth < 768 ? 250 : 350,
            spacingY: window.innerWidth < 768 ? 200 : 250,
            offsetX: window.innerWidth < 768 ? -50 : -200,
        });

        // Loop and render cards
        layout.forEach((pos, index) => {
            // Determine config source
            let configSource = null;
            if (this.cardsConfig && this.cardsConfig.length > 0) {
                configSource = this.cardsConfig[index % this.cardsConfig.length];
            } else {
                configSource = this.defaultConfigs[index % this.defaultConfigs.length];
            }

            // Merge layout props with config props
            const cardProps = {
                ...configSource,
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                scale: pos.scale,
                depth: pos.depth,
                translateZ: pos.translateZ,
                animated: true // Enable CSS float animation
            };

            const card = new DashboardCard(cardProps);
            this.parallaxWrapper.appendChild(card.getElement());

            // Add physics properties for fluid animation
            this.cardInstances.push({
                instance: card,
                // Base speed (pixels per frame approx) - very slow and majestic
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2,
                // Sine wave parameters for organic wobbling
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                freqX: 0.0005 + Math.random() * 0.001,
                freqY: 0.0008 + Math.random() * 0.001,
                ampX: 10 + Math.random() * 20, // max pixels to wobble
                ampY: 15 + Math.random() * 30
            });
        });
    }

    startAnimationLoop() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        let lastTime = performance.now();

        const animate = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            // Prevent huge jumps if tab is inactive
            if (deltaTime > 100) {
                this.animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const width = window.innerWidth;
            const height = window.innerHeight;
            // Add some padding to bounds so cards fully disappear before wrapping
            const boundPadding = 400;

            this.cardInstances.forEach(item => {
                const { instance, vx, vy, phaseX, phaseY, freqX, freqY, ampX, ampY } = item;

                // Base linear movement
                let currentX = instance.props.x + vx * (deltaTime / 16);
                let currentY = instance.props.y + vy * (deltaTime / 16);

                // Add organic sine-wave wobble
                const wobbleX = Math.sin(timestamp * freqX + phaseX) * (ampX * 0.01);
                const wobbleY = Math.cos(timestamp * freqY + phaseY) * (ampY * 0.01);

                currentX += wobbleX;
                currentY += wobbleY;

                // Screen Wrapping Logic (Infinite Ocean)
                if (currentX > width + boundPadding) currentX = -boundPadding;
                if (currentX < -boundPadding) currentX = width + boundPadding;

                if (currentY > height + boundPadding) currentY = -boundPadding;
                if (currentY < -boundPadding) currentY = height + boundPadding;

                // Apply update
                instance.updatePosition(currentX, currentY);
            });

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    bindEvents() {
        // Subtle mouse parallax effect
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            // Normalize mouse position to -1 to 1
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        // Animation loop for smooth parallax
        const updateParallax = () => {
            // Interpolate for smoothness
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            // Move the entire wrapper slightly inverse to mouse
            if (this.parallaxWrapper) {
                const moveX = currentX * -30; // Max 30px movement
                const moveY = currentY * -30;
                this.parallaxWrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            }

            requestAnimationFrame(updateParallax);
        };

        requestAnimationFrame(updateParallax);

        // Handle Resize (debounce is recommended but simple timeout works for now)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.render(); // Re-render to adjust card count and layout based on new size
            }, 300);
        });
    }
}
