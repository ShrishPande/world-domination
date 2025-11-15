import { Score, LeaderboardEntry, User } from '../types';

const API_BASE_URL = '/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Helper to transform MongoDB's `_id` to `id` for frontend consistency
    const transformId = (item: any) => {
        if (item._id) {
            item.id = item._id;
            delete item._id;
        }
        return item;
    };

    if (Array.isArray(data)) {
        return data.map(transformId);
    }
    return transformId(data);
};

export const loginUser = async (username: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    return handleResponse(response);
};

export const signupUser = async (username: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    return handleResponse(response);
};

export const saveScore = async (score: Omit<Score, 'id'>): Promise<Score> => {
    const payload = { ...score, userId: score.userId };
    
    const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const getUserScores = async (userId: string): Promise<Score[]> => {
    const response = await fetch(`${API_BASE_URL}/scores/user/${userId}`);
    return handleResponse(response);
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    return handleResponse(response);
};