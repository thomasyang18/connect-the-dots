import { drawPolygon } from './renderer.js';

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
        this.proofButton = document.getElementById('proof-button');
        this.proofDiv = document.getElementById('proof-div');
        this.canvasContainer = document.getElementById('canvas-container');
        this.redDotRadius = 10;
        this.clickRadius = 15;
        this.proofVisible = false; // Add this line to track proof visibility
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

        this.proofButton.addEventListener('click', () => {
            this.proofVisible = !this.proofVisible; // Toggle proof visibility
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
        if (state.edgesLeft === 0) {
            this.proofButton.style.display = 'inline-block';
            this.proofButton.textContent = this.proofVisible ? 'Hide proof' : 'Reveal proof';
            this.proofDiv.style.display = this.proofVisible ? 'block' : 'none';
            this.proofDiv.style.opacity = this.proofVisible ? '1' : '0';
            this.canvasContainer.style.justifyContent = this.proofVisible ? 'flex-start' : 'center';
        } else {
            this.proofButton.style.display = 'none';
            this.proofDiv.style.display = 'none';
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
