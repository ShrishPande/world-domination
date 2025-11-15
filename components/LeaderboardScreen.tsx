
import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/dbService';
import { LeaderboardResponse, LeaderboardEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';
import BackButton from './ui/BackButton';

const LeaderboardScreen: React.FC = () => {
    const { currentUser } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        loadLeaderboard();
    }, [currentPage]);

    const loadLeaderboard = async () => {
        setIsLoading(true);
        try {
            const data = await getLeaderboard(currentPage, limit, currentUser?.id);
            setLeaderboardData(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400 border-yellow-400';
        if (rank === 2) return 'text-gray-300 border-gray-400';
        if (rank === 3) return 'text-yellow-600 border-yellow-700';
        return 'text-gray-500 border-gray-600';
    };

    if (isLoading) {
        return <div className="text-center p-10">Compiling the chronicles of rulers...</div>;
    }

    if (!leaderboardData) {
        return <div className="text-center p-10">Failed to load leaderboard.</div>;
    }

    const { leaderboard, pagination, userRank } = leaderboardData;
    const startRank = (currentPage - 1) * limit + 1;

    return (
        <div className="animate-fadeIn mt-8">
            <div className="w-full max-w-4xl mx-auto mb-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold font-orbitron text-white text-center mb-6">Pantheon of Conquerors</h1>

                {/* User Rank Display */}
                {userRank && (
                    <div className="bg-cyan-900/30 border border-cyan-500/50 p-4 rounded-lg mb-6 text-center">
                        <p className="text-cyan-300 text-lg">Your Rank</p>
                        <p className="text-4xl font-bold font-orbitron text-cyan-400">#{userRank}</p>
                    </div>
                )}

                {leaderboard.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No legends have been forged yet. Be the first to mark your name in history!</p>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            {leaderboard.map((entry, index) => {
                                const rank = startRank + index;
                                return (
                                    <div key={entry.userId} className={`flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border-l-4 transition-all duration-300 hover:bg-gray-700/50 ${getRankColor(rank)}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-2xl font-bold font-orbitron w-8 text-center ${getRankColor(rank).split(' ')[0]}`}>{rank}</span>
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
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-4">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2"
                            >
                                Previous
                            </Button>
                            <span className="text-gray-300">
                                Page {currentPage} of {pagination.totalPages}
                            </span>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="px-4 py-2"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default LeaderboardScreen;
