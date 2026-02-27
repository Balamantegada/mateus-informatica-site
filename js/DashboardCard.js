/**
 * DashboardCard Component
 * Generates DOM elements for a simulated dashboard metric card.
 */

export class DashboardCard {
    /**
     * @param {Object} props 
     * @param {number} props.width
     * @param {number} props.height
     * @param {number} props.rotation
     * @param {number} props.x
     * @param {number} props.y
     * @param {number} props.depth
     * @param {number} props.scale
     * @param {number} props.translateZ
     * @param {"green" | "blue" | "red"} props.theme
     * @param {"line" | "bar" | "mixed" | "metric"} props.chartType
     * @param {string} props.title
     * @param {string} props.value
     * @param {boolean} props.animated
     * @param {string} props.indicator
     */
    constructor(props) {
        this.props = {
            width: 280,
            height: 'auto',
            theme: 'blue',
            chartType: 'metric',
            title: 'Metric',
            value: '0',
            indicator: null,
            animated: true,
            ...props
        };

        this.element = this.createElement();
    }

    createElement() {
        const wrapper = document.createElement('div');
        wrapper.className = 'procedural-card-wrapper';

        const card = document.createElement('div');
        card.className = `procedural-card theme-${this.props.theme}`;

        // Calculate dynamic styles based on layout params
        const { x, y, rotation, scale, translateZ, depth, width, height, animated } = this.props;

        // Visual depth calculations
        const blurAmount = Math.max(0, depth - 2) * 1.5; // Only blur items far away
        const opacity = 1 - (depth * 0.08); // Farther = more transparent

        wrapper.style.position = 'absolute';
        wrapper.style.left = '0';
        wrapper.style.top = '0';
        wrapper.style.transform = `translate3d(${x}px, ${y}px, ${translateZ}px) rotate(${rotation}deg) scale(${scale})`;
        wrapper.style.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : 'none';
        wrapper.style.opacity = opacity.toString();
        wrapper.style.zIndex = Math.floor(100 - depth);

        card.style.width = typeof width === 'number' ? `${width}px` : width;
        if (height !== 'auto') card.style.height = `${height}px`;

        // Generate inner content based on chartType
        card.innerHTML = this.generateCardBody();
        wrapper.appendChild(card);

        this.wrapper = wrapper; // Save reference for fast updates later
        return wrapper;
    }

    /**
     * Efficiently updates the wrapper's 3D transform without touching the DOM tree
     * @param {number} newX 
     * @param {number} newY 
     */
    updatePosition(newX, newY) {
        if (!this.wrapper) return;
        const { rotation, scale, translateZ } = this.props;
        // Update stored props so they stay in sync
        this.props.x = newX;
        this.props.y = newY;
        this.wrapper.style.transform = `translate3d(${newX}px, ${newY}px, ${translateZ}px) rotate(${rotation}deg) scale(${scale})`;
    }

    /**
     * Updates the card's numeric value with an animation
     * @param {string} newValue 
     */
    updateValue(newValue) {
        if (!this.element) return;
        const valueElement = this.element.querySelector('.card-value');
        if (!valueElement) return;

        // Detect percentage for specialized animation
        const isPercentage = newValue.includes('%');
        valueElement.classList.toggle('is-percentage', isPercentage);

        // Trigger animation
        valueElement.classList.remove('updating');
        void valueElement.offsetWidth; // Force reflow
        valueElement.classList.add('updating');

        // Update text with numeric parts isolated in spans
        valueElement.innerHTML = this.formatValue(newValue);
        this.props.value = newValue;

        // Spawn Phantom value effect (showing the numeric part or full value)
        const numericMatch = newValue.match(/[0-9.,]+/);
        this.spawnPhantomValue(numericMatch ? (isPercentage ? numericMatch[0] + '%' : numericMatch[0]) : newValue);
    }

    /**
     * Wraps numeric parts of a string in a span for targeted animation
     * @param {string} val 
     */
    formatValue(val) {
        return val.replace(/([0-9.,]+)/g, '<span class="number-part">$1</span>');
    }

