import { drawPolygon } from './renderer.js';
import { loadHint } from './hints.js';

let hasHitZeroOnce = false;
let competencyState = 0;

export class UI {
    constructor(polygon) {
        this.polygon = polygon;
        this.nDisplay = document.getElementById('n-display');
        // this.mDisplay = document.getElementById('m-display');
        this.title = document.getElementById('title');
        this.decreaseNButton = document.getElementById('decrease-n');
        this.increaseNButton = document.getElementById('increase-n');
        // this.decreaseMButton = document.getElementById('decrease-m');
        // this.increaseMButton = document.getElementById('increase-m');
        this.maxEdgesDisplay = document.getElementById('max-edges-display');
        this.hintsButton = document.getElementById('hints-button');
        this.hintsDiv = document.getElementById('hints-div');
        this.canvasContainer = document.getElementById('canvas-container');
        this.redDotRadius = 10;
        this.clickRadius = 15;
        this.hintsVisible = false; // Add this line to track hints visibility
    }

    init() {
        this.updateDisplay();

        this.title.addEventListener('click', () => {
            this.polygon = this.polygon.reset();
            this.updateDisplay();
            drawPolygon(this.polygon, this);
        });

        this.decreaseNButton.addEventListener('click', () => this.adjustN(-1));
        this.increaseNButton.addEventListener('click', () => this.adjustN(1));
        // this.decreaseMButton.addEventListener('click', () => this.adjustM(-1));
        // this.increaseMButton.addEventListener('click', () => this.adjustM(1));

        this.hintsButton.addEventListener('click', () => {
            this.hintsVisible = !this.hintsVisible; // Toggle hints visibility
            this.updateDisplay();
            drawPolygon(this.polygon, this);
        });

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
                if (Math.sqrt((mouseX - x)**2 + (mouseY - y)**2) < this.clickRadius) { // Check if click is near a vertex
                    this.polygon.handleClick(i);
                    this.updateDisplay();
                    drawPolygon(this.polygon, this);
                    break;
                }
            }

            // Check if click is near a red dot
            for (const connection of this.polygon.getState().userConnections) {
                const [a, b] = connection;
                const angleA = (2 * Math.PI * a) / this.polygon.getState().n;
                const angleB = (2 * Math.PI * b) / this.polygon.getState().n;
                const xA = centerX + radius * Math.cos(angleA);
                const yA = centerY + radius * Math.sin(angleA);
                const xB = centerX + radius * Math.cos(angleB);
                const yB = centerY + radius * Math.sin(angleB);
                const midX = (xA + xB) / 2;
                const midY = (yA + yB) / 2;
                if (Math.sqrt((mouseX - midX)**2 + (mouseY - midY)**2) < this.clickRadius) { // Check if click is near the red dot
                    this.polygon.handleEdgeClick(connection);
                    this.updateDisplay();
                    drawPolygon(this.polygon, this);
                    break;
                }
            }
        });

        drawPolygon(this.polygon, this);
    }

    updateDisplay() {
        const state = this.polygon.getState();
        this.nDisplay.textContent = `Number of nodes: ${state.n}`;
        // this.mDisplay.textContent = `Number of colors: ${state.m}`;
        this.maxEdgesDisplay.textContent = `Edges left: ${state.edgesLeft}`;

        hasHitZeroOnce = hasHitZeroOnce || state.edgesLeft === 0;
        if (hasHitZeroOnce) {
            this.hintsButton.style.display = 'inline-block';
            this.hintsButton.textContent = this.hintsVisible ? 'Hide hints' : 'Load hints!';
            this.hintsDiv.style.display = this.hintsVisible ? 'block' : 'none';
            this.hintsDiv.style.opacity = this.hintsVisible ? '1' : '0';
            this.canvasContainer.style.justifyContent = this.hintsVisible ? 'flex-start' : 'center';

            if (state.edgesLeft === 0 && competencyState === 0) {
                competencyState = 1;
                loadHint(competencyState);
            }
        } else {
            this.hintsButton.style.display = 'none';
            this.hintsDiv.style.display = 'none';
            this.canvasContainer.style.justifyContent = 'center';
        }
    }

    adjustN(delta) {
        this.polygon = this.polygon.adjustN(delta);
        this.updateDisplay();
        drawPolygon(this.polygon, this);
    }

    adjustM(delta) {
        this.polygon = this.polygon.adjustM(delta);
        this.updateDisplay();
        drawPolygon(this.polygon, this);
    }
}
