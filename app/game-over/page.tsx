'use client';

import { useRouter } from 'next/navigation';
import GameOverScreen from '@/components/GameOverScreen';
import { useGame } from '@/contexts/GameContext';

export default function GameOverPage() {
  const router = useRouter();
  const { scoreDetails, gameState, setGameState, setChoices, setEventDescription, setEventSummary, setDifficulty, setScoreDetails } = useGame();

  const handlePlayAgain = () => {
    setGameState(null);
    setChoices([]);
    setEventDescription('');
    setEventSummary([]);
    setDifficulty(null);
    setScoreDetails(null);
    router.push('/setup');
  };

  const handleNavigateToDashboard = () => {
    setGameState(null);
    setChoices([]);
    setEventDescription('');
    setEventSummary([]);
    setDifficulty(null);
    setScoreDetails(null);
    router.push('/dashboard');
  };

  return scoreDetails && gameState && (
    <GameOverScreen
      scoreDetails={scoreDetails}
      finalState={gameState}
      onPlayAgain={handlePlayAgain}
      onNavigateToDashboard={handleNavigateToDashboard}
    />
  );
}
