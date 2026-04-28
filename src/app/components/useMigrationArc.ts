// ── useMigrationArc.ts ────────────────────────────────────────────────────
// Hook that manages migration arc drawing + bird animation on a MapLibre map.
// Generates a great-circle arc between two points with altitude bell curve,
// animates it drawing itself segment by segment, then moves a marker along it.

import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

export type MigrationArc = {
  id: string;
  from: { lng: number; lat: number; label: string };
  to:   { lng: number; lat: number; label: string };
  bird: string;       // species name
  cub:  string;       // cub name
  date: string;
  color: string;      // hex color for this arc
  peakAltitude: number; // metres above ground at arc midpoint
};

// ── Generate arc points ───────────────────────────────────────────────────
// Interpolates N points between from→to with a sine-curve altitude profile.
function generateArcPoints(
  arc: MigrationArc,
  steps = 80
): GeoJSON.Feature<GeoJSON.LineString> {
  const coords: [number, number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t   = i / steps;
    const lng = arc.from.lng + (arc.to.lng - arc.from.lng) * t;
    const lat = arc.from.lat + (arc.to.lat - arc.from.lat) * t;
    // Bell curve altitude — peaks at t=0.5, zero at endpoints
    const alt = Math.sin(t * Math.PI) * arc.peakAltitude;
    coords.push([lng, lat, alt]);
  }

  return {
    type: "Feature",
    properties: {
      id:    arc.id,
      bird:  arc.bird,
      cub:   arc.cub,
      date:  arc.date,
      color: arc.color,
      from:  arc.from.label,
      to:    arc.to.label,
    },
    geometry: { type: "LineString", coordinates: coords },
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useMigrationArcs(
  map: maplibregl.Map | null,
  arcs: MigrationArc[],
  onArcHover: (info: MigrationArc | null, x: number, y: number) => void
) {
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const rafRef     = useRef<number | null>(null);
  const stepRef    = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!map) return;

    // ── Add each arc source + layers ─────────────────────────────────────
    arcs.forEach((arc) => {
      const fullGeoJSON = generateArcPoints(arc, 80);
      const emptyLine: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          properties: fullGeoJSON.properties,
          geometry: { type: "LineString", coordinates: [] },
        }],
      };

      // Source starts empty — we fill it progressively in the rAF loop
      map.addSource(`arc-${arc.id}`, {
        type: "geojson",
        data: emptyLine,
      });

      // ── Glow layer (thick, low opacity) — gives neon bloom effect ──
      map.addLayer({
        id: `arc-glow-${arc.id}`,
        type: "line",
        source: `arc-${arc.id}`,
        layout: {
          "line-join": "round",
          "line-cap":  "round",
        },
        paint: {
          "line-color":   arc.color,
          "line-width":   12,
          "line-opacity": 0.15,
          "line-blur":    4,
        },
      });

      // ── Core line layer (thin, fully opaque) ──
      map.addLayer({
        id: `arc-line-${arc.id}`,
        type: "line",
        source: `arc-${arc.id}`,
        layout: {
          "line-join": "round",
          "line-cap":  "round",
        },
        paint: {
          "line-color":   arc.color,
          "line-width":   2.5,
          "line-opacity": 0.95,
        },
      });

      // ── Hover interaction on the core line ──
      map.on("mouseenter", `arc-line-${arc.id}`, (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features && e.features[0]) {
          onArcHover(arc, e.point.x, e.point.y);
        }
      });
      map.on("mouseleave", `arc-line-${arc.id}`, () => {
        map.getCanvas().style.cursor = "";
        onArcHover(null, 0, 0);
      });

      // ── Bird marker — emoji div marker at the arc start ──
      const el = document.createElement("div");
      el.style.cssText = `
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
        filter: drop-shadow(0 0 6px ${arc.color});
        transition: transform 0.1s ease;
        user-select: none;
        pointer-events: none;
      `;
      el.textContent = "🦅";

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([arc.from.lng, arc.from.lat])
        .addTo(map);

      markersRef.current.push(marker);

      // Init step counter for this arc
      stepRef.current[arc.id] = 0;
    });

    // ── Animation loop ────────────────────────────────────────────────────
    // Each frame:
    //   1. Advance each arc's step counter by 1
    //   2. Slice the full arc coordinates up to current step → update source
    //   3. Move the bird marker to the current tip point
    //   4. When arc is fully drawn, loop bird back to start

    const TOTAL_STEPS = 80;
    const SPEED       = 1; // steps per frame — increase to draw faster

    const allFullArcs = arcs.map((arc) => generateArcPoints(arc, TOTAL_STEPS));

    let frameSkip = 0;

    const animate = () => {
      frameSkip++;
      // Throttle to every 2nd frame — smooth enough, half the work
      if (frameSkip % 2 === 0) {
        arcs.forEach((arc, i) => {
          const step    = stepRef.current[arc.id];
          const full    = allFullArcs[i];
          const coords  = (full.geometry.coordinates as [number,number,number][]);
          const current = Math.min(step, TOTAL_STEPS);

          // Update line source with coords up to current step
          const src = map.getSource(`arc-${arc.id}`) as maplibregl.GeoJSONSource;
          if (src) {
            src.setData({
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                properties: full.properties,
                geometry: {
                  type: "LineString",
                  coordinates: coords.slice(0, current + 1),
                },
              }],
            });
          }

          // Move bird to current tip
          if (coords[current]) {
            const [lng, lat] = coords[current];
            markersRef.current[i]?.setLngLat([lng, lat]);
          }

          // Advance step — loop back when fully drawn
          stepRef.current[arc.id] = step >= TOTAL_STEPS ? 0 : step + SPEED;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      arcs.forEach((arc) => {
        ["arc-glow-", "arc-line-"].forEach((prefix) => {
          if (map.getLayer(`${prefix}${arc.id}`)) map.removeLayer(`${prefix}${arc.id}`);
        });
        if (map.getSource(`arc-${arc.id}`)) map.removeSource(`arc-${arc.id}`);
      });

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [map]);
}
