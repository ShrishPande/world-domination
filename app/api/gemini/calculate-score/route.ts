import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, ScoreDetails } from '@/types';
import { WORLD_REGIONS } from '@/constants';

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
        const { finalState } = await request.json();

        const prompt = `You are a game scoring AI. The world domination game has ended. The final game state is ${JSON.stringify(finalState)}. The world consists of ${WORLD_REGIONS.length} regions in total: ${WORLD_REGIONS.join(', ')}.
    
    Analyze the final state based on these factors:
    - Number of territories conquered (${finalState.territories.length} / ${WORLD_REGIONS.length}).
    - Final population, military, economy, and technology scores.
    - Overall stability and power projection.
    
    Provide a final score out of 10,000. Give the player a fitting title for their reign (e.g., 'Regional Power', 'Global Hegemon', 'Fallen Empire'). Write a brief, insightful analysis of their performance. Return this as a JSON object.`;

        const response = await retryApiCall(() => ai.models.generateContent({
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
        }));

        if (!response.text) {
            throw new Error("No response text from AI");
        }

        const parsed = parseJsonResponse<ScoreDetails>(response.text);
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.status === 503
            ? 'The AI strategist is currently overwhelmed. Please try again in a moment.'
            : 'Failed to calculate your final score. Your legacy is too grand to measure.';
        return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
    }
}
