import React from 'react';
import { GameState, Choice, ChoiceType } from '../types';
import { WORLD_REGIONS } from '../constants';
import Timer from './Timer';
import Button from './ui/Button';
import Card from './ui/Card';
import PopulationIcon from './icons/PopulationIcon';
import MilitaryIcon from './icons/MilitaryIcon';
import EconomyIcon from './icons/EconomyIcon';
import TechIcon from './icons/TechIcon';
import GlobeIcon from './icons/GlobeIcon';

interface GameScreenProps {
  gameState: GameState;
  choices: Choice[];
  description: string;
  onSelectChoice: (choice: Choice) => void;
  onTimeUp: () => void;
  isLoading: boolean;
  error: string | null;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg">
    <div className="text-cyan-400">{icon}</div>
    <div>
      <div className="text-xs text-gray-400 uppercase">{label}</div>
      <div className="text-lg font-bold font-orbitron text-white">{value}</div>
    </div>
  </div>
);

const getChoiceColor = (type: ChoiceType): string => {
    return 'bg-gray-500/80 hover:bg-gray-600/80 border-gray-400';
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, choices, description, onSelectChoice, onTimeUp, isLoading, error }) => {

  const territoriesConquered = gameState.territories.length;
  const worldPercentage = ((territoriesConquered / WORLD_REGIONS.length) * 100).toFixed(1);

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        {isLoading && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xl font-orbitron text-white">The wheels of history are turning...</p>
                </div>
            </div>
        )}

      {/* Left Panel: Stats and Map */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-orbitron text-white">Imperial Status</h2>
                <div className="text-3xl font-orbitron text-cyan-400">{gameState.year > 0 ? gameState.year : `${-gameState.year} BC`}</div>
            </div>
            <p className="text-gray-400 mb-6">An overview of your empire, {gameState.rulerTitle}.</p>
            <div className="grid grid-cols-2 gap-4">
                <StatDisplay icon={<PopulationIcon />} label="Population" value={`${gameState.population}M`} />
                <StatDisplay icon={<MilitaryIcon />} label="Military" value={gameState.military} />
                <StatDisplay icon={<EconomyIcon />} label="Economy" value={gameState.economy} />
                <StatDisplay icon={<TechIcon />} label="Technology" value={gameState.technology} />
            </div>
        </Card>
        <Card>
            <div className="flex items-center gap-3 mb-4">
              <GlobeIcon className="w-6 h-6"/>
              <h3 className="text-xl font-orbitron text-white">Conquered Territories</h3>
            </div>
            <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-cyan-500 h-4 rounded-full" style={{ width: `${worldPercentage}%` }}></div>
                </div>
                <p className="text-center text-gray-300">{worldPercentage}% of the world</p>
            </div>
            <div className="mt-4 max-h-40 overflow-y-auto p-2 bg-gray-900/50 rounded-md">
                <ul className="list-disc list-inside text-gray-300">
                    {gameState.territories.map(t => <li key={t}>{t}</li>)}
                </ul>
            </div>
        </Card>
      </div>

      {/* Right Panel: Event and Choices */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <Timer onTimeUp={onTimeUp} isPaused={isLoading} />
        </Card>
        <Card>
            <h2 className="text-2xl font-orbitron text-white mb-4">Strategic Update</h2>
            <div className="prose prose-invert prose-p:text-gray-300 min-h-[100px] bg-gray-900/50 p-4 rounded-md border border-gray-700">
              <p>{description}</p>
            </div>
        </Card>
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-center">
                {error}
            </div>
        )}
        <Card>
            <h2 className="text-2xl font-orbitron text-white mb-4">Your Next Move?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {choices.map((choice) => (
                    <button
                        key={choice.id}
                        onClick={() => onSelectChoice(choice)}
                        disabled={isLoading}
                        className={`p-4 text-left rounded-lg border-2 transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getChoiceColor(choice.type)}`}
                    >
                        <span className="font-bold uppercase text-xs tracking-wider opacity-80">{choice.type}</span>
                        <p className="text-white mt-1">{choice.text}</p>
                    </button>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default GameScreen;