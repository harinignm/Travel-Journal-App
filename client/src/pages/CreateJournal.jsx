import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { MapPin, Calendar, Type, MessageSquare, Send, Loader2, Smile } from 'lucide-react';
import api from '../api/api';
import ImageUpload from '../components/ImageUpload';
import MapView from '../components/MapView';

const CreateJournal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState('Excited');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [selectedPos, setSelectedPos] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) return toast.error("Please upload at least one image");
        
        const year = new Date(date).getFullYear();
        if (year > 9999) return toast.error("Please enter a valid 4-digit year");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('date', date);
        formData.append('description', description);
        formData.append('mood', mood);
        if (selectedPos) {
            formData.append('lat', selectedPos.lat);
            formData.append('lng', selectedPos.lng);
        }
        images.forEach(image => formData.append('images', image));

        try {
            await api.post('/journals', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Memories captured successfully!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create journal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div>
                    <h1 className="text-4xl font-bold mb-2">New Adventure</h1>
                    <p className="text-gray-400">Capture the essence of your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        {/* Title & Location */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Type size={16} className="text-gold" /> Title
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g., Sunset in Santorini"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <MapPin size={16} className="text-gold" /> Location Name
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g., Oia, Greece"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Date & Mood */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Calendar size={16} className="text-gold" /> Date
                                </label>
                                <input 
                                    type="date" 
                                    required 
                                    max="9999-12-31"
                                    value={date}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) {
                                            setDate('');
                                            return;
                                        }
                                        const parts = val.split('-');
                                        if (parts[0] && parts[0].length > 4) return;
                                        setDate(val);
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                            const year = new Date(val).getFullYear();
                                            if (year > 9999) setDate('');
                                        }
                                    }}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Smile size={16} className="text-gold" /> Mood
                                </label>
                                <select 
                                    value={mood}
                                    onChange={(e) => setMood(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="Excited">Excited</option>
                                    <option value="Peaceful">Peaceful</option>
                                    <option value="Adventurous">Adventurous</option>
                                    <option value="Nostalgic">Nostalgic</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <MessageSquare size={16} className="text-gold" /> Your Story
                            </label>
                            <textarea 
                                required 
                                rows={6}
                                placeholder="Tell the story of this place..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || images.length === 0}
                            className={`btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-xl transition-all duration-500 ${
                                images.length === 0 
                                ? 'opacity-30 cursor-not-allowed scale-95 grayscale' 
                                : 'opacity-100 cursor-pointer scale-100'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <><Send size={20} /> {images.length === 0 ? 'Add Photos to Preserve' : 'Preserve Memory'}</>
                            )}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Gallery</label>
                            <ImageUpload 
                                images={images} 
                                setImages={setImages} 
                                previews={previews} 
                                setPreviews={setPreviews} 
                            />
                        </div>

                        {/* Map Picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Pin on Map (Optional)</label>
                            <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                                <MapView 
                                    selectedPos={selectedPos} 
                                    onLocationSelect={setSelectedPos} 
                                />
                            </div>
                            <p className="text-xs text-gray-500 italic">Click on the map to mark the exact location</p>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateJournal;
