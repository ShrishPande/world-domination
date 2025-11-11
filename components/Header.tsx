
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GameScreen } from '../types';

interface HeaderProps {
    onNavigate: (screen: GameScreen) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="w-full max-w-7xl mx-auto py-3 px-4 mb-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl flex justify-between items-center">
      <div>
        <span className="text-gray-400">Ruler: </span>
        <span className="font-bold font-orbitron text-cyan-400">{currentUser?.username}</span>
      </div>
      <nav className="flex items-center gap-4">
        <button onClick={() => onNavigate(GameScreen.Dashboard)} className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
        <button onClick={() => onNavigate(GameScreen.Leaderboard)} className="text-gray-300 hover:text-white transition-colors">Leaderboard</button>
        <button 
            onClick={logout} 
            className="bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
        >
            Abdicate
        </button>
      </nav>
    </header>
  );
};

export default Header;
