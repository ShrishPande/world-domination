'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Choice, Difficulty, ScoreDetails, RivalCivilization, IntelligenceReport, EspionageMission, TerritoryInfo, Resources, TradeRoute, Policy, MitigationTool, GameMode } from '@/types';

interface GameStateData {
  gameState: GameState | null;
  choices: Choice[];
  eventDescription: string;
  eventSummary: string[];
  rivalCivilizations: RivalCivilization[];
  intelligenceReports: IntelligenceReport[];
  activeMissions: EspionageMission[];
  worldTerritories: TerritoryInfo[];
  difficulty: Difficulty | null;
  scoreDetails: ScoreDetails | null;
  resources: Resources | null;
  tradeRoutes: TradeRoute[];
  activePolicies: Policy[];
  availablePolicies: Policy[];
  mitigationTools: MitigationTool[];
  gameMode: GameMode;
}

type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState | null }
  | { type: 'SET_CHOICES'; payload: Choice[] }
  | { type: 'SET_EVENT_DESCRIPTION'; payload: string }
  | { type: 'SET_EVENT_SUMMARY'; payload: string[] }
  | { type: 'SET_RIVAL_CIVILIZATIONS'; payload: RivalCivilization[] }
  | { type: 'SET_INTELLIGENCE_REPORTS'; payload: IntelligenceReport[] }
  | { type: 'SET_ACTIVE_MISSIONS'; payload: EspionageMission[] }
  | { type: 'SET_WORLD_TERRITORIES'; payload: TerritoryInfo[] }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty | null }
  | { type: 'SET_SCORE_DETAILS'; payload: ScoreDetails | null }
  | { type: 'SET_RESOURCES'; payload: Resources | null }
  | { type: 'SET_TRADE_ROUTES'; payload: TradeRoute[] }
  | { type: 'SET_ACTIVE_POLICIES'; payload: Policy[] }
  | { type: 'SET_AVAILABLE_POLICIES'; payload: Policy[] }
  | { type: 'SET_MITIGATION_TOOLS'; payload: MitigationTool[] }
  | { type: 'SET_GAME_MODE'; payload: GameMode }
  | { type: 'RESET_GAME' };

const initialState: GameStateData = {
  gameState: null,
  choices: [],
  eventDescription: '',
  eventSummary: [],
  rivalCivilizations: [],
  intelligenceReports: [],
  activeMissions: [],
  worldTerritories: [],
  difficulty: null,
  scoreDetails: null,
  resources: null,
  tradeRoutes: [],
  activePolicies: [],
  availablePolicies: [],
  mitigationTools: [],
  gameMode: 'normal',
};

const gameReducer = (state: GameStateData, action: GameAction): GameStateData => {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_CHOICES':
      return { ...state, choices: action.payload };
    case 'SET_EVENT_DESCRIPTION':
      return { ...state, eventDescription: action.payload };
    case 'SET_EVENT_SUMMARY':
      return { ...state, eventSummary: action.payload };
    case 'SET_RIVAL_CIVILIZATIONS':
      return { ...state, rivalCivilizations: action.payload };
    case 'SET_INTELLIGENCE_REPORTS':
      return { ...state, intelligenceReports: action.payload };
    case 'SET_ACTIVE_MISSIONS':
      return { ...state, activeMissions: action.payload };
    case 'SET_WORLD_TERRITORIES':
      return { ...state, worldTerritories: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_SCORE_DETAILS':
      return { ...state, scoreDetails: action.payload };
    case 'SET_RESOURCES':
      return { ...state, resources: action.payload };
    case 'SET_TRADE_ROUTES':
      return { ...state, tradeRoutes: action.payload };
    case 'SET_ACTIVE_POLICIES':
      return { ...state, activePolicies: action.payload };
    case 'SET_AVAILABLE_POLICIES':
      return { ...state, availablePolicies: action.payload };
    case 'SET_MITIGATION_TOOLS':
      return { ...state, mitigationTools: action.payload };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'RESET_GAME':
      return { ...initialState };
    default:
      return state;
  }
};

interface GameContextType extends GameStateData {
  setGameState: (state: GameState | null) => void;
  setChoices: (choices: Choice[]) => void;
  setEventDescription: (description: string) => void;
  setEventSummary: (summary: string[]) => void;
  setRivalCivilizations: (rivals: RivalCivilization[]) => void;
  setIntelligenceReports: (reports: IntelligenceReport[]) => void;
  setActiveMissions: (missions: EspionageMission[]) => void;
  setWorldTerritories: (territories: TerritoryInfo[]) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setScoreDetails: (details: ScoreDetails | null) => void;
  setResources: (resources: Resources | null) => void;
  setTradeRoutes: (routes: TradeRoute[]) => void;
  setActivePolicies: (policies: Policy[]) => void;
  setAvailablePolicies: (policies: Policy[]) => void;
  setMitigationTools: (tools: MitigationTool[]) => void;
  setGameMode: (mode: GameMode) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setGameState = (gameState: GameState | null) => {
    dispatch({ type: 'SET_GAME_STATE', payload: gameState });
  };

  const setChoices = (choices: Choice[]) => {
    dispatch({ type: 'SET_CHOICES', payload: choices });
  };

  const setEventDescription = (description: string) => {
    dispatch({ type: 'SET_EVENT_DESCRIPTION', payload: description });
  };

  const setEventSummary = (summary: string[]) => {
    dispatch({ type: 'SET_EVENT_SUMMARY', payload: summary });
  };

  const setRivalCivilizations = (rivals: RivalCivilization[]) => {
    dispatch({ type: 'SET_RIVAL_CIVILIZATIONS', payload: rivals });
  };

  const setIntelligenceReports = (reports: IntelligenceReport[]) => {
    dispatch({ type: 'SET_INTELLIGENCE_REPORTS', payload: reports });
  };

  const setActiveMissions = (missions: EspionageMission[]) => {
    dispatch({ type: 'SET_ACTIVE_MISSIONS', payload: missions });
  };

  const setWorldTerritories = (territories: TerritoryInfo[]) => {
    dispatch({ type: 'SET_WORLD_TERRITORIES', payload: territories });
  };

  const setDifficulty = (difficulty: Difficulty | null) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  };

  const setScoreDetails = (details: ScoreDetails | null) => {
    dispatch({ type: 'SET_SCORE_DETAILS', payload: details });
  };

  const setResources = (resources: Resources | null) => {
    dispatch({ type: 'SET_RESOURCES', payload: resources });
  };

  const setTradeRoutes = (routes: TradeRoute[]) => {
    dispatch({ type: 'SET_TRADE_ROUTES', payload: routes });
  };

  const setActivePolicies = (policies: Policy[]) => {
    dispatch({ type: 'SET_ACTIVE_POLICIES', payload: policies });
  };

  const setAvailablePolicies = (policies: Policy[]) => {
    dispatch({ type: 'SET_AVAILABLE_POLICIES', payload: policies });
  };

  const setMitigationTools = (tools: MitigationTool[]) => {
    dispatch({ type: 'SET_MITIGATION_TOOLS', payload: tools });
  };

  const setGameMode = (mode: GameMode) => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <GameContext.Provider value={{
      ...state,
      setGameState,
      setChoices,
      setEventDescription,
      setEventSummary,
      setRivalCivilizations,
      setIntelligenceReports,
      setActiveMissions,
      setWorldTerritories,
      setDifficulty,
      setScoreDetails,
      setResources,
      setTradeRoutes,
      setActivePolicies,
      setAvailablePolicies,
      setMitigationTools,
      setGameMode,
      resetGame
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
