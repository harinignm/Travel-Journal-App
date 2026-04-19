import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, PlusCircle, Map as MapIcon, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
            <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <Compass className="text-gold group-hover:rotate-45 transition-transform duration-500" size={28} />
                    <span className="text-2xl font-serif font-bold tracking-tight bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
                        Wanderlust
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link flex items-center gap-2 hover:text-gold transition-colors">
                                <MapIcon size={20} />
                                <span className="hidden sm:inline">Journals</span>
                            </Link>
                            <Link to="/create" className="nav-link flex items-center gap-2 hover:text-gold transition-colors">
                                <PlusCircle size={20} />
                                <span className="hidden sm:inline">New Entry</span>
                            </Link>
                            <div className="h-6 w-px bg-white/20"></div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-300 hidden md:inline">
                                    Hello, {user.name.split(' ')[0]}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-gold transition-colors">Login</Link>
                            <Link to="/register" className="btn-primary py-2 px-4 text-sm">Join Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
