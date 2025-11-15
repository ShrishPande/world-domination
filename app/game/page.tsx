'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Choice } from '@/types';
import { processTurn, calculateScore } from '@/services/geminiService';
import { saveScore } from '@/services/dbService';
import GameScreen from '@/components/GameScreen';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';

export default function GamePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    gameState, setGameState,
    choices, setChoices,
    eventDescription, setEventDescription,
    eventSummary, setEventSummary,
    rivalCivilizations, setRivalCivilizations,
    intelligenceReports, setIntelligenceReports,
    activeMissions, setActiveMissions,
    worldTerritories, setWorldTerritories,
    resources, setResources,
    tradeRoutes, setTradeRoutes,
    activePolicies, setActivePolicies,
    availablePolicies, setAvailablePolicies,
    mitigationTools, setMitigationTools,
    difficulty,
    setScoreDetails
  } = useGame();
  const { currentUser } = useAuth();

  const handleSelectChoice = useCallback(async (choice: Choice) => {
    if (!gameState || !difficulty) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextState = await processTurn(gameState, choice, difficulty);
      setGameState(nextState.gameState);
      setChoices(nextState.choices);
      setEventDescription(nextState.description);
      setEventSummary(nextState.summary);
      setRivalCivilizations(nextState.gameState.rivalCivilizations);
      setIntelligenceReports(nextState.gameState.intelligenceReports);
      setActiveMissions(nextState.gameState.activeMissions);
      setWorldTerritories(nextState.gameState.worldTerritories);
      setResources(nextState.gameState.resources);
      setTradeRoutes(nextState.gameState.tradeRoutes);
      setActivePolicies(nextState.gameState.activePolicies);
      setAvailablePolicies(nextState.gameState.availablePolicies);
      setMitigationTools(nextState.gameState.mitigationTools);
    } catch (e) {
      setError('An unexpected event occurred! Your strategists are confused. Please make another choice.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, difficulty, setGameState, setChoices, setEventDescription]);

  const handleTimeUp = useCallback(async () => {
    if (!gameState || !currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const finalScore = await calculateScore(gameState);
      const newScore = {
        userId: currentUser.id,
        score: finalScore.score,
        title: finalScore.title,
        analysis: finalScore.analysis,
        finalState: gameState,
        date: new Date().toISOString(),
      };
      await saveScore(newScore);
      setScoreDetails(finalScore);
      router.push('/game-over');
    } catch (e) {
      setError('Failed to calculate final score. Your legacy is too vast to measure! Please try playing again.');
      console.error(e);
      setScoreDetails({ score: 0, title: "An Enigma", analysis: "The historians couldn't calculate your score due to a cosmic anomaly. Your reign remains a mystery." });
      router.push('/game-over');
    } finally {
      setIsLoading(false);
    }
  }, [gameState, currentUser, router, setScoreDetails]);

  return gameState && (
    <GameScreen
      gameState={gameState}
      choices={choices}
      description={eventDescription}
      summary={eventSummary}
      rivalCivilizations={rivalCivilizations}
      onSelectChoice={handleSelectChoice}
      onTimeUp={handleTimeUp}
      isLoading={isLoading}
      error={error}
    />
  );
}
