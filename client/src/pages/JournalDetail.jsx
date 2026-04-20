import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../api/api';
import { MapPin, Calendar, Trash2, Edit2, ChevronLeft, Maximize2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MapView from '../components/MapView';
import { BASE_URL } from '../constants';

const JournalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const res = await api.get(`/journals/${id}`);
                setJournal(res.data);
            } catch (err) {
                toast.error("Failed to load journal");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchJournal();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this memory?")) return;
        try {
            await api.delete(`/journals/${id}`);
            toast.success("Memory removed");
            navigate('/dashboard');
        } catch (err) {
            toast.error("Failed to delete journal");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Edit2 className="text-gold" size={40} />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-navy relative">
            {/* Parallax Header */}
            <div className="h-[70vh] relative overflow-hidden">
                <motion.div style={{ y: y1 }} className="absolute inset-0">
                    <img 
                        src={`${BASE_URL}${journal.images[0]}`} 
                        alt={journal.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/60 to-navy"></div>
                </motion.div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="px-4 py-1 glass rounded-full text-gold font-bold mb-6 inline-block">
                            {journal.mood}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">{journal.title}</h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-lg text-gray-300">
                            <div className="flex items-center gap-2">
                                <MapPin size={20} className="text-teal" />
                                {journal.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={20} className="text-teal" />
                                {new Date(journal.date).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-32 left-8 p-3 glass rounded-full hover:bg-white/20 transition-colors z-10"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Story Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="glass-dark p-10 rounded-3xl">
                            <p className="text-xl leading-relaxed text-gray-300 first-letter:text-5xl first-letter:font-serif first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                                {journal.description}
                            </p>
                        </div>

                        {/* Gallery */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <Maximize2 size={24} className="text-gold" /> Visual Journey
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {journal.images.map((img, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedImg(`${BASE_URL}${img}`)}
                                        className="rounded-2xl overflow-hidden cursor-pointer h-64 shadow-xl"
                                    >
                                        <img 
                                            src={`${BASE_URL}${img}`} 
                                            alt={`Gallery ${idx}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Map View */}
                        <div className="glass-dark p-6 rounded-3xl space-y-4">
                            <h4 className="font-bold text-lg">Location</h4>
                            <div className="h-64 rounded-2xl overflow-hidden">
                                <MapView 
                                    journals={[journal]} 
                                    selectedPos={journal.coordinates} 
                                    zoom={10} 
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="glass-dark p-6 rounded-3xl flex gap-4">
                            <button 
                                onClick={handleDelete}
                                className="flex-1 py-3 px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                            <button 
                                onClick={() => navigate(`/edit/${journal._id}`)}
                                className="flex-1 py-3 px-4 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Edit2 size={18} /> Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImg && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-10 backdrop-blur-xl"
                    onClick={() => setSelectedImg(null)}
                >
                    <button className="absolute top-10 right-10 text-white hover:text-gold">
                        <X size={40} />
                    </button>
                    <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={selectedImg} 
                        alt="Full view" 
                        className="max-w-full max-h-full rounded-xl shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default JournalDetail;
