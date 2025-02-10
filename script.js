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
