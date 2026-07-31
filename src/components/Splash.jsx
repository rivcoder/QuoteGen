import { useEffect, useState } from "react";
import logo from "../quotelogo.png";
import { C } from "./UI";

const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=logo, 2=text, 3=fadeout

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: C.base,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: ff, overflow: "hidden",
      opacity: phase === 3 ? 0 : 1,
      transition: "opacity 0.55s ease",
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        animation: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)",
        top: "30%", right: "20%",
      }} />

      {/* Logo */}
      <div style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
      }}>
        {/* Logo container with glow */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(124,58,237,0.4), 0 20px 40px rgba(0,0,0,0.4)",
          marginBottom: 28,
        }}>
          <img src={logo} alt="QuoteGen" style={{ width: 46, height: 46, objectFit: "contain" }} />
        </div>

        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s ease 0.1s",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 32, fontWeight: 800, letterSpacing: -1,
            background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", marginBottom: 8,
          }}>
            QuoteGen
          </div>
          <div style={{
            fontSize: 12, color: C.textMuted,
            letterSpacing: 3, textTransform: "uppercase", fontWeight: 500,
          }}>
            Professional Billing
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        position: "absolute", bottom: 48,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.4s ease",
      }}>
        <div style={{ width: 48, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
            width: phase >= 2 ? "100%" : "0%",
            transition: "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 0 8px rgba(124,58,237,0.6)",
          }} />
        </div>
      </div>
    </div>
  );
}