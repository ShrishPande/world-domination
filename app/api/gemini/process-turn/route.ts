import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Choice, TurnResponse, Difficulty } from '@/types';
import { WORLD_REGIONS } from '@/constants';

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
        const { currentState, choice, difficulty } = await request.json();

        const prompt = `You are a world domination simulation AI. The current game state is ${JSON.stringify(currentState)}. The player, the ${currentState.rulerTitle} of ${currentState.countryName}, has chosen to: "${choice.text}". The game difficulty is '${difficulty}'.

    Based on this choice, the historical context, and the difficulty, generate a surprising and unpredictable outcome. Avoid straightforward success or failure. Every choice should have trade-offs, unintended consequences, or unexpected twists.

    - On 'easy' difficulty, lean towards more favorable outcomes but still include a minor complication or twist.
    - On 'medium' difficulty, outcomes should be a balanced mix of positive and negative effects.
    - On 'hard' difficulty, choices often lead to difficult new problems, and positive results should be hard-won and limited. Major negative events can occur randomly.
    - On 'realistic' difficulty, outcomes should be complex, multi-faceted, and grounded in historical possibility. Unforeseen global events should be factored in.

    Follow these steps:
    1. Write a compelling description of the nuanced outcome. It should not be a simple "success!" or "failure!". Introduce a twist. For example, a military victory could lead to a plague in the army, a rebellion in the newly conquered territory, or a new powerful enemy coalition forming. A trade deal could empower a future rival or cause social unrest at home.
    2. Provide a summary in 3-4 bullet points, each 4-6 words only, highlighting the major impacts with specific numbers, key changes to stats/territories, and immediate opportunities or threats.
    3. Update the game state. The year should advance by a plausible amount (e.g., 1-10 years). All stats (population, military, economy, technology) must change based on the complex outcome. If a new territory is conquered, add it to the territories list. New territories must be plausible neighbors to existing ones. The world is composed of these regions: ${WORLD_REGIONS.join(', ')}.
    4. Provide 3-4 new, distinct strategic choices for the player's next turn, reflecting the new, complex situation.

    Return the entire response as a single JSON object.`;

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

        const parsed = parseJsonResponse<TurnResponse>(response.text);
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.status === 503
            ? 'The AI strategist is currently overwhelmed. Please try again in a moment.'
            : 'Failed to process your choice. The winds of fate are turbulent.';
        return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
    }
}
