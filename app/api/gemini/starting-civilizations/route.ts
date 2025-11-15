import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { StartingCivilizationsResponse } from '@/types';

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
        const { year } = await request.json();

        const prompt = `You are a world domination simulation AI. For the year ${year}, generate a list of 3-5 interesting and historically plausible starting civilizations, empires, or regions. Keep the names concise. Return the response as a JSON object with a single key "civilizations" which is an array of strings.`;
    
        const response = await retryApiCall(() => ai.models.generateContent({
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
        }));

        if (!response.text) {
            throw new Error("No response text from AI");
        }

        const parsed = parseJsonResponse<StartingCivilizationsResponse>(response.text);
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.status === 503
            ? 'The AI strategist is currently overwhelmed. Please try again in a moment.'
            : 'Failed to retrieve civilizations for that era. The historical records are incomplete.';
        return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
    }
}
