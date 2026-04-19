const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Create Journal
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { title, location, date, description, mood, lat, lng } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const journal = new Journal({
            title,
            location,
            date,
            description,
            mood,
            images,
            coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
            user: req.user.id
        });

        await journal.save();
        res.status(201).json(journal);
    } catch (err) {
        console.error('Create journal error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get All Journals for User
router.get('/', authMiddleware, async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 });
        res.json(journals);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Single Journal
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        if (!journal) return res.status(404).json({ message: 'Journal not found' });
        res.json(journal);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Journal
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { title, location, date, description, mood, lat, lng, existingImages } = req.body;
        let images = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
        
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            images = [...images, ...newImages];
        }

        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                title, location, date, description, mood, images,
                coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined
            },
            { new: true }
        );

        if (!journal) return res.status(404).json({ message: 'Journal not found' });
        res.json(journal);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Journal
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!journal) return res.status(404).json({ message: 'Journal not found' });
        res.json({ message: 'Journal deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
