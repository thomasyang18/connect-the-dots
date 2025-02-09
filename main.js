import { Polygon } from './polygon.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const polygon = new Polygon();
    const ui = new UI(polygon);
    ui.init();
});
