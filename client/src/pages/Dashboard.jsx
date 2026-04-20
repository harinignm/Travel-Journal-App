import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Plus, Loader2, Sparkles, Globe } from 'lucide-react';
import api from '../api/api';
import JournalCard from '../components/JournalCard';
import { toast } from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants';

const quotes = [
    "The world is a book and those who do not travel read only one page.",
    "Travel is the only thing you buy that makes you richer.",
    "Not all those who wander are lost.",
    "Adventure is worthwhile.",
    "To travel is to live."
];

const Dashboard = () => {
    const [journals, setJournals] = useState([]);
    const [filteredJournals, setFilteredJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [moodFilter, setMoodFilter] = useState('');
    const [currentQuote, setCurrentQuote] = useState(0);
    const [memoryOfDay, setMemoryOfDay] = useState(null);

    useEffect(() => {
        fetchJournals();
        const quoteInterval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 8000);
        return () => clearInterval(quoteInterval);
    }, []);

    useEffect(() => {
        const filtered = journals.filter(j => 
            (j.title.toLowerCase().includes(search.toLowerCase()) || 
             j.location.toLowerCase().includes(search.toLowerCase())) &&
            (moodFilter === '' || j.mood === moodFilter)
        );
        setFilteredJournals(filtered);
    }, [search, moodFilter, journals]);

    const fetchJournals = async () => {
        try {
            const res = await api.get('/journals');
            setJournals(res.data);
            if (res.data.length > 0) {
                setMemoryOfDay(res.data[Math.floor(Math.random() * res.data.length)]);
            }
        } catch (err) {
            toast.error("Failed to load journals");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-gold font-medium mb-4"
                        >
                            <Sparkles size={20} />
                            <span>Memory of the Day</span>
                        </motion.div>
                        
                        <div className="h-24">
                            <AnimatePresence mode='wait'>
                                <motion.h1
                                    key={currentQuote}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-4xl md:text-5xl font-serif italic text-gray-200"
                                >
                                    "{quotes[currentQuote]}"
                                </motion.h1>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="glass px-6 py-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-3xl font-bold text-teal">{journals.length}</p>
                            <p className="text-sm text-gray-400">Journals</p>
                        </div>
                        <div className="glass px-6 py-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-3xl font-bold text-gold">
                                {[...new Set(journals.map(j => j.location))].length}
                            </p>
                            <p className="text-sm text-gray-400">Places</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memory of the Day Card */}
            {memoryOfDay && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 glass-dark rounded-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-80"
                >
                    <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                        <img 
                            src={`${BASE_URL}${memoryOfDay.images[0]}`} 
                            alt={memoryOfDay.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent"></div>
                    </div>
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <span className="text-teal font-medium mb-2">{memoryOfDay.mood}</span>
                        <h2 className="text-3xl font-bold mb-4">{memoryOfDay.title}</h2>
                        <div className="flex items-center gap-4 text-gray-400 mb-6">
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                {memoryOfDay.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                {new Date(memoryOfDay.date).toLocaleDateString()}
                            </div>
                        </div>
                        <Link 
                            to={`/journal/${memoryOfDay._id}`}
                            className="btn-primary w-fit flex items-center gap-2"
                        >
                            Relive this moment <Plus size={18} />
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        type="text"
                        placeholder="Search places or titles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <select 
                            className="input-field pl-12 appearance-none"
                            value={moodFilter}
                            onChange={(e) => setMoodFilter(e.target.value)}
                        >
                            <option value="">All Moods</option>
                            <option value="Excited">Excited</option>
                            <option value="Peaceful">Peaceful</option>
                            <option value="Adventurous">Adventurous</option>
                            <option value="Nostalgic">Nostalgic</option>
                        </select>
                    </div>
                    <Link to="/create" className="btn-secondary flex items-center gap-2">
                        <Plus size={20} /> <span>New</span>
                    </Link>
                </div>
            </div>

            {/* Journal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                ) : filteredJournals.length > 0 ? (
                    filteredJournals.map((journal) => (
                        <JournalCard key={journal._id} journal={journal} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <Globe className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-2xl font-bold mb-2">No journals found</h3>
                        <p className="text-gray-400">Time to embark on a new adventure!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
