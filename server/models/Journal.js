const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    mood: { 
        type: String, 
        enum: ['Excited', 'Peaceful', 'Adventurous', 'Nostalgic'], 
        required: true 
    },
    images: [{ type: String }], // Array of image URLs/paths
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);
