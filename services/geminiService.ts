import { GameState, Choice, InitialGameResponse, TurnResponse, ScoreDetails, Difficulty } from '../types';

const API_BASE_URL = '/api/gemini';

const retryApiCall = async <T,>(apiCall: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await apiCall();
            return result;
        } catch (error: any) {
            console.warn(`API call attempt ${attempt} failed:`, error.message);

            // If it's the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }

            // For network errors or server errors, wait and retry
            const waitTime = delay * attempt; // Exponential backoff
            console.log(`Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    throw new Error('Max retries exceeded');
};

const fetchWithErrorCheck = async (url: string, options: RequestInit): Promise<any> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

export const getStartingCivilizations = async (year: number): Promise<string[]> => {
    return retryApiCall(() => fetchWithErrorCheck(`${API_BASE_URL}/starting-civilizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year }),
    })).then(data => data.civilizations);
};

export const initializeGame = async (country: string, year: number, difficulty: Difficulty): Promise<InitialGameResponse> => {
    return retryApiCall(() => fetchWithErrorCheck(`${API_BASE_URL}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, year, difficulty }),
    }));
};

export const processTurn = async (currentState: GameState, choice: Choice, difficulty: Difficulty): Promise<TurnResponse> => {
    return retryApiCall(() => fetchWithErrorCheck(`${API_BASE_URL}/process-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentState, choice, difficulty }),
    }));
};

export const calculateScore = async (finalState: GameState): Promise<ScoreDetails> => {
    return retryApiCall(() => fetchWithErrorCheck(`${API_BASE_URL}/calculate-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalState }),
    }));
};
