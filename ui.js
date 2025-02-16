import { drawPolygon } from './renderer.js';
import { loadHint } from './hints.js';
import { globalState } from './global_state.js';

class UI {
    constructor(polygon) {
        this.polygon = polygon;
        // this.title = document.getElementById('title');
        this.hintsDiv = document.getElementById('hints-div');
        this.canvasContainer = document.getElementById('canvas-container');
        this.redDotRadius = 10;
        this.clickRadius = 15;
        this.hintsVisible = false; // Add this line to track hints visibility
        this.achievementsDiv = document.getElementById('achievements');
    }

    init() {
        this.updateDisplay();

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

        globalState.hasHitZeroOnce = globalState.hasHitZeroOnce || state.edgesLeft === 0;

        if (globalState.hasHitZeroOnce) {
            this.hintsDiv.style.display = 'block';
            this.hintsDiv.style.opacity = '1';
            this.canvasContainer.style.justifyContent = 'flex-start';
        } else {
            this.hintsDiv.style.display = 'none';
            this.canvasContainer.style.justifyContent = 'center';
        }

        if (state.edgesLeft == 0) {
            let before = globalState.numbersSolved.has(state.n);

            globalState.numbersSolved.add(state.n);

            if (before === false) { // auto progrss if on latest
                this.adjustN(state.n + 1);
                return;
            }
        }

        if (globalState.hasHitZeroOnce) {
            loadHint(globalState.numbersSolved);
        }

        this.updateAchievements();
    }

    updateAchievements() {
        this.achievementsDiv.innerHTML = ''; // Clear previous achievements
        const maxN = Math.max(...globalState.numbersSolved);
        for (let i = 4; i <= maxN + 1; i++) {
            const achievementElement = document.createElement('div');
            achievementElement.textContent = i;
            achievementElement.classList.add('achievement-item');
            achievementElement.style.backgroundColor = i === maxN + 1 ? 'grey' : 'blue';
            achievementElement.style.border = i === this.polygon.getState().n ? '2px solid red' : 'none';
            achievementElement.addEventListener('click', () => this.adjustN(i));
            this.achievementsDiv.appendChild(achievementElement);
        }
    }

    adjustN(newN) {
        this.polygon = this.polygon.adjustN(newN);
        this.updateDisplay();
        drawPolygon(this.polygon, this);
    }
}

export { globalState, UI };
