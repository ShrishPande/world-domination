
export enum GameScreen {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Leaderboard = 'leaderboard',
  Profile = 'profile',
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
  resources: Resources;
  tradeRoutes: TradeRoute[];
  activePolicies: Policy[];
  availablePolicies: Policy[];
  mitigationTools: MitigationTool[];
  rivalCivilizations: RivalCivilization[];
  intelligenceReports: IntelligenceReport[];
  activeMissions: EspionageMission[];
  worldTerritories: TerritoryInfo[];
}

export type ChoiceType = 'diplomacy' | 'military' | 'economy' | 'technology';

export type ResourceType = 'food' | 'iron' | 'gold' | 'knowledge';

export interface Resources {
  food: number;
  iron: number;
  gold: number;
  knowledge: number;
}

export interface TradeRoute {
  id: string;
  connectedTerritories: string[];
  passiveIncome: number;
  diplomacyBoost: number;
  vulnerability: number; // 0-100, chance of disruption
  status: 'active' | 'disrupted';
}

export type PolicyType = 'expansionism' | 'pacifism' | 'industrial_revolution' | 'conscription' | 'propaganda' | 'free_trade';

export interface Policy {
  id: string;
  type: PolicyType;
  name: string;
  description: string;
  effects: {
    military?: number;
    economy?: number;
    technology?: number;
    diplomacy?: number;
    resources?: Partial<Resources>;
  };
}

export interface MitigationTool {
  id: string;
  name: string;
  description: string;
  cost: Partial<Resources>;
  available: boolean;
}

export interface Choice {
  id: string;
  text: string;
  type: ChoiceType;
  stabilityRange?: { min: number; max: number }; // predictable outcomes
  mitigationTools?: MitigationTool[];
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
  isActive?: boolean;
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
  userId: string;
  username: string;
  highScore: number;
  title: string;
  date: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  userRank: number | null;
}

// Game Modes
export type GameMode = 'normal';
