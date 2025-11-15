import { TerritoryInfo } from './types';

export const GAME_DURATION = 15 * 60; // 15 minutes in seconds

export const WORLD_REGIONS = [
    "Western Europe", "Eastern Europe", "North America", "South America",
    "North Africa", "Sub-Saharan Africa", "Middle East", "Central Asia",
    "East Asia", "South Asia", "Southeast Asia", "Oceania", "The Caribbean",
    "Siberia", "The Andes"
];

export const TERRITORY_DATA: TerritoryInfo[] = [
    {
        name: "Western Europe",
        terrain: "plains",
        resources: ["Agriculture", "Industry", "Trade"],
        strategicValue: 9,
        defenseBonus: 15,
        supplyCost: 8
    },
    {
        name: "Eastern Europe",
        terrain: "plains",
        resources: ["Agriculture", "Minerals"],
        strategicValue: 7,
        defenseBonus: 10,
        supplyCost: 6
    },
    {
        name: "North America",
        terrain: "forests",
        resources: ["Agriculture", "Industry", "Oil"],
        strategicValue: 8,
        defenseBonus: 12,
        supplyCost: 7
    },
    {
        name: "South America",
        terrain: "mountains",
        resources: ["Minerals", "Agriculture", "Oil"],
        strategicValue: 6,
        defenseBonus: 20,
        supplyCost: 9
    },
    {
        name: "North Africa",
        terrain: "desert",
        resources: ["Oil", "Minerals"],
        strategicValue: 7,
        defenseBonus: 8,
        supplyCost: 5
    },
    {
        name: "Sub-Saharan Africa",
        terrain: "plains",
        resources: ["Minerals", "Agriculture"],
        strategicValue: 5,
        defenseBonus: 5,
        supplyCost: 4
    },
    {
        name: "Middle East",
        terrain: "desert",
        resources: ["Oil", "Trade"],
        strategicValue: 9,
        defenseBonus: 10,
        supplyCost: 6
    },
    {
        name: "Central Asia",
        terrain: "mountains",
        resources: ["Minerals", "Trade"],
        strategicValue: 6,
        defenseBonus: 18,
        supplyCost: 8
    },
    {
        name: "East Asia",
        terrain: "plains",
        resources: ["Industry", "Agriculture"],
        strategicValue: 8,
        defenseBonus: 12,
        supplyCost: 7
    },
    {
        name: "South Asia",
        terrain: "plains",
        resources: ["Agriculture", "Industry"],
        strategicValue: 7,
        defenseBonus: 8,
        supplyCost: 6
    },
    {
        name: "Southeast Asia",
        terrain: "forests",
        resources: ["Agriculture", "Trade"],
        strategicValue: 6,
        defenseBonus: 15,
        supplyCost: 7
    },
    {
        name: "Oceania",
        terrain: "coastal",
        resources: ["Trade", "Minerals"],
        strategicValue: 4,
        defenseBonus: 6,
        supplyCost: 3
    },
    {
        name: "The Caribbean",
        terrain: "coastal",
        resources: ["Trade", "Agriculture"],
        strategicValue: 5,
        defenseBonus: 8,
        supplyCost: 4
    },
    {
        name: "Siberia",
        terrain: "mountains",
        resources: ["Minerals", "Oil"],
        strategicValue: 4,
        defenseBonus: 25,
        supplyCost: 12
    },
    {
        name: "The Andes",
        terrain: "mountains",
        resources: ["Minerals", "Agriculture"],
        strategicValue: 5,
        defenseBonus: 22,
        supplyCost: 10
    }
];

export const AI_PERSONALITIES = {
    aggressor: {
        name: "Aggressor",
        description: "Focuses on rapid military expansion and conquest",
        priorities: ["military", "expansion", "intimidation"],
        riskTolerance: "high"
    },
    diplomat: {
        name: "Diplomat",
        description: "Builds alliances and uses negotiation over force",
        priorities: ["diplomacy", "trade", "stability"],
        riskTolerance: "low"
    },
    trader: {
        name: "Trader",
        description: "Prioritizes economic development and mercantile networks",
        priorities: ["economy", "trade", "infrastructure"],
        riskTolerance: "medium"
    },
    scientist: {
        name: "Scientist",
        description: "Invests heavily in technological advancement",
        priorities: ["technology", "research", "innovation"],
        riskTolerance: "medium"
    },
    wildcard: {
        name: "Wildcard",
        description: "Unpredictable strategy with random tactical shifts",
        priorities: ["random", "opportunism", "surprise"],
        riskTolerance: "variable"
    }
};