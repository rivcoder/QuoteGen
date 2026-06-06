import { useEffect, useState } from "react";
import logo from "../quotelogo.png";

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "out"

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#080b1a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "opacity 0.6s ease",
      opacity: phase === "out" ? 0 : 1,
    }}>
      {/* Glow behind logo */}
      <div style={{
        position: "absolute",
        width: 300, height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, #6c63ff18 0%, transparent 70%)",
        transition: "transform 1s ease, opacity 1s ease",
        transform: phase === "in" ? "scale(0.5)" : "scale(1.4)",
        opacity: phase === "in" ? 0 : 1,
      }} />

      {/* Logo */}
      <div style={{
        transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease",
        transform: phase === "in" ? "scale(0.7) translateY(20px)" : "scale(1) translateY(0)",
        opacity: phase === "in" ? 0 : 1,
        marginBottom: 32,
        position: "relative",
      }}>
        <img
          src={logo}
          alt="QuoteGen"
          style={{ width: 200, height: 200, objectFit: "contain" }}
        />
      </div>

      {/* Tagline */}
      <div style={{
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        opacity: phase === "in" ? 0 : 1,
        transform: phase === "in" ? "translateY(10px)" : "translateY(0)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 13, color: "#4a5080", letterSpacing: 3,
          textTransform: "uppercase", fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
          Billing. Made Simple.
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2, background: "#1e2140",
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
          transition: "width 2s ease",
          width: phase === "in" ? "0%" : phase === "hold" ? "80%" : "100%",
        }} />
      </div>
    </div>
  );
}