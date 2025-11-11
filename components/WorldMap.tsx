
import React from 'react';
import { WORLD_REGIONS } from '../constants';

// A map of region names to their SVG path data and label positions.
// This is a highly stylized and not geographically accurate map.
const REGION_PATHS: { [key: string]: { path: string; x: number; y: number } } = {
  "North America": { path: "M40 50 L10 90 L30 130 L90 120 L120 70 L90 40 Z", x: 60, y: 90 },
  "South America": { path: "M50 140 L70 210 L100 200 L80 140 Z", x: 70, y: 175 },
  "The Caribbean": { path: "M100 130 L115 135 L120 150 L105 145 Z", x: 108, y: 142 },
  "Western Europe": { path: "M150 60 L140 80 L160 100 L180 90 L175 65 Z", x: 155, y: 80 },
  "Eastern Europe": { path: "M185 55 L180 90 L220 85 L225 50 Z", x: 200, y: 70 },
  "North Africa": { path: "M130 110 L120 150 L210 145 L220 115 Z", x: 170, y: 130 },
  "Sub-Saharan Africa": { path: "M130 155 L140 210 L200 205 L205 150 Z", x: 165, y: 180 },
  "Siberia": { path: "M230 45 L225 80 L320 70 L330 35 Z", x: 275, y: 60 },
  "Middle East": { path: "M215 95 L215 140 L250 135 L245 100 Z", x: 230, y: 120 },
  "Central Asia": { path: "M230 85 L255 95 L290 85 L270 120 L250 125 Z", x: 260, y: 105 },
  "East Asia": { path: "M325 65 L295 90 L310 130 L350 110 L350 75 Z", x: 325, y: 95 },
  "South Asia": { path: "M255 140 L265 170 L300 165 L290 135 Z", x: 277, y: 155 },
  "Southeast Asia": { path: "M305 135 L305 175 L340 180 L350 120 Z", x: 325, y: 155 },
  "Oceania": { path: "M320 190 L360 210 L370 195 L340 185 Z", x: 345, y: 200 },
  "The Andes": { path: "M70 145 L65 205 L75 208 L80 148 Z", x: 65, y: 165 },
};

interface WorldMapProps {
  controlledTerritories: string[];
}

const WorldMap: React.FC<WorldMapProps> = ({ controlledTerritories }) => {
  return (
    <div className="relative aspect-[1.8] w-full max-w-full">
      <svg viewBox="0 0 380 230" className="w-full h-full">
        {WORLD_REGIONS.map(region => {
          const regionData = REGION_PATHS[region];
          if (!regionData) return null;
          const isControlled = controlledTerritories.includes(region);
          
          return (
            <g key={region} className={isControlled ? "animate-pulse-glow" : ""}>
              <path
                d={regionData.path}
                className={
                  isControlled
                    ? "fill-cyan-500/70 stroke-cyan-300 stroke-[0.5]"
                    : "fill-gray-700/50 stroke-gray-600 stroke-[0.25] hover:fill-gray-600/50 transition-colors duration-300"
                }
              />
              <text
                x={regionData.x}
                y={regionData.y}
                className="text-[5px] font-sans font-semibold pointer-events-none select-none"
                textAnchor="middle"
                fill={isControlled ? "white" : "#a0a0a0"}
              >
                {region}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WorldMap;
