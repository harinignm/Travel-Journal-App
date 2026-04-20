import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants';

const JournalCard = ({ journal }) => {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="glass-dark rounded-3xl overflow-hidden group border border-white/5 hover:border-gold/30 transition-all duration-500"
        >
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={`${BASE_URL}${journal.images[0]}`} 
                    alt={journal.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-teal">
                    {journal.mood}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors truncate">
                    {journal.title}
                </h3>
                
                <div className="space-y-2 mb-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-teal" />
                        <span>{journal.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-teal" />
                        <span>{new Date(journal.date).toLocaleDateString()}</span>
                    </div>
                </div>

                <Link 
                    to={`/journal/${journal._id}`}
                    className="flex items-center justify-between text-sm font-bold text-gray-300 group-hover:text-white"
                >
                    View Story
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-gold group-hover:text-navy transition-all">
                        <ArrowUpRight size={18} />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export default JournalCard;
