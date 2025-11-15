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

const resourcesSchema = {
    type: Type.OBJECT,
    properties: {
        food: { type: Type.NUMBER, description: "Food resource for population stability" },
        iron: { type: Type.NUMBER, description: "Iron resource for military power" },
        gold: { type: Type.NUMBER, description: "Gold resource for economic transactions" },
        knowledge: { type: Type.NUMBER, description: "Knowledge resource for technology boost" }
    },
    required: ["food", "iron", "gold", "knowledge"]
};

const tradeRouteSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        connectedTerritories: { type: Type.ARRAY, items: { type: Type.STRING } },
        passiveIncome: { type: Type.NUMBER },
        diplomacyBoost: { type: Type.NUMBER },
        vulnerability: { type: Type.NUMBER },
        status: { type: Type.STRING, enum: ['active', 'disrupted'] }
    },
    required: ["id", "connectedTerritories", "passiveIncome", "diplomacyBoost", "vulnerability", "status"]
};

const policySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['expansionism', 'pacifism', 'industrial_revolution', 'conscription', 'propaganda', 'free_trade'] },
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        effects: {
            type: Type.OBJECT,
            properties: {
                military: { type: Type.NUMBER },
                economy: { type: Type.NUMBER },
                technology: { type: Type.NUMBER },
                diplomacy: { type: Type.NUMBER },
                resources: {
                    type: Type.OBJECT,
                    properties: {
                        food: { type: Type.NUMBER },
                        iron: { type: Type.NUMBER },
                        gold: { type: Type.NUMBER },
                        knowledge: { type: Type.NUMBER }
                    }
                }
            }
        }
    },
    required: ["id", "type", "name", "description", "effects"]
};

const mitigationToolSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        cost: resourcesSchema,
        available: { type: Type.BOOLEAN }
    },
    required: ["id", "name", "description", "cost", "available"]
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
        resources: resourcesSchema,
        tradeRoutes: {
            type: Type.ARRAY,
            items: tradeRouteSchema,
            description: "Initially empty array - trade routes established through diplomacy"
        },
        activePolicies: {
            type: Type.ARRAY,
            items: policySchema,
            description: "Initially empty array - policies activated by player choice"
        },
        availablePolicies: {
            type: Type.ARRAY,
            items: policySchema,
            description: "Available policies that can be chosen"
        },
        mitigationTools: {
            type: Type.ARRAY,
            items: mitigationToolSchema,
            description: "Tools available to mitigate randomness"
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
    required: ["year", "rulerTitle", "countryName", "population", "military", "economy", "technology", "territories", "resources", "tradeRoutes", "activePolicies", "availablePolicies", "mitigationTools", "rivalCivilizations", "intelligenceReports", "activeMissions", "worldTerritories"]
};

const choicesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier like 'choice_1'" },
            text: { type: Type.STRING, description: "The text for the choice presented to the player." },
            type: { type: Type.STRING, enum: ['diplomacy', 'military', 'economy', 'technology'] },
            stabilityRange: {
                type: Type.OBJECT,
                properties: {
                    min: { type: Type.NUMBER, minimum: 0, maximum: 100 },
                    max: { type: Type.NUMBER, minimum: 0, maximum: 100 }
                },
                description: "Optional range for predictable outcomes (0-100 scale)"
            },
            mitigationTools: {
                type: Type.ARRAY,
                items: mitigationToolSchema,
                description: "Optional tools to mitigate randomness"
            }
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

const retryWithJsonParsing = async <T,>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            console.warn(`Operation attempt ${attempt} failed:`, error.message);

            // If it's the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }

            // Retry on JSON parsing errors or API errors
            if (error.message.includes('malformed JSON') || error.status === 503 || error.status === 429) {
                const waitTime = delay * attempt; // Exponential backoff
                console.log(`Retrying operation in ${waitTime}ms...`);
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
        const { country, year, difficulty, gameMode } = await request.json();

        const prompt = `You are a World Domination Simulation AI.

Generate a game start for the ${country} civilization in the year ${year} on '${difficulty}' difficulty.

WORLD FRAMEWORK:
- World regions: ${WORLD_REGIONS.join(', ')}
- Each region has defined terrain, resources, defense bonuses, strategic value, and supply cost.
- Include 3–4 rival civilizations with distinct personalities: Aggressor, Diplomat, Trader, Scientist, Wildcard.

RESOURCES:
- Food (population stability)
- Iron (military strength)
- Gold (economic power)
- Knowledge (technology progress)

POLICIES:
- Available pool: Expansionism, Pacifism, Industrial Revolution, Conscription, Propaganda, Free Trade.
- Provide 2–3 available policies. Active policies: empty.

TRADE SYSTEM:
- No initial trade routes. They can be created diplomatically and give passive income but are disruptable.

DIFFICULTY SCALING:
- Easy: strong start advantage.
- Medium: balanced.
- Hard: disadvantaged.
- Realistic: historically grounded, complex, challenging.

MITIGATION SYSTEM:
- Include re-rolls or stability boosts (cost resources).
- All strategic choices must show outcome stability ranges (0–100).

GENERATE THE GAME STATE:
1. Player starting stats (Near accurate Population estimate for the era, Military/Economy/Tech 100–400), territories (1–3), resources.
2. 3–4 rival civilizations with territories, personality, and initial diplomatic stance.
3. World region overview (concise but strategic).
4. Intelligence system initialized (no reports, empty missions).
5. Available policies and empty active policies/trade routes.
6. Basic mitigation tools (1–2 items).
7. Short engaging starting description.
8. Three 4–6 word bullet summaries (advantages/challenges/opportunities).
9. 3–4 strategic first-move options with stability ranges and mitigation notes.

Return everything as a JSON object.
`;
        
        const parsed = await Promise.race([
            retryWithJsonParsing(async () => {
                const response = await ai.models.generateContent({
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
                });

                if (!response.text) {
                    throw new Error("No response text from AI");
                }

                return parseJsonResponse<InitialGameResponse>(response.text);
            }),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Request timeout after 30 seconds")), 30000)
            )
        ]);

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.status === 503
            ? 'The AI strategist is currently overwhelmed. Please try again in a moment.'
            : 'Failed to initialize your empire. The scrolls of destiny are unclear.';
        return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
    }
}
