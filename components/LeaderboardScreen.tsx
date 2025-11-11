
import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/dbService';
import { LeaderboardEntry } from '../types';
import Card from './ui/Card';

const LeaderboardScreen: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(setLeaderboard)
            .finally(() => setIsLoading(false));
    }, []);

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-400 border-yellow-400';
        if (rank === 1) return 'text-gray-300 border-gray-400';
        if (rank === 2) return 'text-yellow-600 border-yellow-700';
        return 'text-gray-500 border-gray-600';
    };

    if (isLoading) {
        return <div className="text-center p-10">Compiling the chronicles of rulers...</div>;
    }

    return (
        <div className="animate-fadeIn mt-8">
            <Card className="w-full max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold font-orbitron text-white text-center mb-6">Pantheon of Conquerors</h1>
                
                {leaderboard.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No legends have been forged yet. Be the first to mark your name in history!</p>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                            <div key={index} className={`flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border-l-4 transition-all duration-300 hover:bg-gray-700/50 ${getRankColor(index)}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`text-2xl font-bold font-orbitron w-8 text-center ${getRankColor(index).split(' ')[0]}`}>{index + 1}</span>
                                    <div>
                                        <p className="text-xl font-bold text-white">{entry.username}</p>
                                        <p className="text-sm text-gray-400">Title: <span className="italic">"{entry.title}"</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold font-orbitron text-cyan-400">{entry.highScore.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Achieved {new Date(entry.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LeaderboardScreen;
