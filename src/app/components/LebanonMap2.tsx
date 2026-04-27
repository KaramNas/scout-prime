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

export default function LebanonMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hoveredIdRef = useRef<string | number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<HoveredZone | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
            paint: { "background-color": "#0e1f0b" },
          },
        ],
      },
      center: [35.86, 33.87],
      zoom: 7.8,
      minZoom: 6.5,
      maxZoom: 15,
      pitch: 40,
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

      // Terrain DEM for 3D mountains
      map.addSource("terrain-dem", {
        type: "raster-dem",
        url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
        tileSize: 256,
      });

      map.setTerrain({ source: "terrain-dem", exaggeration: 2.0 });

      map.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "terrain-dem",
        paint: {
          "hillshade-exaggeration": 0.5,
          "hillshade-shadow-color": "#1a3310",
          "hillshade-highlight-color": "#d4eaaa",
          "hillshade-accent-color": "#3a6628",
        },
      });

      // Real Lebanon adm3 data
      map.addSource("adm3", {
        type: "geojson",
        data: "/lebanon-adm3.geojson",
        generateId: true,
      });

      // Fill — different green shade per governorate
      map.addLayer({
        id: "adm3-fill",
        type: "fill",
        source: "adm3",
        paint: {
          "fill-color": [
            "match",
            ["get", "adm1_name"],
            "Beirut", "#2d5a1b",
            "Mount Lebanon", "#3a7a28",
            "North", "#2a6020",
            "South", "#4a8a32",
            "Bekaa", "#5a9a3c",
            "Nabatieh", "#3d7030",
            "Akkar", "#244d18",
            "Baalbek-Hermel", "#487838",
            "#366025",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            0.85,
            0.52,
          ],
        },
      });

      // Outline
      map.addLayer({
        id: "adm3-outline",
        type: "line",
        source: "adm3",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            "#c8f090",
            "#7ab85a",
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            2.0,
            0.4,
          ],
          "line-opacity": 0.8,
        },
      });

      // Town name labels — only appear when zoomed in
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
          "text-color": "#e0f5c0",
          "text-halo-color": "#0e1f0b",
          "text-halo-width": 1.2,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 11, 1],
        },
      });

      // Hover interactions
      map.on("mousemove", "adm3-fill", (e) => {
        if (!e.features || e.features.length === 0) return;

        setMousePos({ x: e.point.x, y: e.point.y });

        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: "adm3", id: hoveredIdRef.current },
            { hovered: false }
          );
        }

        const feature = e.features[0];
        hoveredIdRef.current = feature.id ?? null;

        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: "adm3", id: hoveredIdRef.current },
            { hovered: true }
          );
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
          map.setFeatureState(
            { source: "adm3", id: hoveredIdRef.current },
            { hovered: false }
          );
        }
        hoveredIdRef.current = null;
        setHoveredZone(null);
        map.getCanvas().style.cursor = "";
      });

      setMapLoaded(true);
    });

    return () => {
      clearInterval(stepInterval);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#0e1f0b",
        overflow: "hidden",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Loading screen */}
      {!mapLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            background: "#0e1f0b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4 L28 16 L36 12 L30 22 L40 20 L32 28 L38 28 L24 40 L10 28 L16 28 L8 20 L18 22 L12 12 L20 16 Z"
              fill="#4a8a30"
              opacity="0.9"
            />
            <rect x="22" y="40" width="4" height="6" fill="#6b4a2a" rx="1" />
          </svg>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a7a30", marginBottom: "0.5rem" }}>
              SCOUTS FIELD RESEARCH
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 300, letterSpacing: "0.18em", color: "#b8e090" }}>
              LEBANON
            </div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#3a6020", marginTop: "0.3rem" }}>
              CADASTRAL MAP
            </div>
          </div>

          <div style={{ width: "160px", height: "1px", background: "#1a3a10", position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                background: "#5a9a38",
                width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ fontSize: "0.7rem", color: "#3a6020", letterSpacing: "0.1em" }}>
            {loadingMessages[loadingStep]}
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "#4a7a30", marginBottom: "0.3rem" }}>
          SCOUTS FIELD RESEARCH
        </div>
        <div style={{ fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.15em", color: "#b8e090", lineHeight: 1 }}>
          LEBANON
        </div>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "#3a6020", marginTop: "0.25rem" }}>
          1,627 CADASTRAL ZONES
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredZone && (
        <div
          style={{
            position: "absolute",
            left: mousePos.x + 18,
            top: Math.min(mousePos.y - 10, window.innerHeight - 180),
            zIndex: 20,
            background: "rgba(10, 22, 6, 0.92)",
            border: "1px solid rgba(120, 200, 80, 0.3)",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            pointerEvents: "none",
            minWidth: "180px",
            maxWidth: "240px",
          }}
        >
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "#5a9a38", marginBottom: "0.3rem" }}>
            CADASTRAL ZONE
          </div>
          <div style={{ fontSize: "1rem", color: "#c8f090", fontWeight: 500, marginBottom: "0.1rem" }}>
            {hoveredZone.name}
          </div>
          {hoveredZone.nameAr && (
            <div style={{ fontSize: "0.85rem", color: "#7ab858", marginBottom: "0.4rem", direction: "rtl", textAlign: "right" }}>
              {hoveredZone.nameAr}
            </div>
          )}
          <div style={{ height: "1px", background: "rgba(120,200,80,0.15)", margin: "0.4rem 0" }} />
          <div style={{ fontSize: "0.7rem", color: "#5a8a40", lineHeight: 1.8 }}>
            <div>District: <span style={{ color: "#90c870" }}>{hoveredZone.district}</span></div>
            <div>Governorate: <span style={{ color: "#90c870" }}>{hoveredZone.governorate}</span></div>
            <div>Area: <span style={{ color: "#90c870" }}>{hoveredZone.areaSqkm.toFixed(2)} km²</span></div>
          </div>
        </div>
      )}

      {/* Bottom controls hint */}
      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          gap: "1.5rem",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          color: "#2a5018",
          whiteSpace: "nowrap",
        }}
      >
        <span>SCROLL TO ZOOM</span>
        <span>·</span>
        <span>DRAG TO PAN</span>
        <span>·</span>
        <span>RIGHT-DRAG TO TILT</span>
        <span>·</span>
        <span>HOVER TO INSPECT</span>
      </div>
    </div>
  );
}
