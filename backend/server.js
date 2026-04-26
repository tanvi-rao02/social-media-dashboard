// server.js - Main entry point
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://social-media-dashboard-pl2o.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);

// HEALTH CHECK
app.get('/', (req, res) => {
    res.json({
        message: '✅ Social Media Dashboard API is running!',
        version: '1.0.0'
    });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
