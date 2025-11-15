'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, Choice, Difficulty, ScoreDetails, RivalCivilization, IntelligenceReport, EspionageMission, TerritoryInfo } from '@/types';

interface GameContextType {
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;
  choices: Choice[];
  setChoices: (choices: Choice[]) => void;
  eventDescription: string;
  setEventDescription: (description: string) => void;
  eventSummary: string[];
  setEventSummary: (summary: string[]) => void;
  rivalCivilizations: RivalCivilization[];
  setRivalCivilizations: (rivals: RivalCivilization[]) => void;
  intelligenceReports: IntelligenceReport[];
  setIntelligenceReports: (reports: IntelligenceReport[]) => void;
  activeMissions: EspionageMission[];
  setActiveMissions: (missions: EspionageMission[]) => void;
  worldTerritories: TerritoryInfo[];
  setWorldTerritories: (territories: TerritoryInfo[]) => void;
  difficulty: Difficulty | null;
  setDifficulty: (difficulty: Difficulty | null) => void;
  scoreDetails: ScoreDetails | null;
  setScoreDetails: (details: ScoreDetails | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventSummary, setEventSummary] = useState<string[]>([]);
  const [rivalCivilizations, setRivalCivilizations] = useState<RivalCivilization[]>([]);
  const [intelligenceReports, setIntelligenceReports] = useState<IntelligenceReport[]>([]);
  const [activeMissions, setActiveMissions] = useState<EspionageMission[]>([]);
  const [worldTerritories, setWorldTerritories] = useState<TerritoryInfo[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);

  return (
    <GameContext.Provider value={{
      gameState, setGameState,
      choices, setChoices,
      eventDescription, setEventDescription,
      eventSummary, setEventSummary,
      rivalCivilizations, setRivalCivilizations,
      intelligenceReports, setIntelligenceReports,
      activeMissions, setActiveMissions,
      worldTerritories, setWorldTerritories,
      difficulty, setDifficulty,
      scoreDetails, setScoreDetails
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
