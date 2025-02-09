export function generatePermutation(n, m) {
    const permutation = [];
    for (let i = 0; i < n; i++) {
        permutation.push(Math.floor(Math.random() * m) + 1); // Generate random color between 1 and m
    }
    return permutation;
}
