import { useState, Component } from "react";
import { loadFreelancerProfile, getPIN } from "./utils/calculate";
import { MODE_LABELS, MODE_ICONS, findModeForService } from "./data/pricingLoader";
import { ErrorBoundaryFallback, C } from "./components/UI";
import logo from "./quotelogo.png";

import ClientPortal from "./components/ClientPortal";
import Splash from "./components/Splash";
import ModeSelector from "./components/ModeSelector";
import { CreatePIN, EnterPIN } from "./components/PINScreen";

import FreelancerProfile from "./sections/FreelancerProfile";
import ClientInfo from "./sections/ClientInfo";
import ProjectDetails from "./sections/ProjectDetails";
import PricingSection from "./sections/PricingSection";
import PaymentTerms from "./sections/PaymentTerms";
import Milestones from "./sections/Milestones";
import TermsConditions from "./sections/TermsConditions";
import PreviewExport from "./sections/PreviewExport";
import Templates from "./sections/Templates";
import QuoteHistory from "./components/QuoteHistory";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
  render() { return this.state.hasError ? <ErrorBoundaryFallback error={this.state.error} /> : this.props.children; }
}

const NAV = [
  { id: "profile",    label: "My Profile",        icon: "◈",  group: "setup"  },
  { id: "client",     label: "Client Info",        icon: "⊕",  group: "quote"  },
  { id: "project",    label: "Project Details",    icon: "⊞",  group: "quote"  },
  { id: "pricing",    label: "Pricing",            icon: "◇",  group: "quote"  },
  { id: "payment",    label: "Payment Terms",      icon: "⊟",  group: "quote"  },
  { id: "milestones", label: "Milestones",         icon: "◎",  group: "quote"  },
  { id: "terms",      label: "Terms & Conditions", icon: "≡",  group: "quote"  },
  { id: "preview",    label: "Preview & Export",   icon: "↗",  group: "export" },
  { id: "templates",  label: "Templates",          icon: "⊟",  group: "tools"  },
  { id: "history",    label: "Quote History",      icon: "⊙",  group: "tools"  },
];

const GROUPS = [
  { id: "setup",  label: "Setup"  },
  { id: "quote",  label: "Build"  },
  { id: "export", label: "Export" },
  { id: "tools",  label: "Tools"  },
];

const DEFAULT_ANSWERS = {
  service: null, baseType: null, pages: null,
  revisions: "2", timeline: "standard",
  currency: "INR", discount: false, discountPct: 0,
  includeGst: false, advancePct: 50,
  lineItems: [], milestones: [], platforms: [], paymentMethods: [],
};

