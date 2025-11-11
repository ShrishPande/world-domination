
export enum GameScreen {
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
