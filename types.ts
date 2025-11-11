
export enum GameScreen {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Leaderboard = 'leaderboard',
  Setup = 'setup',
  Playing = 'playing',
  GameOver = 'gameOver',
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'realistic';

export interface GameState {
  year: number;
  rulerTitle: string;
  countryName: string;
  population: number;
  military: number;
  economy: number;
  technology: number;
  territories: string[];
}

export type ChoiceType = 'diplomacy' | 'military' | 'economy' | 'technology';

export interface Choice {
  id: string;
  text: string;
  type: ChoiceType;
}

export interface ScoreDetails {
  score: number;
  title: string;
  analysis: string;
}

export interface InitialGameResponse {
  description: string;
  gameState: GameState;
  choices: Choice[];
}

export interface TurnResponse extends InitialGameResponse {}

export interface StartingCivilizationsResponse {
  civilizations: string[];
}

// Auth and Data Types
export interface User {
  id: string;
  username: string;
}

export interface Score {
  id: string;
  userId: string;
  score: number;
  title: string;
  analysis: string;
  finalState: GameState;
  date: string;
}

export interface LeaderboardEntry {
  username: string;
  highScore: number;
  title: string;
  date: string;
}
