
import React, { useState } from 'react';
import { getStartingCivilizations } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';
import GlobeIcon from './icons/GlobeIcon';
import { Difficulty } from '../types';

interface SetupScreenProps {
  onStart: (country: string, year: number, difficulty: Difficulty) => void;
  isLoading: boolean;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [step, setStep] = useState<'difficulty' | 'year' | 'civilization'>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [year, setYear] = useState<string>('');
  const [civilizations, setCivilizations] = useState<string[]>([]);
  const [isFetchingCivs, setIsFetchingCivs] = useState<boolean>(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setStep('year');
  };

  const handleYearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(year);
    if (!year || isNaN(yearNum)) {
      setInternalError("Please enter a valid year.");
      return;
    }
    
    setIsFetchingCivs(true);
    setInternalError(null);
    try {
      const civs = await getStartingCivilizations(yearNum);
      if (civs && civs.length > 0) {
        setCivilizations(civs);
        setStep('civilization');
      } else {
        setInternalError(`No major civilizations could be identified for the year ${year}. Please try a different era.`);
      }
    } catch (e) {
      console.error(e);
      setInternalError("The annuls of history are unclear. Failed to fetch civilizations for that year. Please try again.");
    } finally {
      setIsFetchingCivs(false);
    }
  };

  const handleCivSelection = (civ: string) => {
    if (!difficulty) return;
    onStart(civ, parseInt(year), difficulty);
  };

  const resetToDifficulty = () => {
    setStep('difficulty');
    setDifficulty(null);
    setYear('');
    setCivilizations([]);
    setInternalError(null);
  };
  
  const resetToYear = () => {
    setStep('year');
    setCivilizations([]);
    setInternalError(null);
  }

  const renderDifficultyStep = () => (
    <Card className="w-full max-w-2xl">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
           <GlobeIcon className="w-12 h-12 text-cyan-400"/>
           <h1 className="text-4xl font-bold font-orbitron text-white">World Domination</h1>
        </div>
        <p className="text-gray-400 mb-8">Choose your challenge level to begin.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={() => handleDifficultySelect('easy')} className="bg-green-600 hover:bg-green-700">Easy</Button>
          <Button onClick={() => handleDifficultySelect('medium')} className="bg-yellow-600 hover:bg-yellow-700">Medium</Button>
          <Button onClick={() => handleDifficultySelect('hard')} className="bg-red-600 hover:bg-red-700">Hard</Button>
          <Button onClick={() => handleDifficultySelect('realistic')} className="bg-purple-600 hover:bg-purple-700">Realistic</Button>
      </div>
       <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
            <p><span className="font-bold text-gray-400">Easy:</span> A forgiving world for aspiring rulers.</p>
            <p><span className="font-bold text-gray-400">Medium:</span> A balanced challenge of risk and reward.</p>
            <p><span className="font-bold text-gray-400">Hard:</span> The world is cruel and unforgiving.</p>
            <p><span className="font-bold text-gray-400">Realistic:</span> Complex, unpredictable, and historically plausible.</p>
        </div>
    </Card>
  );

  const renderYearStep = () => (
    <Card className="w-full max-w-2xl">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
           <GlobeIcon className="w-12 h-12 text-cyan-400"/>
           <h1 className="text-4xl font-bold font-orbitron text-white">Choose Your Era</h1>
        </div>
        <p className="text-gray-400 mb-8">You have chosen <span className="font-bold capitalize text-cyan-400">{difficulty}</span> difficulty. Now, select a year.</p>
      </div>
      
      {internalError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-6 text-center">
              {internalError}
              <button
                  onClick={() => setInternalError(null)}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 underline"
              >
                  Try Again
              </button>
          </div>
      )}
      {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-6 text-center">
                {error}
            </div>
        )}

      <form onSubmit={handleYearSubmit}>
        <div className="mb-6">
          <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
            Enter Starting Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={isFetchingCivs}
            placeholder="e.g., 1206 or -550 for BC"
            className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
          />
        </div>
        
        <Button type="submit" disabled={isFetchingCivs} className="w-full">
          {isFetchingCivs ? 'Consulting Oracles...' : 'Find Civilizations'}
        </Button>
      </form>
       <button onClick={resetToDifficulty} disabled={isFetchingCivs} className="text-cyan-400 hover:text-cyan-300 w-full text-center mt-4 disabled:opacity-50">
          &larr; Choose a different difficulty
      </button>
    </Card>
  );

  const renderCivilizationStep = () => (
    <Card className="w-full max-w-2xl">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
           <GlobeIcon className="w-12 h-12 text-cyan-400"/>
           <h1 className="text-4xl font-bold font-orbitron text-white">Select Your Origin</h1>
        </div>
        <p className="text-gray-400 mb-8">
            The year is <span className="font-bold text-cyan-400">{parseInt(year) > 0 ? year : `${-parseInt(year)} BC`}</span> on <span className="font-bold capitalize text-cyan-400">{difficulty}</span> difficulty. These powers shape the world. Which will you lead?
        </p>
      </div>
      
      {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-6 text-center">
                {error}
            </div>
        )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        {civilizations.map(civ => (
          <Button key={civ} onClick={() => handleCivSelection(civ)} disabled={isLoading}>
            {isLoading ? 'Forging History...' : `Lead the ${civ}`}
          </Button>
        ))}
      </div>
      
      <button onClick={resetToYear} disabled={isLoading} className="text-cyan-400 hover:text-cyan-300 w-full text-center mt-4 disabled:opacity-50">
          &larr; Choose a different year
      </button>
    </Card>
  );
  
  const renderStep = () => {
      switch(step) {
          case 'difficulty':
              return renderDifficultyStep();
          case 'year':
              return renderYearStep();
          case 'civilization':
              return renderCivilizationStep();
          default:
              return renderDifficultyStep();
      }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      {renderStep()}
    </div>
  );
};

export default SetupScreen;
