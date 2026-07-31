// ─── DESIGN SYSTEM — Premium Dark ────────────────────────────────────────────
// Inspired by: Linear, Vercel, Raycast, Stripe
// Typography: Inter | Color: Deep space purple + emerald | Feel: Alive, crisp

export const C = {
  // Backgrounds
  base:          "#0a0a0f",   // page bg
  surface:       "#0f0f16",   // elevated card bg
  surfaceHigh:   "#16162a",   // higher card / hover
  surfaceBorder: "rgba(255,255,255,0.06)",
  surfaceBorderHover: "rgba(255,255,255,0.12)",

  // Text
  text:          "#f8fafc",
  textSub:       "#94a3b8",
  textMuted:     "#475569",

  // Accent
  accent:        "#7c3aed",
  accentLight:   "#a855f7",
  accentGlow:    "rgba(124,58,237,0.25)",
  accentGrad:    "linear-gradient(135deg, #7c3aed, #a855f7)",

  // Status
  success:       "#22c55e",
  successGlow:   "rgba(34,197,94,0.2)",
  danger:        "#ef4444",
  dangerGlow:    "rgba(239,68,68,0.2)",
  warning:       "#f59e0b",
  warningGlow:   "rgba(245,158,11,0.2)",

  // Legacy aliases (for existing components)
  bg:            "#0f0f16",
  bgSub:         "#0a0a0f",
  bgHover:       "#16162a",
  border:        "rgba(255,255,255,0.06)",
  borderStrong:  "rgba(255,255,255,0.12)",
};

// ── Shared styles ────────────────────────────────────────────────────────────
const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5, lineHeight: 1.2 }}>
        {children}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6, letterSpacing: 0.1 }}>{sub}</div>
      )}
    </div>
  );
}

