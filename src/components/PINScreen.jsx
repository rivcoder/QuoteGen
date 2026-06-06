import { useState } from "react";
import logo from "../quotelogo.png";
import { setPIN, verifyPIN, clearPIN } from "../utils/calculate";

function PINDots({ length, filled }) {
  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "28px 0" }}>
      {Array.from({ length }).map((_, i) => (
        <div key={i} style={{
          width: 16, height: 16, borderRadius: "50%",
          background: i < filled ? "#6c63ff" : "transparent",
          border: `2px solid ${i < filled ? "#6c63ff" : "#2a2f50"}`,
          transition: "all 0.15s ease",
          boxShadow: i < filled ? "0 0 10px #6c63ff88" : "none",
        }} />
      ))}
    </div>
  );
}

function PINPad({ onPress }) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 280, margin: "0 auto" }}>
      {keys.map((k, i) => (
        <button key={i} onClick={() => k && onPress(k)} disabled={!k} style={{
          height: 64, borderRadius: 14, border: "1.5px solid #1e2140",
          background: k ? "#0d1028" : "transparent",
          color: k === "⌫" ? "#6c63ff" : "#fff",
          fontSize: k === "⌫" ? 20 : 22, fontWeight: 700,
          cursor: k ? "pointer" : "default",
          fontFamily: "inherit",
          transition: "background 0.1s, transform 0.1s",
          opacity: k ? 1 : 0,
        }}
        onMouseDown={e => { if (k) e.currentTarget.style.background = "#1a1f4b"; }}
        onMouseUp={e => { if (k) e.currentTarget.style.background = "#0d1028"; }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// ── CREATE PIN ────────────────────────────────────────────────────────────────
export function CreatePIN({ onDone }) {
  const [step, setStep] = useState("create"); // "create" | "confirm"
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [error, setError] = useState("");
  const current = step === "create" ? first : second;

  const handlePress = (k) => {
    setError("");
    const setter = step === "create" ? setFirst : setSecond;
    const val = step === "create" ? first : second;
    if (k === "⌫") { setter(val.slice(0, -1)); return; }
    if (val.length >= 4) return;
    const next = val + k;
    setter(next);
    if (next.length === 4) {
      setTimeout(async () => {
        if (step === "create") {
          setStep("confirm");
        } else {
          if (next === first) {
            await setPIN(first);
            onDone();
          } else {
            setError("PINs don't match. Try again.");
            setFirst(""); setSecond(""); setStep("create");
          }
        }
      }, 300);
    }
  };

  return (
    <div style={screenStyle}>
      <img src={logo} alt="QuoteGen" style={{ width: 100, marginBottom: 24, objectFit: "contain" }} />
      <div style={titleStyle}>{step === "create" ? "Create a PIN" : "Confirm your PIN"}</div>
      <div style={subStyle}>{step === "create" ? "Set a 4-digit PIN to protect your quotes" : "Enter the same PIN again"}</div>
      <PINDots length={4} filled={current.length} />
      {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</div>}
      <PINPad onPress={handlePress} />
      <button onClick={onDone} style={skipStyle}>Skip for now</button>
    </div>
  );
}

// ── ENTER PIN ─────────────────────────────────────────────────────────────────
export function EnterPIN({ onSuccess }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handlePress = (k) => {
    setError("");
    if (k === "⌫") { setInput(p => p.slice(0, -1)); return; }
    if (input.length >= 4) return;
    const next = input + k;
    setInput(next);
    if (next.length === 4) {
      setTimeout(async () => {
        const correct = await verifyPIN(next);
        if (correct) {
          onSuccess();
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setInput("");
          if (newAttempts >= 5) {
            setError("Too many attempts. Clear PIN?");
          } else {
            setError(`Wrong PIN. ${5 - newAttempts} attempts left.`);
          }
        }
      }, 200);
    }
  };

  const handleClearPIN = () => {
    clearPIN();
    window.location.reload();
  };

  return (
    <div style={screenStyle}>
      <img src={logo} alt="QuoteGen" style={{ width: 100, marginBottom: 24, objectFit: "contain" }} />
      <div style={titleStyle}>Welcome back</div>
      <div style={subStyle}>Enter your PIN to continue</div>
      <div style={{
        transition: "transform 0.05s",
        transform: shake ? "translateX(8px)" : "translateX(0)",
      }}>
        <PINDots length={4} filled={input.length} />
      </div>
      {error && (
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>{error}</div>
          {attempts >= 5 && (
            <button onClick={handleClearPIN} style={{ ...skipStyle, color: "#f87171", borderColor: "#f87171" }}>
              Reset PIN & reload
            </button>
          )}
        </div>
      )}
      <PINPad onPress={handlePress} />
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const screenStyle = {
  minHeight: "100vh", background: "#080b1a",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  padding: "40px 24px",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const titleStyle = { fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" };
const subStyle = { fontSize: 13, color: "#4a5080", marginBottom: 4, textAlign: "center" };
const skipStyle = {
  marginTop: 28, background: "transparent", border: "1px solid #1e2140",
  color: "#4a5080", borderRadius: 10, padding: "8px 20px",
  cursor: "pointer", fontFamily: "inherit", fontSize: 12,
};