import React from 'react';
import { GameState, Choice, ChoiceType, RivalCivilization } from '../types';
import { WORLD_REGIONS, AI_PERSONALITIES } from '../constants';
import Timer from './Timer';
import Button from './ui/Button';
import Card from './ui/Card';
import PopulationIcon from './icons/PopulationIcon';
import MilitaryIcon from './icons/MilitaryIcon';
import EconomyIcon from './icons/EconomyIcon';
import TechIcon from './icons/TechIcon';
import GlobeIcon from './icons/GlobeIcon';
import FoodIcon from './icons/FoodIcon';
import IronIcon from './icons/IronIcon';
import GoldIcon from './icons/GoldIcon';
import KnowledgeIcon from './icons/KnowledgeIcon';
import WorldMap from './WorldMap';

interface GameScreenProps {
  gameState: GameState;
  choices: Choice[];
  description: string;
  summary: string[];
  rivalCivilizations: RivalCivilization[];
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

const GameScreen: React.FC<GameScreenProps> = ({ gameState, choices, description, summary, rivalCivilizations, onSelectChoice, onTimeUp, isLoading, error }) => {

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
            <div className="mt-6">
                <h3 className="text-lg font-orbitron text-white mb-4">Resources</h3>
                <div className="grid grid-cols-2 gap-4">
                    <StatDisplay icon={<FoodIcon />} label="Food" value={gameState.resources?.food || 0} />
                    <StatDisplay icon={<IronIcon />} label="Iron" value={gameState.resources?.iron || 0} />
                    <StatDisplay icon={<GoldIcon />} label="Gold" value={gameState.resources?.gold || 0} />
                    <StatDisplay icon={<KnowledgeIcon />} label="Knowledge" value={gameState.resources?.knowledge || 0} />
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center gap-3 mb-4">
              <GlobeIcon className="w-6 h-6"/>
              <h3 className="text-xl font-orbitron text-white">World Map</h3>
            </div>
            <div className="space-y-2 mb-4">
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-cyan-500 h-4 rounded-full transition-all duration-500" style={{ width: `${worldPercentage}%` }}></div>
                </div>
                <p className="text-center text-gray-300">{territoriesConquered} of {WORLD_REGIONS.length} Regions ({worldPercentage}%)</p>
            </div>
              <div className="relative p-2 bg-gray-900/50 rounded-md overflow-hidden border border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-cyan-900/20 animate-subtle-pan"></div>
              <WorldMap controlledTerritories={gameState.territories} />
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-orbitron text-white mb-4">Rival Civilizations</h3>
            <div className="space-y-3">
                {rivalCivilizations.map((rival) => (
                    <div key={rival.name} className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-cyan-300">{rival.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                rival.diplomacyStatus === 'allied' ? 'bg-green-900/50 text-green-300' :
                                rival.diplomacyStatus === 'friendly' ? 'bg-blue-900/50 text-blue-300' :
                                rival.diplomacyStatus === 'neutral' ? 'bg-gray-900/50 text-gray-300' :
                                'bg-red-900/50 text-red-300'
                            }`}>
                                {rival.diplomacyStatus.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{AI_PERSONALITIES[rival.personality]?.description || 'Unknown personality'}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                                <div className="font-bold text-red-400">{rival.military}</div>
                                <div className="text-gray-500">Military</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-green-400">{rival.economy}</div>
                                <div className="text-gray-500">Economy</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-purple-400">{rival.technology}</div>
                                <div className="text-gray-500">Tech</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Last activity: {rival.lastKnownActivity}</p>
                    </div>
                ))}
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-orbitron text-white mb-4">Trade Routes</h3>
            <div className="space-y-3">
                {gameState.tradeRoutes.length === 0 ? (
                    <p className="text-gray-400">No active trade routes</p>
                ) : (
                    gameState.tradeRoutes.map((route) => (
                        <div key={route.id} className={`bg-gray-900/50 p-3 rounded-md border ${route.status === 'active' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-cyan-300">{route.connectedTerritories.join(' ↔ ')}</h4>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${route.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                    {route.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <div className="font-bold text-green-400">+{route.passiveIncome}</div>
                                    <div className="text-gray-500">Income</div>
                                </div>
                                <div>
                                    <div className="font-bold text-blue-400">+{route.diplomacyBoost}</div>
                                    <div className="text-gray-500">Diplomacy</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Vulnerability: {route.vulnerability}%</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-orbitron text-white mb-4">Active Policies</h3>
            <div className="space-y-3">
                {gameState.activePolicies.length === 0 ? (
                    <p className="text-gray-400">No active policies</p>
                ) : (
                    gameState.activePolicies.map((policy) => (
                        <div key={policy.id} className="bg-gray-900/50 p-3 rounded-md border border-purple-500/50">
                            <h4 className="font-bold text-purple-300">{policy.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">{policy.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                {policy.effects.military && <div>Military: {policy.effects.military > 0 ? '+' : ''}{policy.effects.military}</div>}
                                {policy.effects.economy && <div>Economy: {policy.effects.economy > 0 ? '+' : ''}{policy.effects.economy}</div>}
                                {policy.effects.technology && <div>Tech: {policy.effects.technology > 0 ? '+' : ''}{policy.effects.technology}</div>}
                                {policy.effects.diplomacy && <div>Diplomacy: {policy.effects.diplomacy > 0 ? '+' : ''}{policy.effects.diplomacy}</div>}
                            </div>
                        </div>
                    ))
                )}
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
            {summary && (
                <div className="mb-4 p-3 bg-cyan-900/30 border border-cyan-500/50 rounded-md">
                    <h3 className="text-lg font-orbitron text-cyan-300 mb-2">Key Highlights</h3>
                    <ul className="text-gray-200 text-sm leading-relaxed space-y-1">
                        {summary.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-cyan-400 mr-2">•</span>
                                <span className="font-bold">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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
                        {choice.stabilityRange && (
                            <div className="text-xs text-gray-300 mt-2">
                                Stability: {choice.stabilityRange.min}-{choice.stabilityRange.max}
                            </div>
                        )}
                        {choice.mitigationTools && choice.mitigationTools.length > 0 && (
                            <div className="text-xs text-yellow-300 mt-1">
                                Mitigation available
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default GameScreen;