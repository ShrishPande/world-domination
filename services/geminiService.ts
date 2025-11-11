
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Choice, InitialGameResponse, TurnResponse, ScoreDetails, StartingCivilizationsResponse, Difficulty } from '../types';
import { WORLD_REGIONS } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const gameStateSchema = {
    type: Type.OBJECT,
    properties: {
        year: { type: Type.NUMBER },
        rulerTitle: { type: Type.STRING },
        countryName: { type: Type.STRING },
        population: { type: Type.NUMBER, description: "Total population in millions" },
        military: { type: Type.NUMBER, description: "Military strength score from 1 to 1000" },
        economy: { type: Type.NUMBER, description: "Economic power score from 1 to 1000" },
        technology: { type: Type.NUMBER, description: "Technology level score from 1 to 1000" },
        territories: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: `A list of regions controlled. Must be a subset of: ${WORLD_REGIONS.join(', ')}.`
        },
    },
    required: ["year", "rulerTitle", "countryName", "population", "military", "economy", "technology", "territories"]
};

const choicesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier like 'choice_1'" },
            text: { type: Type.STRING, description: "The text for the choice presented to the player." },
            type: { type: Type.STRING, enum: ['diplomacy', 'military', 'economy', 'technology'] }
        },
        required: ["id", "text", "type"]
    }
};

const parseJsonResponse = <T,>(text: string): T => {
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
    try {
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("Received malformed JSON from API");
    }
};

export const getStartingCivilizations = async (year: number): Promise<string[]> => {
    const prompt = `You are a world domination simulation AI. For the year ${year}, generate a list of 3-5 interesting and historically plausible starting civilizations, empires, or regions. Keep the names concise. Return the response as a JSON object with a single key "civilizations" which is an array of strings.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    civilizations: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["civilizations"]
            }
        }
    });

    const parsed = parseJsonResponse<StartingCivilizationsResponse>(response.text);
    return parsed.civilizations;
};

export const initializeGame = async (country: string, year: number, difficulty: Difficulty): Promise<InitialGameResponse> => {
    const prompt = `You are a world domination simulation AI. The user has chosen to start as the leader of the ${country} in the year ${year} on '${difficulty}' difficulty.
- For 'easy', provide a strong starting position with some advantages.
- For 'medium', provide a balanced start.
- For 'hard', provide a challenging start with clear disadvantages.
- For 'realistic', provide a historically plausible, complex start that may be difficult.

Generate an initial game state reflecting this choice. Provide a brief, engaging description of their starting situation. Offer 3-4 distinct strategic choices for their first move. The world is composed of these regions: ${WORLD_REGIONS.join(', ')}. Return the response as a JSON object.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    gameState: gameStateSchema,
                    choices: choicesSchema,
                },
                required: ["description", "gameState", "choices"]
            }
        }
    });

    return parseJsonResponse<InitialGameResponse>(response.text);
};


export const processTurn = async (currentState: GameState, choice: Choice, difficulty: Difficulty): Promise<TurnResponse> => {
    const prompt = `You are a world domination simulation AI. The current game state is ${JSON.stringify(currentState)}. The player, the ${currentState.rulerTitle} of ${currentState.countryName}, has chosen to: "${choice.text}". The game difficulty is '${difficulty}'. 
    
    Based on this choice, the historical context, and the difficulty, generate a surprising and unpredictable outcome. Avoid straightforward success or failure. Every choice should have trade-offs, unintended consequences, or unexpected twists.
    
    - On 'easy' difficulty, lean towards more favorable outcomes but still include a minor complication or twist.
    - On 'medium' difficulty, outcomes should be a balanced mix of positive and negative effects.
    - On 'hard' difficulty, choices often lead to difficult new problems, and positive results should be hard-won and limited. Major negative events can occur randomly.
    - On 'realistic' difficulty, outcomes should be complex, multi-faceted, and grounded in historical possibility. Unforeseen global events should be factored in.

    Follow these steps:
    1. Write a compelling description of the nuanced outcome. It should not be a simple "success!" or "failure!". Introduce a twist. For example, a military victory could lead to a plague in the army, a rebellion in the newly conquered territory, or a new powerful enemy coalition forming. A trade deal could empower a future rival or cause social unrest at home.
    2. Update the game state. The year should advance by a plausible amount (e.g., 1-10 years). All stats (population, military, economy, technology) must change based on the complex outcome. If a new territory is conquered, add it to the territories list. New territories must be plausible neighbors to existing ones. The world is composed of these regions: ${WORLD_REGIONS.join(', ')}.
    3. Provide 3-4 new, distinct strategic choices for the player's next turn, reflecting the new, complex situation.
    
    Return the entire response as a single JSON object.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    gameState: gameStateSchema,
                    choices: choicesSchema,
                },
                required: ["description", "gameState", "choices"]
            }
        }
    });
    
    return parseJsonResponse<TurnResponse>(response.text);
};

export const calculateScore = async (finalState: GameState): Promise<ScoreDetails> => {
    const prompt = `You are a game scoring AI. The world domination game has ended. The final game state is ${JSON.stringify(finalState)}. The world consists of ${WORLD_REGIONS.length} regions in total: ${WORLD_REGIONS.join(', ')}.
    
    Analyze the final state based on these factors:
    - Number of territories conquered (${finalState.territories.length} / ${WORLD_REGIONS.length}).
    - Final population, military, economy, and technology scores.
    - Overall stability and power projection.
    
    Provide a final score out of 10,000. Give the player a fitting title for their reign (e.g., 'Regional Power', 'Global Hegemon', 'Fallen Empire'). Write a brief, insightful analysis of their performance. Return this as a JSON object.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    analysis: { type: Type.STRING },
                },
                required: ["score", "title", "analysis"]
            }
        }
    });
    
    return parseJsonResponse<ScoreDetails>(response.text);
};
