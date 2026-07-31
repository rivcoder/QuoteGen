import { useState } from "react";
import logo from "../quotelogo.png";
import { setPIN, verifyPIN, clearPIN } from "../utils/calculate";
import { C } from "./UI";

const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function FullPageWrapper({ children }) {
  return (
    <div style={{
      minHeight: "100vh", background: C.base,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", fontFamily: ff,
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

function PINDots({ length, filled, shake }) {
  return (
    <div style={{
      display: "flex", gap: 14, justifyContent: "center", margin: "28px 0",
      transform: shake ? "translateX(6px)" : "none",
      transition: "transform 0.05s",
    }}>
      {Array.from({ length }).map((_, i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: "50%",
          background: i < filled
            ? "linear-gradient(135deg, #7c3aed, #a855f7)"
            : "transparent",
          border: `2px solid ${i < filled ? C.accent : "rgba(255,255,255,0.15)"}`,
          transition: "all 0.15s",
          boxShadow: i < filled ? `0 0 10px ${C.accentGlow}` : "none",
        }} />
      ))}
    </div>
  );
}

function PINPad({ onPress }) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, width: "100%" }}>
      {keys.map((k, i) => (
        <button key={i} onClick={() => k && onPress(k)} disabled={!k} style={{
          height: 58, borderRadius: 10,
          border: k ? `1px solid ${C.surfaceBorder}` : "none",
          background: k ? C.surface : "transparent",
          color: k === "⌫" ? C.textMuted : C.text,
          fontSize: k === "⌫" ? 20 : 22, fontWeight: k === "⌫" ? 400 : 500,
          cursor: k ? "pointer" : "default",
          fontFamily: ff, opacity: k ? 1 : 0,
          transition: "background 0.1s, transform 0.08s",
        }}
        onMouseDown={e => { if (k) { e.currentTarget.style.background = C.surfaceHigh; e.currentTarget.style.transform = "scale(0.95)"; } }}
        onMouseUp={e => { if (k) { e.currentTarget.style.background = C.surface; e.currentTarget.style.transform = "scale(1)"; } }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// ── Create PIN ─────────────────────────────────────────────────────────────────
export function CreatePIN({ onDone }) {
  const [step, setStep]     = useState("create");
  const [first, setFirst]   = useState("");
  const [second, setSecond] = useState("");
  const [error, setError]   = useState("");
  const current = step === "create" ? first : second;

  const handlePress = (k) => {
    setError("");
    const val  = step === "create" ? first : second;
    const setF = step === "create" ? setFirst : setSecond;
    if (k === "⌫") { setF(val.slice(0, -1)); return; }
    if (val.length >= 4) return;
    const next = val + k;
    setF(next);
    if (next.length === 4) {
      setTimeout(async () => {
        if (step === "create") { setStep("confirm"); }
        else if (next === first) { await setPIN(first); onDone(); }
        else { setError("PINs don't match — try again."); setFirst(""); setSecond(""); setStep("create"); }
      }, 300);
    }
  };

  return (
    <FullPageWrapper>
      {/* Logo */}
      <div style={{
        width: 56, height: 56, borderRadius: 14, marginBottom: 28,
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 30px rgba(124,58,237,0.4)",
      }}>
        <img src={logo} alt="QuoteGen" style={{ width: 34, objectFit: "contain" }} />
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, textAlign: "center", marginBottom: 6, letterSpacing: -0.5 }}>
        {step === "create" ? "Create a PIN" : "Confirm PIN"}
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 4 }}>
        {step === "create" ? "Set a 4-digit PIN to protect your quotes" : "Re-enter your PIN to confirm"}
      </div>

      <PINDots length={4} filled={current.length} />
      {error && (
        <div style={{
          fontSize: 12, color: C.danger, marginBottom: 14, textAlign: "center",
          background: C.dangerGlow, padding: "6px 16px", borderRadius: 6,
          border: `1px solid rgba(239,68,68,0.2)`,
        }}>{error}</div>
      )}

      <PINPad onPress={handlePress} />

      <button onClick={onDone} style={{
        marginTop: 24, background: "transparent", border: "none",
        color: C.textMuted, fontSize: 13, cursor: "pointer", fontFamily: ff,
        textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.1)",
      }}>
        Skip for now
      </button>
    </FullPageWrapper>
  );
}

// ── Enter PIN ──────────────────────────────────────────────────────────────────
export function EnterPIN({ onSuccess }) {
  const [input, setInput]       = useState("");
  const [error, setError]       = useState("");
  const [shake, setShake]       = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handlePress = (k) => {
    setError("");
    if (k === "⌫") { setInput(p => p.slice(0, -1)); return; }
    if (input.length >= 4) return;
    const next = input + k;
    setInput(next);
    if (next.length === 4) {
      setTimeout(async () => {
        const ok = await verifyPIN(next);
        if (ok) { onSuccess(); return; }
        const n = attempts + 1;
        setAttempts(n);
        setShake(true); setTimeout(() => setShake(false), 400);
        setInput("");
        setError(n >= 5 ? "Too many attempts." : `Incorrect PIN. ${5 - n} attempt${5 - n !== 1 ? "s" : ""} left.`);
      }, 200);
    }
  };

  return (
    <FullPageWrapper>
      <div style={{
        width: 56, height: 56, borderRadius: 14, marginBottom: 28,
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 30px rgba(124,58,237,0.4)",
      }}>
        <img src={logo} alt="QuoteGen" style={{ width: 34, objectFit: "contain" }} />
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, textAlign: "center", marginBottom: 6, letterSpacing: -0.5 }}>
        Welcome back
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 4 }}>
        Enter your PIN to unlock QuoteGen
      </div>

      <PINDots length={4} filled={input.length} shake={shake} />
      {error && (
        <div style={{
          fontSize: 12, color: C.danger, marginBottom: 14, textAlign: "center",
          background: C.dangerGlow, padding: "6px 16px", borderRadius: 6,
          border: `1px solid rgba(239,68,68,0.2)`,
        }}>{error}</div>
      )}

      <PINPad onPress={handlePress} />

      {attempts >= 5 && (
        <button onClick={() => { clearPIN(); window.location.reload(); }} style={{
          marginTop: 20, background: "transparent",
          border: `1px solid rgba(239,68,68,0.3)`, color: C.danger,
          fontSize: 12, cursor: "pointer", fontFamily: ff,
          padding: "7px 16px", borderRadius: 7, transition: "all 0.15s",
        }}>
          Reset PIN
        </button>
      )}
    </FullPageWrapper>
  );
}