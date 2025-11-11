import { Score, LeaderboardEntry, User } from '../types';

// In a real deployed app, you might use an environment variable for the API base URL.
// For this setup, we use an absolute URL to ensure the frontend dev server can reach the backend.
const API_BASE_URL = 'http://localhost:3001/api';

// A helper function to handle API responses
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

// --- API Functions ---

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

export const saveScore = async (score: Score): Promise<Score> => {
    // The backend uses userId, not the full user object
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
    // This endpoint is already shaped correctly by the aggregation pipeline
    return response.json(); 
};

// --- Old Local Storage Functions (for reference, now unused) ---

// These have been replaced by the API calls above.

const USERS_KEY = 'world_dom_users';
const SCORES_KEY = 'world_dom_scores';

export const findUserByUsername = async (username: string): Promise<User | null> => {
    // This is now handled by POST /api/auth/login
    throw new Error("findUserByUsername is deprecated. Use loginUser.");
};

export const createUser = async (username:string): Promise<User> => {
    // This is now handled by POST /api/auth/signup
    throw new Error("createUser is deprecated. Use signupUser.");
};