export function FieldLabel({ children, error }) {
  return (
    <label style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
      textTransform: "uppercase",
      color: error ? C.danger : C.textMuted,
      display: "block", marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

export function TextInput({ label, value, onChange, placeholder, type = "text", error, hint }) {
  return (
    <div>
      {label && <FieldLabel error={error}>{label}</FieldLabel>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px",
          borderRadius: 8,
          border: `1px solid ${error ? C.danger : C.surfaceBorder}`,
          background: C.surface,
          color: C.text, fontSize: 14,
          outline: "none", boxSizing: "border-box",
          fontFamily: ff,
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: "none",
        }}
        onFocus={e => {
          e.target.style.borderColor = C.accent;
          e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`;
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? C.danger : C.surfaceBorder;
          e.target.style.boxShadow = "none";
        }}
      />
      {error && <div style={{ fontSize: 11, color: C.danger, marginTop: 5 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, hint }) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%", padding: "10px 14px",
          borderRadius: 8, border: `1px solid ${C.surfaceBorder}`,
          background: C.surface, color: C.text, fontSize: 14,
          outline: "none", resize: "vertical",
          boxSizing: "border-box", fontFamily: ff,
          lineHeight: 1.65, transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={e => {
          e.target.style.borderColor = C.accent;
          e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`;
        }}
        onBlur={e => {
          e.target.style.borderColor = C.surfaceBorder;
          e.target.style.boxShadow = "none";
        }}
      />
      {hint && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export function SelectInput({ label, value, onChange, options, hint }) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 36px 10px 14px",
          borderRadius: 8, border: `1px solid ${C.surfaceBorder}`,
          background: C.surface, color: value ? C.text : C.textMuted,
          fontSize: 14, outline: "none",
          boxSizing: "border-box", fontFamily: ff,
          cursor: "pointer", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={e => {
          e.target.style.borderColor = C.accent;
          e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`;
        }}
        onBlur={e => {
          e.target.style.borderColor = C.surfaceBorder;
          e.target.style.boxShadow = "none";
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: "#1a1a2e" }}>{opt.label}</option>
        ))}
      </select>
      {hint && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, sublabel }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: checked ? "rgba(124,58,237,0.08)" : C.surface,
      border: `1px solid ${checked ? "rgba(124,58,237,0.3)" : C.surfaceBorder}`,
      borderRadius: 10, padding: "12px 16px",
      cursor: "pointer", color: C.text, width: "100%",
      fontFamily: ff, transition: "all 0.2s",
    }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{sublabel}</div>}
      </div>
      {/* Toggle pill */}
      <div style={{
        width: 38, height: 21, borderRadius: 99, flexShrink: 0,
        background: checked ? C.accentGrad : "rgba(255,255,255,0.08)",
        position: "relative", transition: "background 0.2s",
        boxShadow: checked ? `0 0 10px ${C.accentGlow}` : "none",
      }}>
        <div style={{
          width: 15, height: 15, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: checked ? 20 : 3,
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }} />
      </div>
    </button>
  );
}

export function ChoiceCard({ option, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? "rgba(124,58,237,0.1)" : C.surface,
      border: `1px solid ${selected ? "rgba(124,58,237,0.4)" : C.surfaceBorder}`,
      borderRadius: 10, padding: "14px 16px",
      cursor: "pointer", textAlign: "left",
      color: C.text, width: "100%",
      fontFamily: ff, transition: "all 0.2s",
      boxShadow: selected ? `0 0 0 1px rgba(124,58,237,0.2), 0 4px 16px rgba(124,58,237,0.1)` : "none",
    }}
    onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = C.surfaceHigh; e.currentTarget.style.borderColor = C.surfaceBorderHover; } }}
    onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.surfaceBorder; } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {option.icon && <span style={{ fontSize: 18 }}>{option.icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{option.label}</div>
          {option.desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{option.desc}</div>}
          {option.price !== undefined && option.price > 0 && (
            <div style={{ fontSize: 12, color: C.accentLight, marginTop: 3, fontWeight: 600 }}>
              ₹{option.price.toLocaleString("en-IN")}
            </div>
          )}
        </div>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${selected ? C.accent : "rgba(255,255,255,0.15)"}`,
          background: selected ? C.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
          boxShadow: selected ? `0 0 8px ${C.accentGlow}` : "none",
        }}>
          {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
        </div>
      </div>
    </button>
  );
}

export function FeatureToggle({ option, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", gap: 12,
      background: checked ? "rgba(124,58,237,0.08)" : C.surface,
      border: `1px solid ${checked ? "rgba(124,58,237,0.3)" : C.surfaceBorder}`,
      borderRadius: 10, padding: "11px 14px",
      cursor: "pointer", color: C.text,
      textAlign: "left", width: "100%",
      fontFamily: ff, transition: "all 0.18s",
    }}
    onMouseEnter={e => { if (!checked) { e.currentTarget.style.background = C.surfaceHigh; e.currentTarget.style.borderColor = C.surfaceBorderHover; } }}
    onMouseLeave={e => { if (!checked) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.surfaceBorder; } }}
    >
      <span style={{ fontSize: 16 }}>{option.icon}</span>
      <span style={{ flex: 1, fontSize: 13, color: C.text, fontWeight: 500 }}>{option.label}</span>
      {option.price !== undefined && (
        <span style={{ fontSize: 12, color: C.textMuted, marginRight: 10 }}>
          +₹{option.price.toLocaleString("en-IN")}
        </span>
      )}
      <div style={{
        width: 16, height: 16, borderRadius: 5, flexShrink: 0,
        border: `2px solid ${checked ? C.accent : "rgba(255,255,255,0.15)"}`,
        background: checked ? C.accent : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
        boxShadow: checked ? `0 0 8px ${C.accentGlow}` : "none",
      }}>
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

export function PriceRow({ label, value, bold, big, color, sub }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "baseline", padding: "8px 0",
      borderBottom: `1px solid ${C.surfaceBorder}`,
    }}>
      <div>
        <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 600 : 400, color: bold ? C.text : C.textSub }}>
          {label}
        </span>
        {sub && <div style={{ fontSize: 11, color: C.textMuted }}>{sub}</div>}
      </div>
      <span style={{
        fontSize: big ? 18 : 13, fontWeight: bold ? 700 : 400,
        color: color || (bold ? C.text : C.textSub),
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </span>
    </div>
  );
}

