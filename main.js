import { Polygon } from './polygon.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialN = 4;
    const initialM = 3;
    const initialColors = Polygon.generatePermutation(initialN, initialM);
    const initialFreebieConnections = Polygon.generateFreebieConnections(initialN, initialColors);
    const polygon = new Polygon(initialN, initialM, initialColors, [], initialFreebieConnections);
    const ui = new UI(polygon);
    ui.init();
});
