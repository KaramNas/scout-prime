"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type FilterCategory = {
  id: string;
  label: string;
  icon: string;
  color: string;
  count: number;
};

type ResearchPanelProps = {
  open: boolean;
  onClose: () => void;
  filters: Record<string, boolean>;
  onFilterChange: (filters: Record<string, boolean>) => void;
};

// ── Filter categories — extend these as cubs add more research types ───────
const CATEGORIES: FilterCategory[] = [
  { id: "birds", label: "Bird Life", icon: "🦅", color: "#00e5ff", count: 0 },
  { id: "plants", label: "Plant Life", icon: "🌿", color: "#39ff14", count: 0 },
  { id: "mammals", label: "Mammals", icon: "🦊", color: "#ffab00", count: 0 },
  { id: "insects", label: "Insects", icon: "🐛", color: "#c6ff00", count: 0 },
  { id: "reptiles", label: "Reptiles", icon: "🦎", color: "#ff6d00", count: 0 },
  { id: "pollution", label: "Pollution", icon: "⚠️", color: "#ff4444", count: 0 },
  { id: "water", label: "Water Sources", icon: "💧", color: "#00bcd4", count: 0 },
  { id: "soil", label: "Soil Samples", icon: "🪨", color: "#8d6e63", count: 0 },
  { id: "weather", label: "Weather Data", icon: "🌤️", color: "#b0bec5", count: 0 },
  { id: "landmarks", label: "Landmarks", icon: "📍", color: "#ff4488", count: 0 },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function ResearchPanel({
  open,
  onClose,
  filters,
  onFilterChange,
}: ResearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"filters" | "cubs" | "stats" | "Create Entry">("filters");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const toggleFilter = (id: string) => {
    onFilterChange({ ...filters, [id]: !filters[id] });
  };

  const enableAll = () => {
    const all: Record<string, boolean> = {};
    CATEGORIES.forEach((c) => (all[c.id] = true));
    onFilterChange(all);
  };

  const clearAll = () => {
    const none: Record<string, boolean> = {};
    CATEGORIES.forEach((c) => (none[c.id] = false));
    onFilterChange(none);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;
  const filteredCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes panelSlideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes panelSlideOut {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes scanH {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(700px); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 8px rgba(57,255,20,0.3); }
          50%     { box-shadow: 0 0 18px rgba(57,255,20,0.7); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cornerSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .rp-filter-btn:hover {
          background: rgba(57,255,20,0.08) !important;
          border-color: rgba(57,255,20,0.5) !important;
          transform: translateX(4px);
        }
        .rp-filter-btn {
          transition: all 0.18s ease;
        }
        .rp-tab:hover {
          color: #39ff14 !important;
          background: rgba(57,255,20,0.06) !important;
        }
        .rp-close:hover {
          background: rgba(255,60,60,0.15) !important;
          border-color: rgba(255,80,80,0.5) !important;
          color: #ff4444 !important;
        }
        .rp-input:focus {
          outline: none;
          border-color: rgba(57,255,20,0.6) !important;
          box-shadow: 0 0 12px rgba(57,255,20,0.2);
        }
        .rp-action:hover {
          background: rgba(57,255,20,0.15) !important;
          transform: translateY(-1px);
        }
        .rp-action {
          transition: all 0.15s ease;
        }
      `}</style>

      {/* ── Backdrop ── */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 29,
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(1px)",
          }}
        />
      )}

      {/* ── Panel ── */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: "40vw",
          minWidth: "340px",
          maxWidth: "520px",
          zIndex: 30,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          opacity: open ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, rgba(2,14,6,0.97) 0%, rgba(1,10,4,0.98) 100%)",
          borderRight: "1px solid rgba(57,255,20,0.25)",
          boxShadow: "4px 0 40px rgba(0,0,0,0.6), inset -1px 0 0 rgba(57,255,20,0.08)",
          fontFamily: "'Georgia', serif",
          overflow: "hidden",
        }}
      >
        {/* ── Scanline effect ── */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0,
          height: "2px", zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(57,255,20,0.3), transparent)",
          animation: "scanH 6s linear infinite",
        }} />

        {/* ── Corner decorations ── */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          width: 16, height: 16, pointerEvents: "none",
          borderTop: "2px solid rgba(57,255,20,0.6)",
          borderLeft: "2px solid rgba(57,255,20,0.6)",
        }} />
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 16, height: 16, pointerEvents: "none",
          borderTop: "2px solid rgba(57,255,20,0.3)",
          borderRight: "2px solid rgba(57,255,20,0.3)",
        }} />
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          width: 16, height: 16, pointerEvents: "none",
          borderBottom: "2px solid rgba(57,255,20,0.3)",
          borderLeft: "2px solid rgba(57,255,20,0.3)",
        }} />
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          width: 16, height: 16, pointerEvents: "none",
          borderBottom: "2px solid rgba(57,255,20,0.15)",
          borderRight: "2px solid rgba(57,255,20,0.15)",
        }} />

        {/* ── Header ── */}
        <div style={{
          padding: "1.4rem 1.4rem 0",
          borderBottom: "1px solid rgba(57,255,20,0.12)",
          paddingBottom: "1rem",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
            <div>
              <div style={{
                fontSize: "0.5rem", letterSpacing: "0.35em",
                color: "rgba(57,255,20,0.6)", marginBottom: "0.3rem",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span style={{
                  display: "inline-block", width: 6, height: 6,
                  borderRadius: "50%", background: "#39ff14",
                  animation: "blink 1.4s ease infinite",
                }} />
                SCOUTS FIELD RESEARCH
              </div>
              <div style={{
                fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.12em",
                color: "#39ff14", lineHeight: 1,
                textShadow: "0 0 20px rgba(57,255,20,0.4)",
              }}>
                RESEARCH PANEL
              </div>
              <div style={{
                fontSize: "0.55rem", letterSpacing: "0.15em",
                color: "rgba(57,255,20,0.4)", marginTop: "0.25rem",
              }}>
                {activeCount > 0
                  ? `${activeCount} FILTER${activeCount > 1 ? "S" : ""} ACTIVE`
                  : "NO FILTERS ACTIVE — SHOWING ALL"}
              </div>
            </div>

            {/* Close button */}
            <button
              className="rp-close"
              onClick={onClose}
              style={{
                background: "rgba(255,60,60,0.08)",
                border: "1px solid rgba(255,60,60,0.25)",
                borderRadius: "4px",
                color: "rgba(255,100,100,0.7)",
                cursor: "pointer",
                padding: "6px 10px",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                transition: "all 0.15s ease",
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px" }}>
            {(["filters", "cubs", "stats", "Create Entry"] as const).map((tab) => (
              <button
                key={tab}
                className="rp-tab"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  background: activeTab === tab
                    ? "rgba(57,255,20,0.1)"
                    : "transparent",
                  border: "none",
                  borderBottom: activeTab === tab
                    ? "2px solid #39ff14"
                    : "2px solid transparent",
                  color: activeTab === tab
                    ? "#39ff14"
                    : "rgba(57,255,20,0.35)",
                  cursor: "pointer",
                  padding: "0.5rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  transition: "all 0.15s ease",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "1rem 1.4rem",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(57,255,20,0.2) transparent",
        }}>

          {/* FILTERS TAB */}
          {activeTab === "filters" && (
            <div style={{ animation: "fadeSlideUp 0.25s ease" }}>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <span style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(57,255,20,0.4)", fontSize: "0.7rem",
                }}>⌕</span>
                <input
                  className="rp-input"
                  placeholder="SEARCH CATEGORIES…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(57,255,20,0.04)",
                    border: "1px solid rgba(57,255,20,0.2)",
                    borderRadius: "4px",
                    color: "#39ff14",
                    padding: "0.5rem 0.5rem 0.5rem 2rem",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    fontFamily: "'Georgia', serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s ease",
                  }}
                />
              </div>

              {/* Quick actions */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
                <button className="rp-action" onClick={enableAll} style={{
                  flex: 1,
                  background: "rgba(57,255,20,0.07)",
                  border: "1px solid rgba(57,255,20,0.25)",
                  borderRadius: "4px",
                  color: "rgba(57,255,20,0.8)",
                  cursor: "pointer",
                  padding: "0.4rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  fontFamily: "'Georgia', serif",
                }}>
                  ENABLE ALL
                </button>
                <button className="rp-action" onClick={clearAll} style={{
                  flex: 1,
                  background: "rgba(255,60,60,0.05)",
                  border: "1px solid rgba(255,60,60,0.2)",
                  borderRadius: "4px",
                  color: "rgba(255,100,100,0.7)",
                  cursor: "pointer",
                  padding: "0.4rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  fontFamily: "'Georgia', serif",
                }}>
                  CLEAR ALL
                </button>
              </div>

              {/* Divider label */}
              <div style={{
                fontSize: "0.48rem", letterSpacing: "0.3em",
                color: "rgba(57,255,20,0.3)",
                marginBottom: "0.6rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
                RESEARCH CATEGORIES
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
              </div>

              {/* Category filter buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredCategories.map((cat) => {
                  const isActive = !!filters[cat.id];
                  const isHovered = hoveredCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className="rp-filter-btn"
                      onClick={() => toggleFilter(cat.id)}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: isActive
                          ? `rgba(${hexToRgb(cat.color)},0.12)`
                          : "rgba(57,255,20,0.02)",
                        border: isActive
                          ? `1px solid ${cat.color}66`
                          : "1px solid rgba(57,255,20,0.1)",
                        borderRadius: "6px",
                        padding: "0.65rem 0.8rem",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: isActive
                          ? `0 0 12px rgba(${hexToRgb(cat.color)},0.15)`
                          : "none",
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: "3px",
                          background: cat.color,
                          boxShadow: `0 0 8px ${cat.color}`,
                        }} />
                      )}

                      {/* Icon */}
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{cat.icon}</span>

                      {/* Label + count */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: isActive ? cat.color : "rgba(57,255,20,0.55)",
                          fontWeight: isActive ? 600 : 400,
                        }}>
                          {cat.label.toUpperCase()}
                        </div>
                        <div style={{
                          fontSize: "0.5rem",
                          letterSpacing: "0.08em",
                          color: "rgba(57,255,20,0.25)",
                          marginTop: "2px",
                        }}>
                          {cat.count} ENTRIES ON MAP
                        </div>
                      </div>

                      {/* Toggle indicator */}
                      <div style={{
                        width: 28, height: 14,
                        borderRadius: 7,
                        background: isActive
                          ? cat.color
                          : "rgba(57,255,20,0.08)",
                        border: isActive
                          ? `1px solid ${cat.color}`
                          : "1px solid rgba(57,255,20,0.2)",
                        position: "relative",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                        boxShadow: isActive ? `0 0 8px ${cat.color}88` : "none",
                      }}>
                        <div style={{
                          position: "absolute",
                          top: 2, left: isActive ? 14 : 2,
                          width: 8, height: 8,
                          borderRadius: "50%",
                          background: isActive ? "#020d04" : "rgba(57,255,20,0.3)",
                          transition: "left 0.2s ease",
                        }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CUBS TAB */}
          {activeTab === "cubs" && (
            <div style={{ animation: "fadeSlideUp 0.25s ease" }}>
              <div style={{
                fontSize: "0.48rem", letterSpacing: "0.3em",
                color: "rgba(57,255,20,0.3)",
                marginBottom: "1rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
                REGISTERED CUBS
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
              </div>

              {/* Placeholder — cubs will be populated from data */}
              <div style={{
                border: "1px dashed rgba(57,255,20,0.15)",
                borderRadius: "8px",
                padding: "2rem 1rem",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧭</div>
                <div style={{
                  fontSize: "0.6rem", letterSpacing: "0.15em",
                  color: "rgba(57,255,20,0.4)",
                  marginBottom: "0.3rem",
                }}>
                  NO CUBS REGISTERED YET
                </div>
                <div style={{
                  fontSize: "0.5rem", letterSpacing: "0.08em",
                  color: "rgba(57,255,20,0.2)",
                  lineHeight: 1.8,
                }}>
                  Cubs will appear here once they<br />
                  submit their first field entry
                </div>
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div style={{ animation: "fadeSlideUp 0.25s ease" }}>
              <div style={{
                fontSize: "0.48rem", letterSpacing: "0.3em",
                color: "rgba(57,255,20,0.3)",
                marginBottom: "1rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
                FIELD STATISTICS
                <div style={{ flex: 1, height: 1, background: "rgba(57,255,20,0.1)" }} />
              </div>

              {/* Stat cards */}
              {[
                { label: "Total Entries", value: "0", icon: "📊", color: "#39ff14" },
                { label: "Active Cubs", value: "0", icon: "👦", color: "#00e5ff" },
                { label: "Zones Covered", value: "0", icon: "🗺️", color: "#ffab00" },
                { label: "Species Logged", value: "0", icon: "🌿", color: "#c6ff00" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "rgba(57,255,20,0.03)",
                  border: "1px solid rgba(57,255,20,0.1)",
                  borderRadius: "6px",
                  padding: "0.8rem",
                  marginBottom: "6px",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{stat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "0.5rem", letterSpacing: "0.15em",
                      color: "rgba(57,255,20,0.35)",
                    }}>
                      {stat.label.toUpperCase()}
                    </div>
                    <div style={{
                      fontSize: "1.4rem", fontWeight: 300,
                      color: stat.color,
                      textShadow: `0 0 12px ${stat.color}66`,
                      lineHeight: 1.2,
                    }}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state note */}
              <div style={{
                marginTop: "1rem",
                padding: "0.8rem",
                border: "1px dashed rgba(57,255,20,0.1)",
                borderRadius: "6px",
                fontSize: "0.5rem",
                letterSpacing: "0.08em",
                color: "rgba(57,255,20,0.25)",
                lineHeight: 1.8,
                textAlign: "center",
              }}>
                Statistics will populate as cubs<br />
                submit field research entries
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "0.8rem 1.4rem",
          borderTop: "1px solid rgba(57,255,20,0.1)",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontSize: "0.48rem", letterSpacing: "0.15em",
            color: "rgba(57,255,20,0.2)",
          }}>
            SCOUTS FIELD RESEARCH PLATFORM
          </div>
          <div style={{
            fontSize: "0.48rem", letterSpacing: "0.12em",
            color: "rgba(57,255,20,0.2)",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            <span style={{
              display: "inline-block", width: 4, height: 4,
              borderRadius: "50%", background: "#39ff14",
              animation: "blink 2s ease infinite",
            }} />
            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </>
  );
}

// ── Helper — converts hex color to "r,g,b" string for rgba() usage ─────────
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
