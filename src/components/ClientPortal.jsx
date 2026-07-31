import { useState, useEffect } from "react";
import { fmt } from "../utils/calculate";
import logo from "../quotelogo.png";

function decodeQuoteFromURL() {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch { return null; }
}

function getPortalStatus(id) {
  try { return JSON.parse(localStorage.getItem(`portal_${id}`) || "null"); } catch { return null; }
}
function setPortalStatus(id, status, note) {
  try { localStorage.setItem(`portal_${id}`, JSON.stringify({ status, note, timestamp: new Date().toISOString() })); } catch {}
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2140", fontSize: 13 }}>
      <span style={{ color: "#9ca3af" }}>{label}</span>
      <span style={{ color: "#f3f4f6", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ClientPortal() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const decoded = decodeQuoteFromURL();
    if (!decoded) { setError(true); return; }
    setData(decoded);
    const existing = getPortalStatus(decoded.answers?.quoteId);
    if (existing) { setStatus(existing.status); setNote(existing.note || ""); setSubmitted(true); }
  }, []);

  const finalSubmit = (decision, clientNote) => {
    setPortalStatus(data.answers?.quoteId, decision, clientNote);
    setStatus(decision); setSubmitted(true); setShowNote(false);
  };

  if (error) return (
    <div style={center}>
      <img src={logo} alt="QuoteGen" style={{ width: 48, marginBottom: 20, objectFit: "contain" }} />
      <div style={{ fontSize: 16, fontWeight: 600, color: "#f87171", marginBottom: 6 }}>Invalid quote link</div>
      <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>This link appears broken or expired. Ask your freelancer to resend it.</div>
    </div>
  );

  if (!data) return <div style={center}><div style={{ fontSize: 13, color: "#9ca3af" }}>Loading...</div></div>;

  const { answers, quote, profile, currency = "INR" } = data;
  const freelancer = profile?.company || profile?.name || answers.freelancerName || "Freelancer";
  const freelancerEmail = profile?.email || answers.freelancerEmail || "";

  if (submitted) return (
    <div style={center}>
      <img src={logo} alt="QuoteGen" style={{ width: 48, marginBottom: 20, objectFit: "contain" }} />
      <div style={{
        width: 48, height: 48, borderRadius: "50%", marginBottom: 16,
        background: status === "accepted" ? "#0d2e1f" : "#2e1212",
        border: `1px solid ${status === "accepted" ? "#10b981" : "#f87171"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: status === "accepted" ? "#10b981" : "#f87171"
      }}>
        {status === "accepted" ? "✓" : "✕"}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#f3f4f6", marginBottom: 6 }}>
        {status === "accepted" ? "Quote accepted" : "Quote declined"}
      </div>
      <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", lineHeight: 1.6, maxWidth: 320, marginBottom: 16 }}>
        {status === "accepted"
          ? `Your acceptance has been recorded. ${freelancer} will be in touch shortly.`
          : `Your feedback has been recorded. ${freelancer} will reach out to discuss.`
        }
      </div>
      {note && (
        <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#9ca3af", maxWidth: 320, width: "100%" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Your note</div>
          {note}
        </div>
      )}
      {freelancerEmail && (
        <div style={{ marginTop: 20, fontSize: 12, color: "#6b7280" }}>
          Questions? <a href={`mailto:${freelancerEmail}`} style={{ color: "#6c63ff" }}>{freelancerEmail}</a>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: "#080b1a", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0d1026", borderBottom: "1px solid #1e2140", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {profile?.logo
            ? <img src={profile.logo} alt="logo" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4 }} />
            : <img src={logo} alt="QuoteGen" style={{ width: 28, height: 28, objectFit: "contain" }} />
          }
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6" }}>{freelancer}</div>
            {freelancerEmail && <div style={{ fontSize: 11, color: "#9ca3af" }}>{freelancerEmail}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Quote ID</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#f3f4f6", fontVariantNumeric: "tabular-nums" }}>{answers.quoteId}</div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0d1028,#12152e)", border: "1px solid #1e2140", borderRadius: 8, padding: "28px 24px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            {answers.projectName || quote.serviceLabel}
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#10b981", letterSpacing: -1, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
            {fmt(quote.total, currency)}
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>{quote.baseTypeLabel} · {quote.timeline}</div>
          {answers.clientName && (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>
              Prepared for <strong>{answers.clientName}</strong>{answers.clientCompany ? ` · ${answers.clientCompany}` : ""}
            </div>
          )}
          <div style={{ marginTop: 12, display: "inline-block", background: "#0d1026", border: "1px solid #1e2140", borderRadius: 4, padding: "4px 12px", fontSize: 12, color: "#9ca3af" }}>
            Valid until {quote.validUntil}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Breakdown */}
          <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Price Breakdown</div>
            <Row label={`Base — ${quote.baseTypeLabel}`} value={fmt(quote.basePrice, currency)} />
            {quote.pagesCost > 0 && <Row label="Pages" value={`+${fmt(quote.pagesCost, currency)}`} />}
            {quote.selectedAddons.map((a, i) => <Row key={i} label={`${a.icon} ${a.label}`} value={`+${fmt(a.cost, currency)}`} />)}
            {quote.lineItemTotal > 0 && <Row label="Line items" value={`+${fmt(quote.lineItemTotal, currency)}`} />}
            {quote.discount > 0 && <Row label={`Discount (${quote.discountPct}%)`} value={`−${fmt(quote.discount, currency)}`} />}
            {quote.gst > 0 && <Row label="GST (18%)" value={`+${fmt(quote.gst, currency)}`} />}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f3f4f6" }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10b981", fontVariantNumeric: "tabular-nums" }}>{fmt(quote.total, currency)}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Payment */}
            <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Payment</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ background: "#0d1026", borderRadius: 6, padding: "10px 12px", border: "1px solid #1e2140" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>Advance ({quote.advancePct}%)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#34d399", fontVariantNumeric: "tabular-nums" }}>{fmt(quote.advanceAmount, currency)}</div>
                </div>
                <div style={{ background: "#0d1026", borderRadius: 6, padding: "10px 12px", border: "1px solid #1e2140" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>On Delivery ({100 - quote.advancePct}%)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa", fontVariantNumeric: "tabular-nums" }}>{fmt(quote.remainingAmount, currency)}</div>
                </div>
              </div>
              {answers.paymentDetails && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>Pay via: {answers.paymentDetails}</div>
              )}
            </div>

            {/* Packages */}
            <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Package Options</div>
              {quote.tierComparison.map(t => (
                <div key={t.key} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "7px 10px", borderRadius: 5, marginBottom: 5,
                  background: t.key === "standard" ? "#0d1026" : "transparent",
                  border: `1px solid ${t.key === "standard" ? "#1e2140" : "transparent"}`,
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#f3f4f6" }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f3f4f6", fontVariantNumeric: "tabular-nums" }}>{fmt(t.total, currency)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project details */}
        {(answers.projectDescription || answers.scopeIncluded || answers.scopeExcluded || answers.deliverables) && (
          <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Project Details</div>
            {answers.projectDescription && <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7, marginBottom: 14 }}>{answers.projectDescription}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {answers.startDate && <div><div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>Start</div><div style={{ fontSize: 13, color: "#f3f4f6" }}>{answers.startDate}</div></div>}
              {answers.endDate && <div><div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>Est. Completion</div><div style={{ fontSize: 13, color: "#f3f4f6" }}>{answers.endDate}</div></div>}
            </div>
            {answers.scopeIncluded && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Included</div>
                <div style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#0d1026", border: "1px solid #1e2140", borderRadius: 5, padding: "10px 12px" }}>{answers.scopeIncluded}</div>
              </div>
            )}
            {answers.scopeExcluded && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "#f87171", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Not Included</div>
                <div style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#0d1026", border: "1px solid #1e2140", borderRadius: 5, padding: "10px 12px" }}>{answers.scopeExcluded}</div>
              </div>
            )}
            {answers.deliverables && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Deliverables</div>
                <div style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "pre-wrap", lineHeight: 1.7, background: "#0d1026", border: "1px solid #1e2140", borderRadius: 5, padding: "10px 12px" }}>{answers.deliverables}</div>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        {quote.selectedAddons.length > 0 && (
          <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Included Features</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {quote.selectedAddons.map((a, i) => (
                <span key={i} style={{ background: "#0d1026", border: "1px solid #1e2140", borderRadius: 4, padding: "4px 10px", fontSize: 12, color: "#9ca3af" }}>
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        {(answers.milestones || []).length > 0 && (
          <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Milestones</div>
            {answers.milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < answers.milestones.length - 1 ? "1px solid #1e2140" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#f3f4f6" }}>{m.name || `Milestone ${i + 1}`}</div>
                  {m.date && <div style={{ fontSize: 11, color: "#9ca3af" }}>{m.date}</div>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", fontVariantNumeric: "tabular-nums" }}>
                  {m.amount ? fmt(parseFloat(m.amount), currency) : "—"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terms */}
        {answers.termsText && (
          <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6c63ff", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Terms & Conditions</div>
            <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.9, whiteSpace: "pre-wrap", background: "#0d1026", border: "1px solid #1e2140", borderRadius: 5, padding: "12px 14px" }}>
              {answers.termsText}
            </div>
          </div>
        )}

        {/* Accept / Reject */}
        <div style={{ background: "#12152e", border: "1px solid #1e2140", borderRadius: 8, padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#f3f4f6", marginBottom: 4 }}>Ready to proceed?</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
            Review the quote above and let {freelancer} know your decision.
          </div>

          {showNote ? (
            <div style={{ textAlign: "left" }}>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Tell us what you'd like changed..."
                rows={3}
                style={{
                  width: "100%", padding: "9px 11px", borderRadius: 5,
                  border: "1px solid #1e2140", background: "#0d1026", color: "#f3f4f6", fontSize: 13,
                  fontFamily: "inherit", resize: "vertical",
                  marginBottom: 10, boxSizing: "border-box", outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowNote(false); setStatus(null); }} style={ghostBtn}>Cancel</button>
                <button onClick={() => finalSubmit("rejected", note)} style={rejectBtn}>Submit</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => { setStatus("rejected"); setShowNote(true); }} style={rejectBtn}>Decline</button>
              <button onClick={() => finalSubmit("accepted", "")} style={acceptBtn}>Accept Quote</button>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#6b7280" }}>
          Powered by QuoteGen
        </div>
      </div>
    </div>
  );
}

const center = {
  minHeight: "100vh", background: "#080b1a",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  padding: 24,
};
const acceptBtn = {
  padding: "10px 24px", borderRadius: 6, border: "none",
  background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff",
  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  boxShadow: "0 0 15px rgba(108, 99, 255, 0.3)"
};
const rejectBtn = {
  padding: "10px 24px", borderRadius: 6, border: "1px solid #1e2140",
  background: "#12152e", color: "#f87171", fontSize: 14, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit"
};
const ghostBtn  = {
  flex: 1, padding: "9px", borderRadius: 6, border: "1px solid #1e2140",
  background: "transparent", color: "#9ca3af", fontSize: 13, cursor: "pointer",
  fontFamily: "inherit"
};