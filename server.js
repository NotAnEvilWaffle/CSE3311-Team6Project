// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './token.env' });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const courseRoutes = require('./routes/courses');
app.use('/api/courses', courseRoutes);

// Use the environment variable for MongoDB connection
const mongoDBUri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('GradePal Backend');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
