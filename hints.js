const hints = [
    "How would you come up with a general algorithm?",
    // Add more hints here
];

export function loadHint(state) {
    const hintsDiv = document.getElementById('hints-div');
    hintsDiv.innerHTML = ''; // Clear previous hints
    for (let i = 0; i < state; i++) {
        const hintElement = document.createElement('p');
        hintElement.textContent = hints[i];
        hintsDiv.appendChild(hintElement);
    }
}
