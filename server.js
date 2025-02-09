const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '.'))); // Serve static files from the current directory

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
