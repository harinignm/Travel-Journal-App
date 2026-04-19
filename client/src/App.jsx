import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateJournal from './pages/CreateJournal';
import EditJournal from './pages/EditJournal';
import JournalDetail from './pages/JournalDetail';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-navy text-gray-100">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/create" 
                            element={
                                <ProtectedRoute>
                                    <CreateJournal />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/journal/:id" 
                            element={
                                <ProtectedRoute>
                                    <JournalDetail />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/edit/:id" 
                            element={
                                <ProtectedRoute>
                                    <EditJournal />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                    <Toaster 
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: '#161d31',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                            },
                        }}
                    />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
