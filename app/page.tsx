'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameScreen as GameScreenEnum, GameState, Choice, ScoreDetails, Difficulty, Score } from '@/types';
import { initializeGame, processTurn, calculateScore } from '@/services/geminiService';
import { saveScore } from '@/services/dbService';
import { useAuth } from '@/contexts/AuthContext';
import SetupScreen from '@/components/SetupScreen';
import GameScreen from '@/components/GameScreen';
import GameOverScreen from '@/components/GameOverScreen';
import AuthScreen from '@/components/auth/AuthScreen';
import DashboardScreen from '@/components/DashboardScreen';
import LeaderboardScreen from '@/components/LeaderboardScreen';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return <DashboardScreen onNavigate={(screen) => router.push(`/${screen}`)} />;
}
