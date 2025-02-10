import { drawPolygon } from './renderer.js';

export class UI {
    constructor(polygon) {
        this.polygon = polygon;
        this.nDisplay = document.getElementById('n-display');
        this.mDisplay = document.getElementById('m-display');
        this.title = document.getElementById('title');
        this.decreaseNButton = document.getElementById('decrease-n');
        this.increaseNButton = document.getElementById('increase-n');
        this.decreaseMButton = document.getElementById('decrease-m');
        this.increaseMButton = document.getElementById('increase-m');
        this.maxEdgesDisplay = document.getElementById('max-edges-display');
    }

    init() {
        this.updateDisplay();

        this.title.addEventListener('click', () => {
            this.polygon.reset();
            this.updateDisplay();
            drawPolygon(this.polygon);
        });

        this.decreaseNButton.addEventListener('click', () => this.adjustN(-1));
        this.increaseNButton.addEventListener('click', () => this.adjustN(1));
        this.decreaseMButton.addEventListener('click', () => this.adjustM(-1));
        this.increaseMButton.addEventListener('click', () => this.adjustM(1));

        document.getElementById('canvas').addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) * 0.9;

            for (let i = 0; i < this.polygon.getState().n; i++) {
                const angle = (2 * Math.PI * i) / this.polygon.getState().n;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (Math.sqrt((mouseX - x)**2 + (mouseY - y)**2) < 10) { // Check if click is near a vertex
                    this.polygon.handleClick(i);
                    this.updateDisplay();
                    drawPolygon(this.polygon);
                    break;
                }
            }
        });

        drawPolygon(this.polygon);
    }

    updateDisplay() {
        const state = this.polygon.getState();
        this.nDisplay.textContent = `Number of nodes: ${state.n}`;
        this.mDisplay.textContent = `Number of colors: ${state.m}`;
        this.maxEdgesDisplay.textContent = `Edges left: ${state.edgesLeft}`;
    }

    adjustN(delta) {
        this.polygon.adjustN(delta);
        this.updateDisplay();
        drawPolygon(this.polygon);
    }

    adjustM(delta) {
        this.polygon.adjustM(delta);
        this.updateDisplay();
        drawPolygon(this.polygon);
    }
}
