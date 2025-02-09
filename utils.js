export function doIntersect(a, b, c, d, n) {
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
