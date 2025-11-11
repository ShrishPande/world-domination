
import React, { useState, useCallback, useEffect } from 'react';
import { GameScreen as GameScreenEnum, GameState, Choice, ScoreDetails, Difficulty } from './types';
import { initializeGame, processTurn, calculateScore } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { GAME_DURATION } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreenEnum>(GameScreenEnum.Setup);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (country: string, year: number, difficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      setDifficulty(difficulty);
      const initialState = await initializeGame(country, year, difficulty);
      setGameState(initialState.gameState);
      setChoices(initialState.choices);
      setEventDescription(initialState.description);
      setCurrentScreen(GameScreenEnum.Playing);
    } catch (e) {
      setError('Failed to start the game. The AI strategist might be on a coffee break. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectChoice = useCallback(async (choice: Choice) => {
    if (!gameState || !difficulty) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextState = await processTurn(gameState, choice, difficulty);
      setGameState(nextState.gameState);
      setChoices(nextState.choices);
      setEventDescription(nextState.description);
    } catch (e) {
      setError('An unexpected event occurred! Your strategists are confused. Please make another choice.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, difficulty]);
  
  const handleTimeUp = useCallback(async () => {
    if (!gameState) return;
    setIsLoading(true);
    setError(null);
    try {
      const finalScore = await calculateScore(gameState);
      setScoreDetails(finalScore);
      setCurrentScreen(GameScreenEnum.GameOver);
    } catch (e) {
      setError('Failed to calculate final score. Your legacy is too vast to measure! Please try playing again.');
      console.error(e);
      // Fallback score
      setScoreDetails({ score: 0, title: "An Enigma", analysis: "The historians couldn't calculate your score due to a cosmic anomaly. Your reign remains a mystery." });
      setCurrentScreen(GameScreenEnum.GameOver);
    } finally {
      setIsLoading(false);
    }
  }, [gameState]);

  const handlePlayAgain = () => {
    setGameState(null);
    setDifficulty(null);
    setChoices([]);
    setEventDescription('');
    setScoreDetails(null);
    setError(null);
    setCurrentScreen(GameScreenEnum.Setup);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreenEnum.Setup:
        return <SetupScreen onStart={handleStartGame} isLoading={isLoading} error={error} />;
      case GameScreenEnum.Playing:
        return gameState && (
          <GameScreen
            gameState={gameState}
            choices={choices}
            description={eventDescription}
            onSelectChoice={handleSelectChoice}
            onTimeUp={handleTimeUp}
            isLoading={isLoading}
            error={error}
          />
        );
      case GameScreenEnum.GameOver:
        return scoreDetails && gameState && (
          <GameOverScreen
            scoreDetails={scoreDetails}
            finalState={gameState}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return <SetupScreen onStart={handleStartGame} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
