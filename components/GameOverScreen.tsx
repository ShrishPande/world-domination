
import React from 'react';
import { ScoreDetails, GameState } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { WORLD_REGIONS } from '../constants';

interface GameOverScreenProps {
  scoreDetails: ScoreDetails;
  finalState: GameState;
  onPlayAgain: () => void;
  onNavigateToDashboard: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ scoreDetails, finalState, onPlayAgain, onNavigateToDashboard }) => {
  const territoriesConquered = finalState.territories.length;
  const worldPercentage = ((territoriesConquered / WORLD_REGIONS.length) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      <Card className="w-full max-w-3xl text-center">
        <h1 className="text-5xl font-bold font-orbitron text-cyan-400 mb-2">The End of an Era</h1>
        <p className="text-2xl font-semibold text-white mb-4">Your legacy as "{scoreDetails.title}" is written.</p>
        <p className="text-green-400">Your final score has been recorded in the annals of history.</p>
        
        <div className="my-8">
            <p className="text-lg text-gray-400">Final Score</p>
            <p className="text-7xl font-bold font-orbitron text-white tracking-widest">{scoreDetails.score.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-left mb-8">
            <h3 className="text-xl font-orbitron text-white mb-4">Historian's Analysis</h3>
            <p className="text-gray-300">{scoreDetails.analysis}</p>
        </div>

        <div className="text-left">
            <h3 className="text-xl font-orbitron text-white mb-4">Final Imperial Report: Year {finalState.year}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Territories</p>
                    <p className="text-2xl font-bold font-orbitron text-cyan-400">{territoriesConquered}/{WORLD_REGIONS.length}</p>
                    <p className="text-xs text-gray-500">({worldPercentage}%)</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-400">Population</p>
                    <p className="text-2xl font-bold font-orbitron text-white">{finalState.population}M</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-400">Military</p>
                    <p className="text-2xl font-bold font-orbitron text-white">{finalState.military}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-400">Economy</p>
                    <p className="text-2xl font-bold font-orbitron text-white">{finalState.economy}</p>
                </div>
            </div>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onNavigateToDashboard} className="w-full sm:w-auto">
            Return to Dashboard
          </Button>
          <Button onClick={onPlayAgain} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700">
            Forge a New Destiny
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameOverScreen;
