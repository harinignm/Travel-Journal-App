const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
const path = require('path');

// Fix for querySrv ECONNREFUSED on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://travel-journal-app-ai2v.vercel.app",
        "https://travel-journal-app-vyc1.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/journals', require('./routes/journals'));

// Default Route
app.get('/', (req, res) => {
    res.send('Wanderlust API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