const MODE_KEY = "quotegen_mode";
const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function App() {
  if (window.location.hash.length > 1) return <ClientPortal />;

  const storedPIN = getPIN();
  const savedMode = localStorage.getItem(MODE_KEY);

  const [screen,  setScreen]  = useState("splash");
  const [mode,    setMode]    = useState(savedMode || null);
  const [active,  setActive]  = useState("profile");
  const [answers, setAnswers] = useState(() => ({
    ...DEFAULT_ANSWERS,
    mode: savedMode || "freelancer",
  }));
  const [profile, setProfile] = useState(() => loadFreelancerProfile());

  const handleSplashDone = () => {
    if (storedPIN)  { setScreen("pin_enter"); return; }
    if (!savedMode) { setScreen("pin_create"); return; }
    setScreen("app");
  };
  const handlePINDone    = () => { if (!savedMode) setScreen("mode"); else setScreen("app"); };
  const handleModeSelect = (m) => {
    localStorage.setItem(MODE_KEY, m);
    setMode(m);
    setAnswers(a => ({ ...a, mode: m }));
    setScreen("app");
  };
  const handleNewQuote       = () => { setAnswers({ ...DEFAULT_ANSWERS, mode }); setActive("client"); };
  const handleLoadTemplate   = (ta) => {
    const nm = ta.mode || findModeForService(ta.service) || mode;
    if (nm && nm !== mode) { localStorage.setItem(MODE_KEY, nm); setMode(nm); }
    setAnswers({ ...DEFAULT_ANSWERS, ...ta, mode: nm }); setActive("pricing");
  };
  const handleLoadHistory = (itemOrAnswers) => {
    // Support both: full history item { answers, currency, ... } and raw answers object
    const ta = itemOrAnswers?.answers || itemOrAnswers || {};
    // Inherit top-level currency if not inside answers
    if (!ta.currency && itemOrAnswers?.currency) ta.currency = itemOrAnswers.currency;
    const nm = ta.mode || findModeForService(ta.service) || mode;
    if (nm && nm !== mode) { localStorage.setItem(MODE_KEY, nm); setMode(nm); }
    setAnswers({ ...DEFAULT_ANSWERS, ...ta, mode: nm || mode });
    setActive("preview");
  };

  const renderSection = () => {
    switch (active) {
      case "profile":    return <FreelancerProfile profile={profile} setProfile={setProfile} />;
      case "client":     return <ClientInfo answers={answers} setAnswers={setAnswers} />;
      case "project":    return <ProjectDetails answers={answers} setAnswers={setAnswers} />;
      case "pricing":    return <PricingSection answers={answers} setAnswers={setAnswers} mode={mode} />;
      case "payment":    return <PaymentTerms answers={answers} setAnswers={setAnswers} />;
      case "milestones": return <Milestones answers={answers} setAnswers={setAnswers} />;
      case "terms":      return <TermsConditions answers={answers} setAnswers={setAnswers} />;
      case "preview":    return <PreviewExport answers={answers} setAnswers={setAnswers} profile={profile} onNew={handleNewQuote} setActive={setActive} />;
      case "templates":  return <Templates answers={answers} setAnswers={setAnswers} onLoad={handleLoadTemplate} />;
      case "history":    return <QuoteHistory onClose={() => setActive("client")} onLoadQuote={handleLoadHistory} />;
      default: return null;
    }
  };

  if (screen === "splash")     return <Splash onDone={handleSplashDone} />;
  if (screen === "pin_create") return <CreatePIN onDone={handlePINDone} />;
  if (screen === "pin_enter")  return <EnterPIN onSuccess={handlePINDone} />;
  if (screen === "mode")       return <ModeSelector onSelect={handleModeSelect} />;

  const activeIndex = NAV.findIndex(n => n.id === active);
  const currentNav  = NAV[activeIndex];
  const modeLabel   = MODE_LABELS[mode] || "Freelancer";
  const modeIcon    = MODE_ICONS[mode]  || "🧑‍💻";
  const progress    = Math.round(((activeIndex + 1) / NAV.length) * 100);

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: C.base, fontFamily: ff,
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: "fixed", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
        top: -200, left: -100, pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)",
        bottom: -100, right: 100, pointerEvents: "none", zIndex: 0,
      }} />

      {/* ─── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: 232, flexShrink: 0,
        background: C.surface,
        borderRight: `1px solid ${C.surfaceBorder}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto", zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.surfaceBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: C.accentGrad, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${C.accentGlow}`,
            }}>
              <img src={logo} alt="QuoteGen" style={{ width: 20, height: 20, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>QuoteGen</div>
              <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.3 }}>QUOTE BUILDER</div>
            </div>
          </div>

          {/* Mode Switcher */}
          <button onClick={() => setScreen("mode")} style={{
            width: "100%", padding: "8px 10px", borderRadius: 8,
            border: `1px solid ${C.surfaceBorder}`, background: C.surfaceHigh,
            cursor: "pointer", fontFamily: ff, display: "flex",
            alignItems: "center", justifyContent: "space-between",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.surfaceBorderHover; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.surfaceBorder; e.currentTarget.style.background = C.surfaceHigh; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 14 }}>{modeIcon}</span>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{modeLabel}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* New Quote CTA */}
        <div style={{ padding: "12px 14px 0" }}>
          <button onClick={handleNewQuote} style={{
            width: "100%", padding: "9px 0", borderRadius: 8,
            border: "none", background: C.accentGrad,
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: ff,
            boxShadow: `0 4px 14px ${C.accentGlow}`,
            transition: "opacity 0.15s, transform 0.1s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            + New Quote
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          {GROUPS.map(group => {
            const items = NAV.filter(n => n.group === group.id);
            return (
              <div key={group.id} style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.textMuted,
                  textTransform: "uppercase", letterSpacing: 1.2,
                  padding: "0 8px", marginBottom: 4,
                }}>
                  {group.label}
                </div>
                {items.map(item => {
                  const isActive = active === item.id;
                  return (
                    <button key={item.id} onClick={() => setActive(item.id)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: 8, border: "none",
                      background: isActive ? "rgba(124,58,237,0.14)" : "transparent",
                      color: isActive ? C.accentLight : C.textSub,
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      cursor: "pointer", fontFamily: ff, textAlign: "left",
                      marginBottom: 2, transition: "all 0.15s",
                      borderLeft: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = C.text; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textSub; } }}
                    >
                      <span style={{
                        fontSize: 13, color: isActive ? C.accent : C.textMuted,
                        fontWeight: 700, width: 14, flexShrink: 0,
                      }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Bottom lock */}
        <div style={{ padding: "12px 14px 16px", borderTop: `1px solid ${C.surfaceBorder}` }}>
          <button onClick={() => setScreen("pin_enter")} style={{
            width: "100%", padding: "7px 0", borderRadius: 8,
            border: `1px solid ${C.surfaceBorder}`, background: "transparent",
            color: C.textMuted, fontSize: 12, fontWeight: 500,
            cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.surfaceBorderHover; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.surfaceBorder; e.currentTarget.style.color = C.textMuted; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Lock App
          </button>
        </div>
      </aside>

      {/* ─── Main area ───────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>

        {/* Topbar */}
        <header style={{
          padding: "0 32px", height: 56,
          background: `${C.surface}cc`,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.surfaceBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 15, flexShrink: 0,
        }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>QuoteGen</span>
            <span style={{ color: C.textMuted, fontSize: 10 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{currentNav?.label}</span>
            {answers.projectName && (
              <>
                <span style={{ color: C.textMuted, fontSize: 10 }}>›</span>
                <span style={{
                  fontSize: 12, color: C.textMuted,
                  background: C.surfaceHigh, padding: "2px 8px",
                  borderRadius: 5, border: `1px solid ${C.surfaceBorder}`,
                }}>
                  {answers.projectName}{answers.clientName ? ` — ${answers.clientName}` : ""}
                </span>
              </>
            )}
          </div>

          {/* Progress + Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Progress pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.surfaceHigh, border: `1px solid ${C.surfaceBorder}`,
              borderRadius: 8, padding: "5px 12px",
            }}>
              <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: C.accentGrad, borderRadius: 99,
                  transition: "width 0.4s", boxShadow: `0 0 6px ${C.accentGlow}`,
                }} />
              </div>
              <span style={{ fontSize: 11, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
            </div>

            {activeIndex > 0 && (
              <button onClick={() => setActive(NAV[activeIndex - 1].id)} style={{
                padding: "6px 14px", borderRadius: 7,
                border: `1px solid ${C.surfaceBorder}`, background: C.surfaceHigh,
                color: C.textSub, fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.surfaceBorderHover; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.surfaceBorder; e.currentTarget.style.color = C.textSub; }}
              >← Back</button>
            )}
            {activeIndex < NAV.length - 1 && (
              <button onClick={() => setActive(NAV[activeIndex + 1].id)} style={{
                padding: "6px 14px", borderRadius: 7,
                border: "none", background: C.accentGrad,
                color: "#fff", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: ff,
                boxShadow: `0 2px 10px ${C.accentGlow}`,
                transition: "opacity 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Next →</button>
            )}
          </div>
        </header>

        {/* Content */}
        <div style={{
          flex: 1, padding: "36px 40px",
          maxWidth: 820, width: "100%", boxSizing: "border-box",
          overflowY: "auto",
        }}>
          <ErrorBoundary>
            {renderSection()}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
