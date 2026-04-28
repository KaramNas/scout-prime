"use client";

import { useState } from "react";
import LebanonMap from "../components/LebanonMap";
import ResearchPanel from "../components/ResearchPanel";

export default function MapPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>({});

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <LebanonMap />

      <ResearchPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          style={{
            position: "fixed",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 28,
            background: "rgba(2,14,6,0.95)",
            border: "1px solid rgba(57,255,20,0.35)",
            borderLeft: "none",
            borderRadius: "0 6px 6px 0",
            color: "#39ff14",
            cursor: "pointer",
            padding: "1rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'Georgia', serif",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2 L8 6 L4 10" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            writingMode: "vertical-rl",
            fontSize: "0.45rem",
            letterSpacing: "0.2em",
            color: "rgba(57,255,20,0.7)",
          }}>
            RESEARCH
          </span>
        </button>
      )}
    </div>
  );
}