const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let n = 0;
let m = 0;
let colors = [];
let connections = [];
let selectedVertex = null;

function drawPolygon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;


    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${colors[i] * 360 / m}, 100%, 50%)`;
        if (selectedVertex === i) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        ctx.fill();
    }

    // Draw connections
    ctx.strokeStyle = 'black';
    connections.forEach(connection => {
        const start = connection[0];
        const end = connection[1];
        const startX = centerX + radius * Math.cos((2 * Math.PI * start) / n);
        const startY = centerY + radius * Math.sin((2 * Math.PI * start) / n);
        const endX = centerX + radius * Math.cos((2 * Math.PI * end) / n);
        const endY = centerY + radius * Math.sin((2 * Math.PI * end) / n);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
}

function connectDots() {
    n = parseInt(document.getElementById("n").value);
    m = parseInt(document.getElementById("m").value);
    colors = document.getElementById("colors").value.split(" ").map(Number);
    connections = []; // Clear existing connections
    selectedVertex = null;
    drawPolygon();
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (Math.sqrt((mouseX - x)**2 + (mouseY - y)**2) < 10) { // Check if click is near a vertex
            handleClick(i);
            break;
        }
    }
});

function handleClick(i) {
    if (selectedVertex === null) {
        selectedVertex = i;
        drawPolygon(); // Redraw to highlight selected vertex
    } else if (selectedVertex === i) {
        selectedVertex = null; // Deselect if same vertex clicked again
        drawPolygon(); // Redraw to remove highlight
    } else {
        if (colors[selectedVertex] !== colors[i]) { // Check for different colors
            let intersects = false;
            for (const existingConnection of connections) {
                if (doIntersect(selectedVertex, i, existingConnection[0], existingConnection[1], n)) {
                    intersects = true;
                    break;
                }
            }

            if (selectedVertex < i) {
                var a = selectedVertex;
                var b = i;
            } else {
                var a = i;
                var b = selectedVertex;
            }

            if (!intersects && !connections.some(connection => (connection[0] === a && connection[1] === b))) {
                connections.push([a, b]);
                selectedVertex = null; // Deselect after successful connection
                drawPolygon(); // Redraw to show the connection
            } else {
                selectedVertex = null;
                drawPolygon();
            }
        } else {
            selectedVertex = null; // Deselect if same color
            drawPolygon();
        }

    }
}


function doIntersect(a, b, c, d, n) {
    // Function to check if connections (a, b) and (c, d) intersect in a circular array of size n, excluding endpoint intersections
    const normalize = (x) => (x + n) % n;

    a = normalize(a);
    b = normalize(b);
    c = normalize(c);
    d = normalize(d);

    if (a > b) [a, b] = [b, a];
    if (c > d) [c, d] = [d, c];

    if (a === c || a === d || b === c || b === d) return false; // Endpoints are not considered intersections

    return (a < c && c < b && b < d) || (c < a && a < d && d < b);
}
