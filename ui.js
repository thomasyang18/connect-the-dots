import { drawPolygon } from './renderer.js';
import { globalState } from './global_state.js';
import { loadHint } from './hints.js';

export class UI {
    constructor(polygon) {
        this.polygon = polygon;
        // this.title = document.getElementById('title');
        this.hintsDiv = document.getElementById('hints-div');
        this.devMessageDiv = document.getElementById('dev-message-div');
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

            for (let i = 0; i < this.polygon.n; i++) {
                const angle = (2 * Math.PI * i) / this.polygon.n;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
                if (distance <= this.clickRadius) {
                    this.polygon.handleClick(i);
                    this.updateDisplay();
                    break;
                }
            }

            // Check if a red dot was clicked
            for (const connection of this.polygon.userConnections) {
                const [a, b] = connection;
                const angleA = (2 * Math.PI * a) / this.polygon.n;
                const angleB = (2 * Math.PI * b) / this.polygon.n;
                const xA = centerX + radius * Math.cos(angleA);
                const yA = centerY + radius * Math.sin(angleA);
                const xB = centerX + radius * Math.cos(angleB);
                const yB = centerY + radius * Math.sin(angleB);
                const midX = (xA + xB) / 2;
                const midY = (yA + yB) / 2;
                const distance = Math.sqrt((mouseX - midX) ** 2 + (mouseY - midY) ** 2);
                if (distance <= this.redDotRadius) {
                    this.polygon.handleEdgeClick(connection);
                    this.updateDisplay();
                    break;
                }
            }
        });

        document.getElementById('close-dev-message').addEventListener('click', () => {
            this.devMessageDiv.style.display = 'none';
            this.hintsDiv.style.display = 'block';
        });
    }

    updateDisplay() {
        const state = this.polygon.getState();

        // console.log(this.polygon.colors);

        // if (globalState.numbersSolved.size > 1) {
        
        
        // TODO: I wanna have some "pop up " nice animation here but yea its ocnfusing having 0 instructions
            this.hintsDiv.style.display = 'block';
            this.hintsDiv.style.opacity = '1';
            this.canvasContainer.style.justifyContent = 'flex-start';
            loadHint();
        // } else {
        //     this.hintsDiv.style.display = 'none';
        //     this.canvasContainer.style.justifyContent = 'center';
        // }

        if (state.edgesLeft == 0) {
            let before = globalState.numbersSolved.has(state.n);

            globalState.numbersSolved.add(state.n);

            if (before === false) { // auto progrss if on latest
                this.adjustN(state.n + 1);
                return;
            }
        }

        drawPolygon(this.polygon, this);
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
