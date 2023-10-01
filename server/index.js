
// feels like python imports
const express = require('express');
const connectDB = require('./db');

// feels like creating an instance of a class
const app = express();
const PORT = process.env.PORT;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
