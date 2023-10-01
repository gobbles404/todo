
// feels like python imports
const express = require('express');
const morgan = require('morgan');

const connectDB = require('./db');
const cors = require('cors');

// feels like creating an instance of a class
const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/create', (req, res) => {
    console.log('made it in post');
    try {
        console.log(req.body);
        res.json({ message: 'Received the request' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint is working' });
});