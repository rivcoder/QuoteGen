import { useState } from "react";
import logo from "../quotelogo.png";
import { C } from "./UI";

const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const MODES = [
  { id: "freelancer", icon: "🧑‍💻", title: "Freelancer",        desc: "Solo dev, designer, writer",         tags: ["Web Dev", "Design", "Content"] },
  { id: "agency",     icon: "🏢",   title: "Agency / Studio",   desc: "Small team or creative studio",      tags: ["Digital Agency", "Dev Shop"] },
  { id: "business",   icon: "👔",   title: "Consultant",         desc: "Coach, trainer, consultant",         tags: ["Consulting", "Coaching"] },
  { id: "contractor", icon: "🏗",   title: "Contractor",         desc: "Construction, interior, civil",      tags: ["Construction", "Interior"] },
  { id: "product",    icon: "🛒",   title: "Product Seller",     desc: "Physical or digital goods",          tags: ["E-commerce", "Wholesale"] },
  { id: "custom",     icon: "✏️",   title: "Custom",             desc: "Start from scratch your way",        tags: ["Any industry"] },
];

export default function ModeSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [hovering, setHovering] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", background: C.base,
      fontFamily: ff, display: "flex",
      flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: "fixed", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)",
        top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: "0 auto 20px",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 28px rgba(124,58,237,0.45)",
        }}>
          <img src={logo} alt="QuoteGen" style={{ width: 30, objectFit: "contain" }} />
        </div>

        <div style={{
          fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 10,
          background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Who are you?
        </div>
        <div style={{ fontSize: 14, color: C.textMuted, maxWidth: 380, lineHeight: 1.6 }}>
          QuoteGen will tailor pricing, services, and PDFs to match your type of work.
        </div>
      </div>

      {/* Mode grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10, maxWidth: 700, width: "100%", marginBottom: 28,
        position: "relative", zIndex: 1,
      }}>
        {MODES.map(m => {
          const isSelected = selected === m.id;
          const isHover    = hovering === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              onMouseEnter={() => setHovering(m.id)}
              onMouseLeave={() => setHovering(null)}
              style={{
                background: isSelected
                  ? "rgba(124,58,237,0.12)"
                  : isHover ? C.surfaceHigh : C.surface,
                border: `1px solid ${isSelected
                  ? "rgba(124,58,237,0.45)"
                  : isHover ? C.surfaceBorderHover : C.surfaceBorder}`,
                borderRadius: 12, padding: "18px 14px",
                cursor: "pointer", textAlign: "left",
                fontFamily: ff, transition: "all 0.18s",
                boxShadow: isSelected
                  ? `0 0 0 1px rgba(124,58,237,0.2), 0 8px 24px rgba(124,58,237,0.12)`
                  : isHover ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                {isSelected && (
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 10px rgba(124,58,237,0.5)",
                  }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5l2.5 2.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? C.accentLight : C.text, marginBottom: 4 }}>
                {m.title}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>
                {m.desc}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 10, fontWeight: 600,
                    background: isSelected ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.05)",
                    color: isSelected ? C.accentLight : C.textMuted,
                    borderRadius: 5, padding: "2px 7px",
                    border: `1px solid ${isSelected ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)"}`,
                    letterSpacing: 0.3,
                  }}>{t}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        style={{
          padding: "11px 36px", borderRadius: 9,
          border: "none",
          background: selected ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.05)",
          color: selected ? "#fff" : C.textMuted,
          fontSize: 14, fontWeight: 700,
          cursor: selected ? "pointer" : "not-allowed",
          fontFamily: ff, transition: "all 0.15s",
          boxShadow: selected ? "0 4px 20px rgba(124,58,237,0.4)" : "none",
          opacity: selected ? 1 : 0.5,
          position: "relative", zIndex: 1,
        }}
        onMouseEnter={e => { if (selected) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.45)"; } }}
        onMouseLeave={e => { if (selected) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; } }}
      >
        {selected ? `Continue as ${MODES.find(m => m.id === selected)?.title} →` : "Select a profile to continue"}
      </button>

      <div style={{ marginTop: 12, fontSize: 11, color: C.textMuted, position: "relative", zIndex: 1 }}>
        You can change this anytime from the sidebar
      </div>
    </div>
  );
}