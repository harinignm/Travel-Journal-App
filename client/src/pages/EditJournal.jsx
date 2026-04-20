import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { MapPin, Calendar, Type, MessageSquare, Save, Loader2, Smile, X } from 'lucide-react';
import api from '../api/api';
import ImageUpload from '../components/ImageUpload';
import MapView from '../components/MapView';
import { BASE_URL } from '../constants';

const EditJournal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState('Excited');
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [selectedPos, setSelectedPos] = useState(null);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const res = await api.get(`/journals/${id}`);
                const j = res.data;
                setTitle(j.title);
                setLocation(j.location);
                setDate(new Date(j.date).toISOString().split('T')[0]);
                setDescription(j.description);
                setMood(j.mood);
                setExistingImages(j.images);
                setSelectedPos(j.coordinates);
            } catch (err) {
                toast.error("Failed to load journal");
                navigate('/dashboard');
            } finally {
                setFetching(false);
            }
        };
        fetchJournal();
    }, [id, navigate]);

    const removeExistingImage = (img) => {
        setExistingImages(prev => prev.filter(i => i !== img));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (existingImages.length === 0 && newImages.length === 0) {
            return toast.error("Please keep at least one image");
        }
        
        const year = new Date(date).getFullYear();
        if (year > 9999) return toast.error("Please enter a valid 4-digit year");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('date', date);
        formData.append('description', description);
        formData.append('mood', mood);
        
        existingImages.forEach(img => formData.append('existingImages', img));
        newImages.forEach(image => formData.append('images', image));
        
        if (selectedPos) {
            formData.append('lat', selectedPos.lat);
            formData.append('lng', selectedPos.lng);
        }

        try {
            await api.put(`/journals/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Memories updated!");
            navigate(`/journal/${id}`);
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen pt-32 text-center text-gold font-bold">Loading...</div>;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
            >
                <h1 className="text-4xl font-bold">Edit Memories</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Type size={16} className="text-gold" /> Title
                            </label>
                            <input 
                                type="text" 
                                required 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <MapPin size={16} className="text-gold" /> Location
                            </label>
                            <input 
                                type="text" 
                                required 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="input-field"
                            />
                        </div>

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

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <MessageSquare size={16} className="text-gold" /> Your Story
                            </label>
                            <textarea 
                                required 
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || (existingImages.length === 0 && newImages.length === 0)}
                            className={`btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-xl transition-all duration-500 ${
                                (existingImages.length === 0 && newImages.length === 0) 
                                ? 'opacity-30 cursor-not-allowed scale-95 grayscale' 
                                : 'opacity-100 cursor-pointer scale-100'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <><Save size={20} /> {(existingImages.length === 0 && newImages.length === 0) ? 'Add Photos to Save' : 'Save Changes'}</>
                            )}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Existing Images */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Current Gallery</label>
                            <div className="grid grid-cols-3 gap-4">
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img src={`${BASE_URL}${img}`} alt="Existing" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeExistingImage(img)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add New Images */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Add More Photos</label>
                            <ImageUpload 
                                images={newImages} 
                                setImages={setNewImages} 
                                previews={previews} 
                                setPreviews={setPreviews} 
                            />
                        </div>

                        <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                            <MapView 
                                selectedPos={selectedPos} 
                                onLocationSelect={setSelectedPos} 
                            />
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditJournal;
