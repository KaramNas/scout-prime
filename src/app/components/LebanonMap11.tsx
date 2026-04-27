"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

type HoveredZone = {
  name: string;
  nameAr: string | null;
  district: string;
  governorate: string;
  areaSqkm: number;
};

// Animated cloud SVG generator
function generateCloudPath(seed: number): string {
  const bumps = 6 + (seed % 4);
  let d = `M${10 + seed % 20},50`;
  for (let i = 0; i < bumps; i++) {
    const x = 10 + (i / bumps) * 180 + (seed % 10);
    const cy = 30 + (i % 3) * 10 - (seed % 8);
    const r = 18 + (i % 3) * 8 + (seed % 6);
    d += ` A${r},${r} 0 0,1 ${x + 30},${cy}`;
  }
  d += ` L200,55 Z`;
  return d;
}

const CLOUDS = [
  { id: 0, y: "8%", scale: 1.4, opacity: 0.06, duration: 90, delay: 0 },
  { id: 1, y: "15%", scale: 0.9, opacity: 0.04, duration: 120, delay: -30 },
  { id: 2, y: "22%", scale: 1.1, opacity: 0.05, duration: 75, delay: -15 },
  { id: 3, y: "5%", scale: 0.7, opacity: 0.03, duration: 150, delay: -60 },
  { id: 4, y: "30%", scale: 1.6, opacity: 0.07, duration: 100, delay: -45 },
];

const GOV_COLORS: Record<string, { fill: string; hover: string }> = {
  "Beirut": { fill: "#00ff88", hover: "#44ffaa" },
  "Mount Lebanon": { fill: "#22dd66", hover: "#55ff99" },
  "North": { fill: "#00ccff", hover: "#44ddff" },
  "South": { fill: "#88ff44", hover: "#aaff77" },
  "Bekaa": { fill: "#ffcc00", hover: "#ffdd44" },
  "Nabatieh": { fill: "#ff8844", hover: "#ffaa77" },
  "Akkar": { fill: "#aa44ff", hover: "#cc77ff" },
  "Baalbek-Hermel": { fill: "#ff4488", hover: "#ff77aa" },
};

