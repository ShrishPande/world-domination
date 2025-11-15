
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserScores } from '../services/dbService';
import { Score, GameScreen } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface DashboardScreenProps {
    onNavigate: (screen: GameScreen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getUserScores(currentUser.id)
        .then(setScores)
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  if (isLoading) {
    return <div className="text-center p-10">Consulting the royal scribes...</div>;
  }

  return (
    <div className="animate-fadeIn space-y-8 mt-8">
      <Card className="text-center">
        <h1 className="text-4xl font-bold font-orbitron text-white">Welcome back, {currentUser?.username}</h1>
        <p className="text-gray-400 mt-2">The world is ripe for conquest. Will you forge a new destiny today?</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <Button onClick={() => onNavigate(GameScreen.Setup)} className="flex-1">
              Launch New Campaign
          </Button>
          <Button onClick={() => onNavigate(GameScreen.Leaderboard)} className="flex-1 bg-gray-600 hover:bg-gray-700">
              View Leaderboard
          </Button>
          <Button onClick={() => onNavigate(GameScreen.Profile)} className="flex-1 bg-gray-600 hover:bg-gray-700">
              View Profile
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-3xl font-orbitron text-white mb-6">Campaign History</h2>
        {scores.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your history is yet to be written. Begin a new campaign to carve your name in the annals of time.</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {scores.map(score => (
              <div key={score.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold font-orbitron text-cyan-400">{score.title}</p>
                        <p className="text-sm text-gray-500">{new Date(score.date).toLocaleString()}</p>
                    </div>
                    <p className="text-3xl font-bold font-orbitron text-white">{score.score.toLocaleString()}</p>
                </div>
                <p className="mt-3 text-gray-300 italic">"{score.analysis}"</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardScreen;
