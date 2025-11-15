
export enum GameScreen {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Leaderboard = 'leaderboard',
  Setup = 'setup',
  Playing = 'playing',
  GameOver = 'gameOver',
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'realistic';

export type AIPersonality = 'aggressor' | 'diplomat' | 'trader' | 'scientist' | 'wildcard';

export interface RivalCivilization {
  name: string;
  personality: AIPersonality;
  territories: string[];
  military: number;
  economy: number;
  technology: number;
  diplomacyStatus: 'hostile' | 'neutral' | 'friendly' | 'allied';
  lastKnownActivity: string;
}

export interface TerritoryInfo {
  name: string;
  terrain: 'plains' | 'mountains' | 'forests' | 'desert' | 'coastal' | 'urban';
  resources: string[];
  strategicValue: number; // 1-10
  defenseBonus: number; // percentage
  supplyCost: number; // maintenance cost
}

export interface IntelligenceReport {
  target: string; // rival civilization name
  intelType: 'military' | 'economic' | 'technological' | 'territorial' | 'diplomatic';
  accuracy: number; // 0-100
  lastUpdated: string;
  data: any;
}

export interface EspionageMission {
  id: string;
  type: 'spy' | 'sabotage' | 'counterintel';
  target: string;
  risk: number; // 0-100
  reward: number; // potential intel/success value
  duration: number; // turns
  status: 'planning' | 'active' | 'completed' | 'failed';
}

export interface GameState {
  year: number;
  rulerTitle: string;
  countryName: string;
  population: number;
  military: number;
  economy: number;
  technology: number;
  territories: string[];
  rivalCivilizations: RivalCivilization[];
  intelligenceReports: IntelligenceReport[];
  activeMissions: EspionageMission[];
  worldTerritories: TerritoryInfo[];
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
  summary: string[];
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
