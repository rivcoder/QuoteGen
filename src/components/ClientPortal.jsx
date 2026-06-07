import { useState, useEffect } from "react";
import { fmt } from "../utils/calculate";
import logo from "../quotelogo.png";

// ── Decode quote data from URL hash ──────────────────────────────────────────
function decodeQuoteFromURL() {
  try {
    const hash = window.location.hash.slice(1); // remove #
    if (!hash) return null;
    const json = decodeURIComponent(atob(hash));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Status stored in localStorage per quoteId ─────────────────────────────────
function getPortalStatus(quoteId) {
  try { return JSON.parse(localStorage.getItem(`portal_${quoteId}`) || "null"); } catch { return null; }
}
function setPortalStatus(quoteId, status, note) {
  try {
    localStorage.setItem(`portal_${quoteId}`, JSON.stringify({
      status, note, timestamp: new Date().toISOString(),
    }));
  } catch {}
}

// ── Section block ─────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#6c63ff",
        textTransform: "uppercase", letterSpacing: 1.5,
        marginBottom: 12, paddingBottom: 8,
        borderBottom: "1px solid #f0eeff",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5ff" }}>
      <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ── Main portal ───────────────────────────────────────────────────────────────
export default function ClientPortal() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(null); // null | "accepted" | "rejected"
  const [note, setNote] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const decoded = decodeQuoteFromURL();
    if (!decoded) { setError(true); return; }
    setData(decoded);
    // check if already responded
    const existing = getPortalStatus(decoded.quoteId);
    if (existing) { setStatus(existing.status); setNote(existing.note || ""); setSubmitted(true); }
  }, []);

  const handleDecision = (decision) => {
    if (!data) return;
    if (decision === "rejected") {
      setShowNoteBox(true);
      setStatus("rejected");
      return;
    }
    finalSubmit("accepted", "");
  };

  const finalSubmit = (decision, clientNote) => {
    setPortalStatus(data.quoteId, decision, clientNote);
    setStatus(decision);
    setSubmitted(true);
    setShowNoteBox(false);
  };

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <img src={logo} alt="QuoteGen" style={{ width: 80, marginBottom: 20, objectFit: "contain" }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>Invalid Quote Link</div>
        <div style={{ fontSize: 14, color: "#888", textAlign: "center" }}>
          This link appears to be broken or expired. Please ask your freelancer to resend the quote.
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div style={pageStyle}>
      <div style={{ color: "#888", fontSize: 14 }}>Loading quote...</div>
    </div>
  );

  const { answers, quote, profile, currency = "INR" } = data;
  const freelancer = profile?.company || profile?.name || answers.freelancerName || "Freelancer";
  const freelancerEmail = profile?.email || answers.freelancerEmail || "";

  // ── Submitted state ────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={pageStyle}>
      <div style={{ ...cardStyle, maxWidth: 480 }}>
        <img src={logo} alt="QuoteGen" style={{ width: 70, marginBottom: 20, objectFit: "contain" }} />
        <div style={{
          width: 64, height: 64, borderRadius: "50%", marginBottom: 16,
          background: status === "accepted" ? "#d1fae5" : "#fee2e2",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>
          {status === "accepted" ? "✓" : "✕"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
          {status === "accepted" ? "Quote Accepted!" : "Quote Rejected"}
        </div>
        <div style={{ fontSize: 14, color: "#888", textAlign: "center", lineHeight: 1.7, marginBottom: 20 }}>
          {status === "accepted"
            ? `Thank you! Your acceptance has been recorded. ${freelancer} will be in touch shortly to discuss next steps.`
            : `Your feedback has been recorded. ${freelancer} will reach out to discuss your concerns.`
          }
        </div>
        {note && (
          <div style={{ background: "#f8f8ff", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#555", width: "100%", textAlign: "left" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Your note:</div>
            {note}
          </div>
        )}
        {freelancerEmail && (
          <div style={{ marginTop: 20, fontSize: 13, color: "#888" }}>
            Questions? Email <a href={`mailto:${freelancerEmail}`} style={{ color: "#6c63ff" }}>{freelancerEmail}</a>
          </div>
        )}
      </div>
    </div>
  );

  // ── Main quote view ────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#f8f8ff", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {profile?.logo && <img src={profile.logo} alt="logo" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6 }} />}
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>{freelancer}</div>
            {freelancerEmail && <div style={{ fontSize: 11, color: "#888" }}>{freelancerEmail}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#888" }}>Quote ID</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6c63ff", letterSpacing: 0.5 }}>{answers.quoteId}</div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>

        {/* Hero */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "32px",
          marginBottom: 24, textAlign: "center",
          border: "1px solid #eee",
          boxShadow: "0 4px 24px rgba(108,99,255,0.08)",
        }}>
          <div style={{ fontSize: 12, color: "#6c63ff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            {answers.projectName || quote.serviceLabel}
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: "#1a1a2e", marginBottom: 4 }}>
            {fmt(quote.total, currency)}
          </div>
          <div style={{ fontSize: 14, color: "#888" }}>
            {quote.baseTypeLabel} · {quote.timeline}
          </div>
          {answers.clientName && (
            <div style={{ fontSize: 13, color: "#6c63ff", marginTop: 6 }}>
              Prepared for: <strong>{answers.clientName}</strong>
              {answers.clientCompany ? ` · ${answers.clientCompany}` : ""}
            </div>
          )}
          <div style={{
            display: "inline-block", marginTop: 12,
            background: "#fff8e1", border: "1px solid #ffd54f",
            borderRadius: 8, padding: "6px 14px",
            fontSize: 12, color: "#7c5c00",
          }}>
            ⏳ Valid until {quote.validUntil}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Breakdown */}
          <div style={whiteCard}>
            <Section title="Price Breakdown">
              <InfoRow label={`Base — ${quote.baseTypeLabel}`} value={fmt(quote.basePrice, currency)} />
              {quote.pagesCost > 0 && <InfoRow label="Pages" value={`+${fmt(quote.pagesCost, currency)}`} />}
              {quote.selectedAddons.map((a, i) => (
                <InfoRow key={i} label={`${a.icon} ${a.label}`} value={`+${fmt(a.cost, currency)}`} />
              ))}
              {quote.lineItemTotal > 0 && <InfoRow label="Line items" value={`+${fmt(quote.lineItemTotal, currency)}`} />}
              <div style={{ borderTop: "2px solid #f0eeff", marginTop: 8, paddingTop: 8 }}>
                <InfoRow label="Subtotal" value={fmt(quote.subtotal, currency)} />
                {quote.discount > 0 && <InfoRow label={`Discount (${quote.discountPct}%)`} value={`−${fmt(quote.discount, currency)}`} />}
                {quote.gst > 0 && <InfoRow label="GST (18%)" value={`+${fmt(quote.gst, currency)}`} />}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, padding: "10px 0" }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: "#6c63ff" }}>{fmt(quote.total, currency)}</span>
              </div>
            </Section>
          </div>

          {/* Payment + tiers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={whiteCard}>
              <Section title="Payment Schedule">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginBottom: 2 }}>Advance ({quote.advancePct}%)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{fmt(quote.advanceAmount, currency)}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Due before work starts</div>
                  </div>
                  <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#6c63ff", fontWeight: 700, marginBottom: 2 }}>On Delivery ({100 - quote.advancePct}%)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#6c63ff" }}>{fmt(quote.remainingAmount, currency)}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Due on completion</div>
                  </div>
                </div>
                {answers.paymentDetails && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#555" }}>
                    <strong>Pay via:</strong> {answers.paymentDetails}
                  </div>
                )}
              </Section>
            </div>

            <div style={whiteCard}>
              <Section title="Package Options">
                {quote.tierComparison.map(tier => (
                  <div key={tier.key} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", borderRadius: 8, marginBottom: 6,
                    background: tier.key === "standard" ? "#f5f3ff" : "#fafafa",
                    border: `1px solid ${tier.key === "standard" ? "#c4b5fd" : "#eee"}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tier.color }}>{tier.label}</div>
                      <div style={{ fontSize: 10, color: "#888" }}>{tier.desc}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>{fmt(tier.total, currency)}</div>
                  </div>
                ))}
              </Section>
            </div>
          </div>
        </div>

        {/* Project details */}
        {(answers.projectDescription || answers.scopeIncluded || answers.scopeExcluded || answers.deliverables) && (
          <div style={{ ...whiteCard, marginBottom: 20 }}>
            <Section title="Project Details">
              {answers.projectDescription && (
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, marginBottom: 16 }}>{answers.projectDescription}</p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {answers.startDate && <InfoRow label="Start Date" value={answers.startDate} />}
                {answers.endDate && <InfoRow label="Est. Completion" value={answers.endDate} />}
              </div>
              {answers.scopeIncluded && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>✅ Included</div>
                  <div style={{ fontSize: 13, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#f0fdf4", borderRadius: 8, padding: "10px 14px" }}>{answers.scopeIncluded}</div>
                </div>
              )}
              {answers.scopeExcluded && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>❌ Not Included</div>
                  <div style={{ fontSize: 13, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#fef2f2", borderRadius: 8, padding: "10px 14px" }}>{answers.scopeExcluded}</div>
                </div>
              )}
              {answers.deliverables && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6c63ff", marginBottom: 6 }}>📦 Deliverables</div>
                  <div style={{ fontSize: 13, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#f5f3ff", borderRadius: 8, padding: "10px 14px" }}>{answers.deliverables}</div>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* Features */}
        {quote.selectedAddons.length > 0 && (
          <div style={{ ...whiteCard, marginBottom: 20 }}>
            <Section title="Included Features">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {quote.selectedAddons.map((a, i) => (
                  <span key={i} style={{ background: "#f0eeff", color: "#6c63ff", borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 600 }}>
                    {a.icon} {a.label}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Milestones */}
        {(answers.milestones || []).length > 0 && (
          <div style={{ ...whiteCard, marginBottom: 20 }}>
            <Section title="Project Milestones">
              {answers.milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < answers.milestones.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{m.name || `Milestone ${i + 1}`}</div>
                    {m.date && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Due: {m.date}</div>}
                    {m.description && <div style={{ fontSize: 12, color: "#888" }}>{m.description}</div>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#6c63ff" }}>
                    {m.amount ? fmt(parseFloat(m.amount), currency) : "—"}
                  </div>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* Terms */}
        {answers.termsText && (
          <div style={{ ...whiteCard, marginBottom: 24 }}>
            <Section title="Terms & Conditions">
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.9, whiteSpace: "pre-wrap", background: "#f8f8ff", borderRadius: 10, padding: "14px 16px" }}>
                {answers.termsText}
              </div>
            </Section>
          </div>
        )}

        {/* Accept / Reject */}
        <div style={{ ...whiteCard, textAlign: "center", border: "2px solid #6c63ff22" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>
            Ready to proceed?
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
            Review the quote above and let {freelancer} know your decision.
          </div>

          {showNoteBox ? (
            <div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Tell us what you'd like changed or why you're rejecting..."
                rows={4}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", fontSize: 13,
                  fontFamily: "inherit", resize: "vertical", marginBottom: 12,
                  boxSizing: "border-box", outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setShowNoteBox(false); setStatus(null); }} style={ghostBtn}>
                  Cancel
                </button>
                <button onClick={() => finalSubmit("rejected", note)} style={rejectBtn}>
                  Submit Rejection
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => handleDecision("rejected")} style={rejectBtn}>
                ✕ Reject Quote
              </button>
              <button onClick={() => handleDecision("accepted")} style={acceptBtn}>
                ✓ Accept Quote
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#bbb" }}>
          Powered by QuoteGen · Billing. Made Simple.
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const pageStyle = {
  minHeight: "100vh", background: "#f8f8ff",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 24,
};
const cardStyle = {
  background: "#fff", borderRadius: 20, padding: 40,
  textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
  display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 400,
};
const whiteCard = {
  background: "#fff", borderRadius: 16, padding: "24px",
  border: "1px solid #eee", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};
const acceptBtn = {
  padding: "14px 32px", borderRadius: 12, border: "none",
  background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff",
  fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
};
const rejectBtn = {
  padding: "14px 32px", borderRadius: 12,
  border: "1.5px solid #f87171", background: "transparent",
  color: "#f87171", fontSize: 15, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit",
};
const ghostBtn = {
  flex: 1, padding: "12px", borderRadius: 10,
  border: "1.5px solid #e5e7eb", background: "transparent",
  color: "#888", fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};
