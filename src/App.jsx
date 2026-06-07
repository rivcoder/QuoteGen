import { useState, useEffect, Component } from "react";
import { loadFreelancerProfile, getPIN, hasSeenSplash, markSplashSeen } from "./utils/calculate";
import ClientPortal from "./components/ClientPortal";
import { ErrorBoundaryFallback } from "./components/UI";
import Splash from "./components/Splash";
import { CreatePIN, EnterPIN } from "./components/PINScreen";
import logo from "./quotelogo.png";

import ClientPortal from "./components/ClientPortal";
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

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() { return this.state.hasError ? <ErrorBoundaryFallback error={this.state.error} /> : this.props.children; }
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "profile",    label: "My Profile",        icon: "👤", group: "setup" },
  { id: "client",     label: "Client Info",        icon: "🤝", group: "quote" },
  { id: "project",    label: "Project Details",    icon: "📋", group: "quote" },
  { id: "pricing",    label: "Pricing",            icon: "💰", group: "quote" },
  { id: "payment",    label: "Payment Terms",      icon: "💳", group: "quote" },
  { id: "milestones", label: "Milestones",         icon: "🗓", group: "quote" },
  { id: "terms",      label: "Terms & Conditions", icon: "📜", group: "quote" },
  { id: "preview",    label: "Preview & Export",   icon: "⚡", group: "export" },
  { id: "templates",  label: "Templates",          icon: "📂", group: "tools" },
  { id: "history",    label: "Quote History",      icon: "🕒", group: "tools" },
];

const GROUPS = [
  { id: "setup",  label: "Setup" },
  { id: "quote",  label: "Quote Builder" },
  { id: "export", label: "Export" },
  { id: "tools",  label: "Tools" },
];

const DEFAULT_ANSWERS = {
  service: null, baseType: null, pages: null,
  revisions: "2", timeline: "standard",
  currency: "INR", discount: false, discountPct: 0,
  includeGst: false, advancePct: 50,
  lineItems: [], milestones: [], platforms: [], paymentMethods: [],
};

// ── App screen states ─────────────────────────────────────────────────────────
// "splash" → "pin_create" (first time) | "pin_enter" (returning) → "app"

export default function App() {
  // ── Client portal detection — if URL has #quote data, show portal ──────────
  if (window.location.hash && window.location.hash.length > 10) {
    return <ClientPortal />;
  }

  const firstTime = !hasSeenSplash();
  const storedPIN = getPIN();

  const [screen, setScreen] = useState("splash");
  const [active, setActive] = useState("profile");
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [profile, setProfile] = useState(() => loadFreelancerProfile());

  const handleSplashDone = () => {
    markSplashSeen();
    if (storedPIN) {
      setScreen("pin_enter");
    } else if (firstTime) {
      setScreen("pin_create");
    } else {
      setScreen("app");
    }
  };

  const handlePINDone = () => setScreen("app");

  const handleNewQuote = () => {
    setAnswers(DEFAULT_ANSWERS);
    setActive("client");
  };

  const handleLoadTemplate = (templateAnswers) => {
    setAnswers({ ...DEFAULT_ANSWERS, ...templateAnswers });
    setActive("pricing");
  };

  const renderSection = () => {
    switch (active) {
      case "profile":    return <FreelancerProfile profile={profile} setProfile={setProfile} />;
      case "client":     return <ClientInfo answers={answers} setAnswers={setAnswers} />;
      case "project":    return <ProjectDetails answers={answers} setAnswers={setAnswers} />;
      case "pricing":    return <PricingSection answers={answers} setAnswers={setAnswers} />;
      case "payment":    return <PaymentTerms answers={answers} setAnswers={setAnswers} />;
      case "milestones": return <Milestones answers={answers} setAnswers={setAnswers} />;
      case "terms":      return <TermsConditions answers={answers} setAnswers={setAnswers} />;
      case "preview":    return <PreviewExport answers={answers} setAnswers={setAnswers} profile={profile} onNew={handleNewQuote} />;
      case "templates":  return <Templates answers={answers} setAnswers={setAnswers} onLoad={handleLoadTemplate} />;
      case "history":    return <QuoteHistory onClose={() => setActive("client")} />;
      default:           return null;
    }
  };

  // ── Splash ──────────────────────────────────────────────────────────────────
  if (screen === "splash") return <Splash onDone={handleSplashDone} />;

  // ── PIN Create (first time) ─────────────────────────────────────────────────
  if (screen === "pin_create") return <CreatePIN onDone={handlePINDone} />;

  // ── PIN Enter (returning) ───────────────────────────────────────────────────
  if (screen === "pin_enter") return <EnterPIN onSuccess={handlePINDone} />;

  // ── Main App ────────────────────────────────────────────────────────────────
  const currentNav = NAV.find(n => n.id === active);
  const activeIndex = NAV.findIndex(n => n.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "#080b1a", display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <div style={{
        width: 230, flexShrink: 0, background: "#0a0d1f",
        borderRight: "1px solid #1e2140", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e2140" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo} alt="QuoteGen" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>QuoteGen</div>
              <div style={{ fontSize: 10, color: "#4a5080", marginTop: 1 }}>Billing. Made Simple.</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {GROUPS.map(group => {
            const items = NAV.filter(n => n.group === group.id);
            return (
              <div key={group.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#2a2f50", textTransform: "uppercase", letterSpacing: 1, padding: "0 10px", marginBottom: 6 }}>
                  {group.label}
                </div>
                {items.map(item => {
                  const isActive = active === item.id;
                  return (
                    <button key={item.id} onClick={() => setActive(item.id)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", borderRadius: 10, border: "none",
                      background: isActive ? "linear-gradient(135deg,#1a1f4b,#3b3f8c)" : "transparent",
                      color: isActive ? "#fff" : "#4a5080",
                      fontSize: 13, fontWeight: isActive ? 700 : 500,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s", textAlign: "left",
                      boxShadow: isActive ? "0 0 12px #6c63ff22" : "none",
                      marginBottom: 2,
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#12152e"; e.currentTarget.style.color = "#8b9cf4"; }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a5080"; }}}
                    >
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* New quote + lock buttons */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1e2140", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={handleNewQuote} style={{
            width: "100%", padding: "10px 0", borderRadius: 10, border: "1.5px solid #6c63ff",
            background: "transparent", color: "#a78bfa", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            + New Quote
          </button>
          <button onClick={() => setScreen("pin_enter")} style={{
            width: "100%", padding: "8px 0", borderRadius: 10, border: "1.5px solid #1e2140",
            background: "transparent", color: "#2a2f50", fontSize: 12,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            🔒 Lock
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: "16px 32px", borderBottom: "1px solid #1e2140", background: "#0a0d1f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
              {currentNav?.icon} {currentNav?.label}
            </div>
            {answers.projectName && (
              <div style={{ fontSize: 12, color: "#4a5080", marginTop: 2 }}>
                {answers.projectName}{answers.clientName ? ` · ${answers.clientName}` : ""}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {activeIndex > 0 && (
              <button onClick={() => setActive(NAV[activeIndex - 1].id)} style={{
                background: "transparent", border: "1.5px solid #1e2140", color: "#8b9cf4",
                borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              }}>← Prev</button>
            )}
            {activeIndex < NAV.length - 1 && (
              <button onClick={() => setActive(NAV[activeIndex + 1].id)} style={{
                background: "linear-gradient(135deg,#6c63ff,#a78bfa)", border: "none", color: "#fff",
                borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              }}>Next →</button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "32px", maxWidth: 800, width: "100%", overflowY: "auto" }}>
          <ErrorBoundary>
            {renderSection()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
