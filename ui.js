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
    }

    init() {
        this.updateDisplay();

        this.title.addEventListener('click', () => {
            this.polygon.colors = this.polygon.generatePermutation(this.polygon.n, this.polygon.m);
            this.polygon.connections = []; // Reset connections
            this.polygon.selectedVertex = null; // Reset selected vertex
            this.polygon.state = 'idle'; // Reset state
            this.polygon.drawPolygon();
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

            for (let i = 0; i < this.polygon.n; i++) {
                const angle = (2 * Math.PI * i) / this.polygon.n;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (Math.sqrt((mouseX - x)**2 + (mouseY - y)**2) < 10) { // Check if click is near a vertex
                    this.polygon.handleClick(i);
                    break;
                }
            }
        });

        this.polygon.drawPolygon();
    }

    updateDisplay() {
        this.nDisplay.textContent = `Number of nodes: ${this.polygon.n}`;
        this.mDisplay.textContent = `Number of colors: ${this.polygon.m}`;
    }

    adjustN(delta) {
        this.polygon.n = Math.max(3, this.polygon.n + delta); // Ensure n is at least 3
        this.polygon.m = Math.min(this.polygon.m, this.polygon.n); // Ensure m is not greater than n
        this.updateDisplay();
        this.polygon.colors = this.polygon.generatePermutation(this.polygon.n, this.polygon.m);
        this.polygon.connections = []; // Clear connections on resize
        this.polygon.selectedVertex = null;
        this.polygon.state = 'idle'; // Reset state
        this.polygon.drawPolygon();
    }

    adjustM(delta) {
        this.polygon.m = Math.max(2, Math.min(this.polygon.n, this.polygon.m + delta)); // Ensure m is at least 2 and not greater than n
        this.updateDisplay();
        this.polygon.colors = this.polygon.generatePermutation(this.polygon.n, this.polygon.m);
        this.polygon.connections = []; // Clear connections on resize
        this.polygon.selectedVertex = null;
        this.polygon.state = 'idle'; // Reset state
        this.polygon.drawPolygon();
    }
}
