import React, { useState } from 'react';
import { getStartingCivilizations } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';
import GlobeIcon from './icons/GlobeIcon';

interface SetupScreenProps {
  onStart: (country: string, year: number) => void;
  isLoading: boolean;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [step, setStep] = useState<'year' | 'civilization'>('year');
  const [year, setYear] = useState<string>('');
  const [civilizations, setCivilizations] = useState<string[]>([]);
  const [isFetchingCivs, setIsFetchingCivs] = useState<boolean>(false);
  const [internalError, setInternalError] = useState<string | null>(null);

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
    onStart(civ, parseInt(year));
  };

  const reset = () => {
    setStep('year');
    setCivilizations([]);
    setInternalError(null);
  };

  const renderYearStep = () => (
    <Card className="w-full max-w-2xl">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
           <GlobeIcon className="w-12 h-12 text-cyan-400"/>
           <h1 className="text-4xl font-bold font-orbitron text-white">World Domination</h1>
        </div>
        <p className="text-gray-400 mb-8">Choose a year and forge your empire.</p>
      </div>
      
      {internalError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-6 text-center">
              {internalError}
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
            The year is <span className="font-bold text-cyan-400">{parseInt(year) > 0 ? year : `${-parseInt(year)} BC`}</span>. These powers shape the world. Which will you lead?
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
      
      <button onClick={reset} disabled={isLoading} className="text-cyan-400 hover:text-cyan-300 w-full text-center mt-4 disabled:opacity-50">
          &larr; Choose a different year
      </button>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      {step === 'year' ? renderYearStep() : renderCivilizationStep()}
    </div>
  );
};

export default SetupScreen;
