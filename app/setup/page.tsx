'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Difficulty } from '@/types';
import { initializeGame } from '@/services/geminiService';
import SetupScreen from '@/components/SetupScreen';
import { useGame } from '@/contexts/GameContext';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setGameState, setChoices, setEventDescription, setEventSummary, setRivalCivilizations, setIntelligenceReports, setActiveMissions, setWorldTerritories, setDifficulty } = useGame();

  const handleStartGame = useCallback(async (country: string, year: number, difficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      setDifficulty(difficulty);
      const initialState = await initializeGame(country, year, difficulty);
      setGameState(initialState.gameState);
      setChoices(initialState.choices);
      setEventDescription(initialState.description);
      setEventSummary(initialState.summary);
      setRivalCivilizations(initialState.gameState.rivalCivilizations);
      setIntelligenceReports(initialState.gameState.intelligenceReports);
      setActiveMissions(initialState.gameState.activeMissions);
      setWorldTerritories(initialState.gameState.worldTerritories);
      router.push('/game');
    } catch (e) {
      setError('Failed to start the game. The AI strategist might be on a coffee break. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [router, setDifficulty, setGameState, setChoices, setEventDescription]);

  return <SetupScreen onStart={handleStartGame} isLoading={isLoading} error={error} />;
}
