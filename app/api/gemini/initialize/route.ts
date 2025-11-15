import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Choice, InitialGameResponse, Difficulty } from '@/types';
import { WORLD_REGIONS } from '@/constants';

const rivalCivilizationSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        personality: { type: Type.STRING, enum: ['aggressor', 'diplomat', 'trader', 'scientist', 'wildcard'] },
        territories: { type: Type.ARRAY, items: { type: Type.STRING } },
        military: { type: Type.NUMBER },
        economy: { type: Type.NUMBER },
        technology: { type: Type.NUMBER },
        diplomacyStatus: { type: Type.STRING, enum: ['hostile', 'neutral', 'friendly', 'allied'] },
        lastKnownActivity: { type: Type.STRING }
    },
    required: ["name", "personality", "territories", "military", "economy", "technology", "diplomacyStatus", "lastKnownActivity"]
};

const territoryInfoSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        terrain: { type: Type.STRING, enum: ['plains', 'mountains', 'forests', 'desert', 'coastal', 'urban'] },
        resources: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategicValue: { type: Type.NUMBER },
        defenseBonus: { type: Type.NUMBER },
        supplyCost: { type: Type.NUMBER }
    },
    required: ["name", "terrain", "resources", "strategicValue", "defenseBonus", "supplyCost"]
};

const intelligenceReportSchema = {
    type: Type.OBJECT,
    properties: {
        target: { type: Type.STRING },
        intelType: { type: Type.STRING, enum: ['military', 'economic', 'technological', 'territorial', 'diplomatic'] },
        accuracy: { type: Type.NUMBER },
        lastUpdated: { type: Type.STRING },
        data: { type: Type.STRING, description: "JSON string containing intelligence data" }
    },
    required: ["target", "intelType", "accuracy", "lastUpdated", "data"]
};

const espionageMissionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['spy', 'sabotage', 'counterintel'] },
        target: { type: Type.STRING },
        risk: { type: Type.NUMBER },
        reward: { type: Type.NUMBER },
        duration: { type: Type.NUMBER },
        status: { type: Type.STRING, enum: ['planning', 'active', 'completed', 'failed'] }
    },
    required: ["id", "type", "target", "risk", "reward", "duration", "status"]
};

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
        rivalCivilizations: {
            type: Type.ARRAY,
            items: rivalCivilizationSchema,
            description: "3-4 rival civilizations with different personalities and starting positions"
        },
        intelligenceReports: {
            type: Type.ARRAY,
            items: intelligenceReportSchema,
            description: "Initially empty array - intelligence gathered through espionage"
        },
        activeMissions: {
            type: Type.ARRAY,
            items: espionageMissionSchema,
            description: "Initially empty array - espionage missions in planning/active state"
        },
        worldTerritories: {
            type: Type.ARRAY,
            items: territoryInfoSchema,
            description: "Strategic information about all world territories"
        }
    },
    required: ["year", "rulerTitle", "countryName", "population", "military", "economy", "technology", "territories", "rivalCivilizations", "intelligenceReports", "activeMissions", "worldTerritories"]
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

const retryApiCall = async <T,>(apiCall: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error: any) {
            console.warn(`API call attempt ${attempt} failed:`, error.message);

            // If it's the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }

            // If it's a 503 (overloaded) or 429 (rate limit), wait and retry
            if (error.status === 503 || error.status === 429) {
                const waitTime = delay * attempt; // Exponential backoff
                console.log(`Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                // For other errors, don't retry
                throw error;
            }
        }
    }
    throw new Error('Max retries exceeded');
};

export async function POST(request: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ message: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const { country, year, difficulty } = await request.json();

        const prompt = `You are a world domination simulation AI. The user has chosen to start as the leader of the ${country} in the year ${year} on '${difficulty}' difficulty.

WORLD SETUP:
- Available territories: ${WORLD_REGIONS.join(', ')}
- Each territory has terrain, resources, strategic value, defense bonuses, and supply costs
- Rival civilizations exist with different personalities: Aggressor (military-focused), Diplomat (alliance-focused), Trader (economy-focused), Scientist (tech-focused), Wildcard (unpredictable)

DIFFICULTY SCALING:
- For 'easy', provide a strong starting position with some advantages.
- For 'medium', provide a balanced start.
- For 'hard', provide a challenging start with clear disadvantages.
- For 'realistic', provide a historically plausible, complex start that may be difficult.

Generate an initial game state with:
1. Player's starting stats and territories
2. 3-4 rival civilizations, each with different personalities, starting territories, and initial diplomatic relations
3. World territory information with strategic details
4. Intelligence system initialized (no reports yet, empty espionage missions)

Provide a brief, engaging description of their starting situation. Also provide a summary in 3-4 bullet points, each 4-6 words only, highlighting the key advantages, challenges, and opportunities with specific numbers where relevant. Offer 3-4 distinct strategic choices for their first move, considering rival positions and territory values. Return the response as a JSON object.`;
        
        const response = await retryApiCall(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        summary: { type: Type.ARRAY, items: { type: Type.STRING } },
                        gameState: gameStateSchema,
                        choices: choicesSchema,
                    },
                    required: ["description", "summary", "gameState", "choices"]
                }
            }
        }));

        if (!response.text) {
            throw new Error("No response text from AI");
        }

        const parsed = parseJsonResponse<InitialGameResponse>(response.text);
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.status === 503
            ? 'The AI strategist is currently overwhelmed. Please try again in a moment.'
            : 'Failed to initialize your empire. The scrolls of destiny are unclear.';
        return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
    }
}
