import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="glass-dark rounded-3xl overflow-hidden animate-pulse">
            <div className="h-64 bg-white/5"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-white/5 rounded-md w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
                    <div className="h-4 bg-white/5 rounded-md w-1/3"></div>
                </div>
                <div className="h-10 bg-white/5 rounded-xl w-full"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