export default function LebanonMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hoveredIdRef = useRef<string | number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<HoveredZone | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pulseActive, setPulseActive] = useState(false);

  const loadingMessages = [
    "Initializing terrain…",
    "Loading cadastral boundaries…",
    "Rendering 1,627 zones…",
    "Almost ready…",
  ];

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, loadingMessages.length - 1));
    }, 900);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#050e03" },
          },
        ],
      },
      center: [35.86, 33.87],
      zoom: 7.8,
      minZoom: 6.5,
      maxZoom: 15,
      pitch: 44,
      bearing: -8,
      antialias: true,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      "top-right"
    );
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("load", async () => {
      clearInterval(stepInterval);

      // 3D terrain
      map.addSource("terrain-dem", {
        type: "raster-dem",
        url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
        tileSize: 256,
      });
      map.setTerrain({ source: "terrain-dem", exaggeration: 2.2 });

      map.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "terrain-dem",
        paint: {
          "hillshade-exaggeration": 0.6,
          "hillshade-shadow-color": "#001a00",
          "hillshade-highlight-color": "#aaffcc",
          "hillshade-accent-color": "#00ff88",
        },
      });

      // Real Lebanon adm3 data
      map.addSource("adm3", {
        type: "geojson",
        data: "/lebanon-adm3.geojson",
        generateId: true,
      });

      // Vibrant fill per governorate
      map.addLayer({
        id: "adm3-fill",
        type: "fill",
        source: "adm3",
        paint: {
          "fill-color": [
            "match", ["get", "adm1_name"],
            "Beirut", "#00ff88",
            "Mount Lebanon", "#22dd66",
            "North", "#00ccff",
            "South", "#88ff44",
            "Bekaa", "#ffcc00",
            "Nabatieh", "#ff8844",
            "Akkar", "#aa44ff",
            "Baalbek-Hermel", "#ff4488",
            "#33ff77",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            0.82,
            0.38,
          ],
        },
      });

      // Bright outline
      map.addLayer({
        id: "adm3-outline",
        type: "line",
        source: "adm3",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            "#ffffff",
            [
              "match", ["get", "adm1_name"],
              "Beirut", "#00ff88",
              "Mount Lebanon", "#44ff88",
              "North", "#44ddff",
              "South", "#aaff44",
              "Bekaa", "#ffdd22",
              "Nabatieh", "#ffaa66",
              "Akkar", "#cc77ff",
              "Baalbek-Hermel", "#ff77aa",
              "#55ff99",
            ],
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            2.5,
            0.5,
          ],
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            1.0,
            0.7,
          ],
        },
      });

      // Governorate boundary overlay (thicker lines between govs)
      map.addLayer({
        id: "adm3-labels",
        type: "symbol",
        source: "adm3",
        minzoom: 10,
        layout: {
          "text-field": ["get", "adm3_name"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 9, 14, 13],
          "text-font": ["Open Sans Regular"],
          "text-anchor": "center",
          "text-max-width": 8,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1.5,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 11, 1],
        },
      });

      // Hover
      map.on("mousemove", "adm3-fill", (e) => {
        if (!e.features || e.features.length === 0) return;
        setMousePos({ x: e.point.x, y: e.point.y });

        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: "adm3", id: hoveredIdRef.current }, { hovered: false });
        }
        const feature = e.features[0];
        hoveredIdRef.current = feature.id ?? null;
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: "adm3", id: hoveredIdRef.current }, { hovered: true });
        }

        const p = feature.properties as Record<string, string | number | null>;
        setHoveredZone({
          name: String(p.adm3_name ?? ""),
          nameAr: p.adm3_name1 ? String(p.adm3_name1) : null,
          district: String(p.adm2_name ?? ""),
          governorate: String(p.adm1_name ?? ""),
          areaSqkm: Number(p.area_sqkm ?? 0),
        });
        map.getCanvas().style.cursor = "crosshair";
      });

      map.on("mouseleave", "adm3-fill", () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: "adm3", id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = null;
        setHoveredZone(null);
        map.getCanvas().style.cursor = "";
      });

      // Pulse on load
      setTimeout(() => setPulseActive(true), 500);
      setTimeout(() => setPulseActive(false), 2500);

      setMapLoaded(true);
    });

    return () => {
      clearInterval(stepInterval);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const govColor = hoveredZone
    ? (GOV_COLORS[hoveredZone.governorate]?.hover ?? "#00ff88")
    : "#00ff88";

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#050e03", overflow: "hidden", fontFamily: "'Georgia', serif" }}>

      {/* CSS animations */}
      <style>{`
        @keyframes cloudDrift {
          from { transform: translateX(-220px); }
          to   { transform: translateX(110vw); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.3; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes pulseRing {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
      `}</style>

      {/* Loading screen */}
      {!mapLoaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 100, background: "#050e03",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem",
        }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none" style={{ animation: "shimmer 1.5s ease infinite" }}>
            <path d="M24 4 L28 16 L36 12 L30 22 L40 20 L32 28 L38 28 L24 40 L10 28 L16 28 L8 20 L18 22 L12 12 L20 16 Z" fill="#00ff88" opacity="0.9" />
            <rect x="22" y="40" width="4" height="6" fill="#6b4a2a" rx="1" />
          </svg>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#00aa55", marginBottom: "0.5rem" }}>SCOUTS FIELD RESEARCH</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 300, letterSpacing: "0.18em", color: "#00ff88" }}>LEBANON</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#006633", marginTop: "0.3rem" }}>CADASTRAL MAP</div>
          </div>
          <div style={{ width: "160px", height: "1px", background: "#0a2a0a", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%", background: "#00ff88",
              width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
              transition: "width 0.8s ease",
              boxShadow: "0 0 8px #00ff88",
            }} />
          </div>
          <div style={{ fontSize: "0.7rem", color: "#006633", letterSpacing: "0.1em" }}>{loadingMessages[loadingStep]}</div>
        </div>
      )}

      {/* Scrolling grid overlay for poly feel */}
      {mapLoaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridScroll 8s linear infinite",
        }} />
      )}

      {/* Animated clouds */}
      {mapLoaded && CLOUDS.map((cloud) => (
        <div key={cloud.id} style={{
          position: "absolute",
          top: cloud.y,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          animation: `cloudDrift ${cloud.duration}s linear infinite`,
          animationDelay: `${cloud.delay}s`,
        }}>
          <svg width="260" height="80" viewBox="0 0 260 80" style={{ transform: `scale(${cloud.scale})`, transformOrigin: "left center" }}>
            <ellipse cx="80" cy="55" rx="70" ry="22" fill="white" opacity={cloud.opacity} />
            <ellipse cx="120" cy="42" rx="55" ry="28" fill="white" opacity={cloud.opacity} />
            <ellipse cx="160" cy="50" rx="65" ry="20" fill="white" opacity={cloud.opacity} />
            <ellipse cx="200" cy="56" rx="50" ry="16" fill="white" opacity={cloud.opacity * 0.7} />
          </svg>
        </div>
      ))}

      {/* Scanline sweep on load */}
      {mapLoaded && (
        <div style={{
          position: "absolute", left: 0, right: 0, height: "3px", zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)",
          animation: "scanline 3s ease-out 0.5s 1 forwards",
          top: 0,
        }} />
      )}

      {/* Map */}
      <div ref={mapContainer} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Pulse ring on load */}
      {pulseActive && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", zIndex: 5, pointerEvents: "none",
          width: "300px", height: "300px",
          border: "2px solid rgba(0,255,136,0.5)",
          borderRadius: "50%",
          animation: "pulseRing 2s ease-out forwards",
        }} />
      )}

      {/* Title */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10, pointerEvents: "none" }}>
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "#00aa55", marginBottom: "0.3rem" }}>
          SCOUTS FIELD RESEARCH
        </div>
        <div style={{ fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.15em", color: "#00ff88", lineHeight: 1, textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
          LEBANON
        </div>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "#006633", marginTop: "0.25rem" }}>
          1,627 CADASTRAL ZONES
        </div>
      </div>

      {/* Governorate legend */}
      {mapLoaded && (
        <div style={{
          position: "absolute", top: "1.5rem", right: "4rem", zIndex: 10,
          display: "flex", flexDirection: "column", gap: "5px",
          animation: "fadeIn 1s ease 0.5s both",
        }}>
          {Object.entries(GOV_COLORS).map(([name, c]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "1px",
                background: c.fill,
                boxShadow: `0 0 6px ${c.fill}`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: c.fill, opacity: 0.85 }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredZone && (
        <div style={{
          position: "absolute",
          left: mousePos.x + 18,
          top: Math.min(mousePos.y - 10, (typeof window !== "undefined" ? window.innerHeight : 800) - 200),
          zIndex: 20,
          background: "rgba(2, 10, 2, 0.92)",
          border: `1px solid ${govColor}55`,
          borderRadius: "6px",
          padding: "0.75rem 1rem",
          pointerEvents: "none",
          minWidth: "190px",
          maxWidth: "250px",
          animation: "fadeIn 0.15s ease",
          boxShadow: `0 0 20px ${govColor}22`,
        }}>
          <div style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: govColor, marginBottom: "0.3rem", opacity: 0.7 }}>
            CADASTRAL ZONE
          </div>
          <div style={{ fontSize: "1rem", color: govColor, fontWeight: 500, marginBottom: "0.1rem", textShadow: `0 0 10px ${govColor}66` }}>
            {hoveredZone.name}
          </div>
          {hoveredZone.nameAr && (
            <div style={{ fontSize: "0.85rem", color: govColor, marginBottom: "0.4rem", direction: "rtl", textAlign: "right", opacity: 0.7 }}>
              {hoveredZone.nameAr}
            </div>
          )}
          <div style={{ height: "1px", background: `${govColor}33`, margin: "0.4rem 0" }} />
          <div style={{ fontSize: "0.7rem", color: "#557755", lineHeight: 1.8 }}>
            <div>District: <span style={{ color: govColor, opacity: 0.8 }}>{hoveredZone.district}</span></div>
            <div>Governorate: <span style={{ color: govColor, opacity: 0.8 }}>{hoveredZone.governorate}</span></div>
            <div>Area: <span style={{ color: govColor, opacity: 0.8 }}>{hoveredZone.areaSqkm.toFixed(2)} km²</span></div>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
        zIndex: 10, pointerEvents: "none",
        display: "flex", gap: "1.2rem",
        fontSize: "0.55rem", letterSpacing: "0.12em", color: "#1a4a1a", whiteSpace: "nowrap",
      }}>
        <span>SCROLL TO ZOOM</span><span>·</span>
        <span>DRAG TO PAN</span><span>·</span>
        <span>RIGHT-DRAG TO TILT</span><span>·</span>
        <span>HOVER TO INSPECT</span>
      </div>
    </div>
  );
}