export function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: 12,
      border: `1px solid ${C.surfaceBorder}`,
      padding: 20,
      boxShadow: glow ? `0 0 30px ${C.accentGlow}` : "0 1px 3px rgba(0,0,0,0.3)",
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: C.textMuted,
      marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8
    }}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const variants = {
    primary:  { background: C.accentGrad, color: "#fff", border: "none", boxShadow: `0 4px 14px ${C.accentGlow}` },
    ghost:    { background: "transparent", color: C.textSub, border: `1px solid ${C.surfaceBorder}` },
    danger:   { background: "transparent", color: C.danger, border: `1px solid rgba(239,68,68,0.3)` },
    success:  { background: "transparent", color: C.success, border: `1px solid rgba(34,197,94,0.3)` },
    outline:  { background: "transparent", color: C.text, border: `1px solid ${C.surfaceBorderHover}` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: ff,
        opacity: disabled ? 0.4 : 1, transition: "opacity 0.15s, transform 0.1s, box-shadow 0.15s",
        ...variants[variant], ...style,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      {children}
    </button>
  );
}

export function Slider({ label, value, onChange, min = 0, max = 100, step = 5, format = v => `${v}%`, sublabel }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-end" }}>
        <FieldLabel>{label}</FieldLabel>
        <span style={{
          fontSize: 14, fontWeight: 700, color: C.accentLight,
          background: "rgba(124,58,237,0.15)", padding: "2px 10px",
          borderRadius: 6, letterSpacing: -0.3,
        }}>{format(value)}</span>
      </div>
      {sublabel && <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{sublabel}</div>}
      <div style={{ position: "relative", padding: "4px 0" }}>
        <div style={{
          height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)",
          position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)"
        }} />
        <div style={{
          height: 6, borderRadius: 99, background: C.accentGrad,
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: `${pct}%`, transition: "width 0.1s",
          boxShadow: `0 0 8px ${C.accentGlow}`,
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "relative", zIndex: 2, width: "100%", margin: 0 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginTop: 4 }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export function CheckboxGroup({ label, options, selected, onChange }) {
  const toggle = val =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => {
          const active = selected.includes(opt.value);
          return (
            <button key={opt.value} onClick={() => toggle(opt.value)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: `1px solid ${active ? "rgba(124,58,237,0.4)" : C.surfaceBorder}`,
              background: active ? "rgba(124,58,237,0.12)" : C.surface,
              color: active ? C.accentLight : C.textSub,
              cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
              boxShadow: active ? `0 0 10px ${C.accentGlow}` : "none",
            }}>
              {opt.icon && <span style={{ marginRight: 6 }}>{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Divider({ style = {} }) {
  return <div style={{ borderTop: `1px solid ${C.surfaceBorder}`, margin: "16px 0", ...style }} />;
}

export function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: C.textMuted }}>
        <span>Step {current} of {total}</span><span style={{ color: C.accentLight, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: C.accentGrad, borderRadius: 99, transition: "width 0.4s", boxShadow: `0 0 8px ${C.accentGlow}` }} />
      </div>
    </div>
  );
}

export function ErrorBoundaryFallback({ error }) {
  return (
    <div style={{ padding: 48, textAlign: "center", fontFamily: ff }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 14, color: C.danger, fontWeight: 600, marginBottom: 8 }}>Something went wrong</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>{error?.message}</div>
      <Btn onClick={() => window.location.reload()}>Reload</Btn>
    </div>
  );
}