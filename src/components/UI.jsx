// ─── SHARED UI COMPONENTS ────────────────────────────────────────────────────

export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: "#4a5080", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function FieldLabel({ children, error }) {
  return (
    <label style={{ fontSize: 12, color: error ? "#f87171" : "#8b9cf4", display: "block", marginBottom: 6, fontWeight: 500 }}>
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
          width: "100%", padding: "11px 14px", borderRadius: 10,
          background: "#12152e", border: `1.5px solid ${error ? "#f87171" : "#1e2140"}`,
          color: "#fff", fontSize: 14, outline: "none",
          boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = "#6c63ff"; }}
        onBlur={e => { if (!error) e.target.style.borderColor = "#1e2140"; }}
      />
      {error && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>⚠ {error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 4 }}>{hint}</div>}
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
          width: "100%", padding: "11px 14px", borderRadius: 10,
          background: "#12152e", border: "1.5px solid #1e2140",
          color: "#fff", fontSize: 14, outline: "none", resize: "vertical",
          boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
          lineHeight: 1.6,
        }}
        onFocus={e => e.target.style.borderColor = "#6c63ff"}
        onBlur={e => e.target.style.borderColor = "#1e2140"}
      />
      {hint && <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 4 }}>{hint}</div>}
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
          width: "100%", padding: "11px 14px", borderRadius: 10,
          background: "#12152e", border: "1.5px solid #1e2140",
          color: value ? "#fff" : "#3a3f6e", fontSize: 14, outline: "none",
          boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236c63ff' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: "#12152e" }}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, sublabel }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "#12152e", border: "1.5px solid #1e2140", borderRadius: 12,
      padding: "13px 16px", cursor: "pointer", color: "#fff", width: "100%",
      fontFamily: "inherit",
    }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: "#4a5080", marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{ width: 44, height: 24, borderRadius: 99, flexShrink: 0, background: checked ? "#6c63ff" : "#1e2140", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s" }} />
      </div>
    </button>
  );
}

export function ChoiceCard({ option, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? "linear-gradient(135deg,#3b3f8c,#4f46e5)" : "#12152e",
      border: `1.5px solid ${selected ? "#6c63ff" : "#1e2140"}`,
      borderRadius: 12, padding: "13px 16px", cursor: "pointer",
      textAlign: "left", color: "#fff", transition: "all 0.2s", width: "100%",
      boxShadow: selected ? "0 0 20px #6c63ff33" : "none", fontFamily: "inherit",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {option.icon && <span style={{ fontSize: 20 }}>{option.icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{option.label}</div>
          {option.desc && <div style={{ fontSize: 12, color: "#8b9cf4", marginTop: 2 }}>{option.desc}</div>}
          {option.price !== undefined && option.price > 0 && (
            <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 2 }}>₹{option.price.toLocaleString("en-IN")}</div>
          )}
        </div>
        {selected && <span style={{ color: "#a78bfa", fontSize: 16 }}>✓</span>}
      </div>
    </button>
  );
}

export function FeatureToggle({ option, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", gap: 12,
      background: checked ? "#1a1f4b" : "#0d1028",
      border: `1.5px solid ${checked ? "#6c63ff" : "#1e2140"}`,
      borderRadius: 10, padding: "10px 13px", cursor: "pointer",
      color: "#fff", textAlign: "left", transition: "all 0.2s", width: "100%",
      fontFamily: "inherit",
    }}>
      <span style={{ fontSize: 17 }}>{option.icon}</span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{option.label}</span>
      {option.price !== undefined && (
        <span style={{ fontSize: 12, color: "#a78bfa", marginRight: 6 }}>+₹{option.price.toLocaleString("en-IN")}</span>
      )}
      <span style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        background: checked ? "#6c63ff" : "transparent",
        border: `1.5px solid ${checked ? "#6c63ff" : "#3a3f6e"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
      </span>
    </button>
  );
}

export function PriceRow({ label, value, bold, big, color, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <div>
        <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 400, color: bold ? "#fff" : "#8b9cf4" }}>{label}</span>
        {sub && <div style={{ fontSize: 11, color: "#3a3f6e" }}>{sub}</div>}
      </div>
      <span style={{ fontSize: big ? 18 : 14, fontWeight: bold ? 800 : 500, color: color || (bold ? "#fff" : "#c4c9f0") }}>{value}</span>
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#0d1028", borderRadius: 16, padding: 20, border: "1px solid #1e2140", ...style }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#8b9cf4", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const styles = {
    primary: { background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#8b9cf4", border: "1.5px solid #1e2140" },
    danger: { background: "transparent", color: "#f87171", border: "1.5px solid #f87171" },
    success: { background: "transparent", color: "#34d399", border: "1.5px solid #34d399" },
    outline: { background: "transparent", color: "#a78bfa", border: "1.5px solid #6c63ff" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1, transition: "opacity 0.2s",
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Slider({ label, value, onChange, min = 0, max = 100, step = 5, format = v => `${v}%`, sublabel }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <FieldLabel>{label}</FieldLabel>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>{format(value)}</span>
      </div>
      {sublabel && <div style={{ fontSize: 11, color: "#3a3f6e", marginBottom: 8 }}>{sublabel}</div>}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#6c63ff", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#3a3f6e", marginTop: 4 }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export function CheckboxGroup({ label, options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(opt => {
          const active = selected.includes(opt.value);
          return (
            <button key={opt.value} onClick={() => toggle(opt.value)} style={{
              padding: "7px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${active ? "#6c63ff" : "#1e2140"}`,
              background: active ? "#1a1f4b" : "transparent",
              color: active ? "#a78bfa" : "#4a5080",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {opt.icon && <span style={{ marginRight: 5 }}>{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Divider({ style = {} }) {
  return <div style={{ borderTop: "1px solid #1e2140", margin: "20px 0", ...style }} />;
}

export function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#8b9cf4" }}>
        <span>Step {current} of {total}</span><span>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "#1e2140", borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6c63ff,#a78bfa)", borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export function ErrorBoundaryFallback({ error }) {
  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
      <div style={{ color: "#f87171", fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
      <div style={{ color: "#4a5080", fontSize: 13, marginBottom: 16 }}>{error?.message}</div>
      <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", borderRadius: 10, background: "#6c63ff", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Reload</button>
    </div>
  );
}