    /**
     * Spawns a temporary phantom element that floats up and fades
     * @param {string} text 
     */
    spawnPhantomValue(text) {
        if (!this.element) return;
        const phantom = document.createElement('div');
        phantom.className = 'phantom-value';
        phantom.textContent = text;

        // Append to the card element so it's relatively positioned
        const card = this.element.querySelector('.procedural-card');
        if (card) {
            card.appendChild(phantom);
            // Remove after animation completes
            setTimeout(() => phantom.remove(), 1000);
        }
    }

    generateCardBody() {
        const { title, value, chartType, indicator, theme } = this.props;

        let chartHTML = '';

        switch (chartType) {
            case 'line':
                chartHTML = this.generateLineChart();
                break;
            case 'bar':
                chartHTML = this.generateBarChart();
                break;
            case 'mixed':
            case 'metric':
            default:
                chartHTML = this.generateMetricIcon();
                break;
        }

        const indicatorHTML = indicator
            ? `<span class="card-indicator ${indicator.startsWith('-') ? 'negative' : 'positive'}">${indicator}</span>`
            : '';

        return `
            <div class="card-header">
                <h4 class="card-title">${title}</h4>
                ${indicatorHTML}
            </div>
            <div class="card-value ${value.includes('%') ? 'is-percentage' : ''}">${this.formatValue(value)}</div>
            <div class="card-chart">
                ${chartHTML}
            </div>
        `;
    }

    generateLineChart() {
        const { theme } = this.props;
        const color = this.getThemeColor();

        // Simple SVG line chart simulation
        return `
            <svg viewBox="0 0 200 60" class="svg-chart">
                <defs>
                    <linearGradient id="grad-${theme}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="${color}" stop-opacity="0.2" />
                        <stop offset="100%" stop-color="${color}" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <path d="M0,60 L0,40 C20,30 40,50 60,35 C80,20 100,45 120,25 C140,5 160,20 180,10 L200,5 L200,60 Z" fill="url(#grad-${theme})" />
                <path class="animated-line" d="M0,40 C20,30 40,50 60,35 C80,20 100,45 120,25 C140,5 160,20 180,10 L200,5" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <circle class="animated-point point-1" cx="120" cy="25" r="4" fill="#fff" stroke="${color}" stroke-width="2" />
                <circle class="animated-point point-2" cx="180" cy="10" r="4" fill="#fff" stroke="${color}" stroke-width="2" />
                <circle class="animated-point point-3" cx="200" cy="5" r="4" fill="${color}" />
            </svg>
        `;
    }

    generateBarChart() {
        const color = this.getThemeColor();
        const colorLight = this.getThemeColorLight();

        return `
            <div class="bar-chart-container">
                <div class="bar" style="height: 40%; background-color: ${colorLight}"></div>
                <div class="bar" style="height: 60%; background-color: ${colorLight}"></div>
                <div class="bar" style="height: 30%; background-color: ${colorLight}"></div>
                <div class="bar" style="height: 80%; background-color: ${color}"></div>
                <div class="bar" style="height: 50%; background-color: ${colorLight}"></div>
                <div class="bar" style="height: 90%; background-color: ${color}"></div>
                <div class="bar" style="height: 70%; background-color: ${colorLight}"></div>
            </div>
        `;
    }

    generateMetricIcon() {
        const { theme } = this.props;
        let iconClass = 'ph-trend-up';

        if (theme === 'red') iconClass = 'ph-trend-down';
        if (theme === 'blue') iconClass = 'ph-users';

        return `
            <div class="metric-icon-wrap" style="color: ${this.getThemeColor()}; background-color: ${this.getThemeColorLight()};">
                <i class="ph ${iconClass}"></i>
            </div>
        `;
    }

    getThemeColor() {
        const { theme } = this.props;
        if (theme === 'green') return '#10b981'; // Tailwind Emerald 500
        if (theme === 'red') return '#ef4444';   // Tailwind Red 500
        return '#3b82f6';                        // Tailwind Blue 500
    }

    getThemeColorLight() {
        const { theme } = this.props;
        if (theme === 'green') return 'rgba(16, 185, 129, 0.15)';
        if (theme === 'red') return 'rgba(239, 68, 68, 0.15)';
        return 'rgba(59, 130, 246, 0.15)';
    }

    getElement() {
        return this.element;
    }
}
