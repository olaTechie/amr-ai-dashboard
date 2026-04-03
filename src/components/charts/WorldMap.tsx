"use client";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useState } from "react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map common country names to ISO country names used in topojson
const NAME_MAP: Record<string, string> = {
  "USA": "United States of America",
  "US": "United States of America",
  "United States": "United States of America",
  "UK": "United Kingdom",
  "South Korea": "South Korea",
  "Republic of Korea": "South Korea",
  "Taiwan": "Taiwan",
  "Czech Republic": "Czechia",
};

interface Props {
  data: Record<string, number>;
  maxValue: number;
}

export default function WorldMap({ data, maxValue }: Props) {
  const [tooltip, setTooltip] = useState("");

  // Normalize country names
  const normalized: Record<string, number> = {};
  for (const [key, val] of Object.entries(data)) {
    const mapped = NAME_MAP[key] || key;
    normalized[mapped] = (normalized[mapped] || 0) + val;
  }

  const getColor = (count: number) => {
    if (count === 0) return "#E8EDF4";
    const intensity = Math.min(count / maxValue, 1);
    // Interpolate from light blue to navy
    const r = Math.round(214 - intensity * (214 - 27));
    const g = Math.round(228 - intensity * (228 - 58));
    const b = Math.round(240 - intensity * (240 - 92));
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="relative h-full w-full">
      {tooltip && (
        <div className="absolute top-2 right-2 bg-navy text-white text-[10px] px-2 py-1 rounded shadow z-10">
          {tooltip}
        </div>
      )}
      <ComposableMap
        projectionConfig={{ scale: 140, center: [10, 10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const count = normalized[name] || 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(count)}
                    stroke="#fff"
                    strokeWidth={0.4}
                    onMouseEnter={() => {
                      setTooltip(count > 0 ? `${name}: ${count} studies` : name);
                    }}
                    onMouseLeave={() => setTooltip("")}
                    style={{
                      hover: { fill: "#4472C4", outline: "none" },
                      pressed: { outline: "none" },
                      default: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
