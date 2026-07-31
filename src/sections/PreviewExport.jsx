import { useState } from "react";
import { calculateQuote, fmt, generateWhatsAppMessage, generateEmailBody, generateTextQuote, saveQuoteToHistory, generateQuoteId, sanitize, sanitizeMultiline } from "../utils/calculate";
import { Card, CardTitle, PriceRow, Btn, Divider } from "../components/UI";

// ── PDF Generator ─────────────────────────────────────────────────────────────
function buildPDFHtml(answers, quote, currency, profile) {
  // ── Sanitize ALL user input before it touches HTML ──────────────────────
  const freelancer    = sanitize(profile?.name || answers.freelancerName || "Freelancer");
  const company       = sanitize(profile?.company || answers.freelancerCompany || "");
  const email         = sanitize(profile?.email || answers.freelancerEmail || "");
  const phone         = sanitize(profile?.phone || answers.freelancerPhone || "");
  const website       = sanitize(profile?.website || "");
  const gst           = sanitize(profile?.gst || "");
  const logo          = profile?.logo || null; // base64 — not user-typed text, safe
  const client        = sanitize(answers.clientName || "Valued Client");
  const clientCompany = sanitize(answers.clientCompany || "");
  const projectName   = sanitize(answers.projectName || "");
  const quoteId       = sanitize(answers.quoteId || "");
  const paymentDets   = sanitize(answers.paymentDetails || "");
  const baseTypeLabel = sanitize(quote.baseTypeLabel || "");
  const serviceLabel  = sanitize(quote.serviceLabel || "");
  const timeline      = sanitize(quote.timeline || "");

  // multiline fields — preserve line breaks
  const projectDesc   = sanitizeMultiline(answers.projectDescription || "");
  const scopeIncluded = sanitizeMultiline(answers.scopeIncluded || "");
  const scopeExcluded = sanitizeMultiline(answers.scopeExcluded || "");
  const deliverables  = sanitizeMultiline(answers.deliverables || "");
  const termsText     = sanitizeMultiline(answers.termsText || "");

  const milestones    = answers.milestones || [];
  const platforms     = (answers.platforms || []).map(sanitize);
  const includeApproval = answers.includeApproval !== false;

  return `<!DOCTYPE html>
<html>
<head>
<title>Quotation — ${client}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;color:#1a1a2e;background:#fff;max-width:800px;margin:0 auto;font-size:13px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #6c63ff}
  .brand-block{display:flex;align-items:center;gap:14px}
  .logo{width:60px;height:60px;object-fit:contain;border-radius:8px}
  .brand-name{font-size:20px;font-weight:900;color:#1a1a2e}
  .brand-sub{font-size:11px;color:#888;margin-top:2px}
  .meta{text-align:right;font-size:11px;color:#666;line-height:2}
  .badge{display:inline-block;background:#f0eeff;color:#6c63ff;border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:0.5px}
  h2{font-size:22px;font-weight:900;color:#1a1a2e;margin-bottom:4px}
  .subtitle{font-size:12px;color:#888;margin-bottom:6px}
  .section{margin-bottom:24px}
  .section-title{font-size:10px;font-weight:700;color:#6c63ff;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #f0eeff}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .info-block{background:#f8f8ff;border-radius:8px;padding:12px}
  .info-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px}
  .info-value{font-size:13px;color:#1a1a2e;font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:4px}
  th{text-align:left;padding:8px 10px;background:#f8f8ff;font-size:11px;color:#444;font-weight:700}
  td{padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#333}
  .amount{text-align:right;font-weight:600}
  .total-row td{font-weight:900;font-size:15px;border-top:2px solid #6c63ff;color:#6c63ff;padding-top:12px}
  .discount{color:#16a34a}
  .features{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
  .tag{background:#f0eeff;color:#6c63ff;border-radius:20px;padding:3px 10px;font-size:10px;font-weight:600}
  .tiers{display:flex;gap:10px}
  .tier{flex:1;border:2px solid #eee;border-radius:10px;padding:12px;text-align:center}
  .tier.active{border-color:#6c63ff;background:#f8f8ff}
  .tier-label{font-size:10px;font-weight:700;text-transform:uppercase;color:#888}
  .tier-price{font-size:16px;font-weight:800;color:#1a1a2e;margin:4px 0}
  .milestone-row td{background:#fafafa}
  .validity{background:#fff8e1;border:1px solid #ffd54f;border-radius:6px;padding:8px 12px;font-size:11px;color:#7c5c00;margin-bottom:20px}
  .terms-box{background:#f8f8ff;border-radius:8px;padding:14px;font-size:11px;color:#444;line-height:1.8;white-space:pre-wrap}
  .approval{margin-top:32px;padding-top:20px;border-top:2px solid #6c63ff}
  .approval-title{font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:16px}
  .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .sig-block .sig-line{border-bottom:1px solid #aaa;height:40px;margin-bottom:6px}
  .sig-block .sig-label{font-size:10px;color:#888}
  .footer{margin-top:32px;padding-top:12px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:10px;color:#bbb}
  .scope-box{background:#f8f8ff;border-radius:8px;padding:12px;font-size:12px;white-space:pre-wrap;line-height:1.7;color:#333}
  .payment-box{background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:12px;font-size:12px;color:#166534}
  @media print{body{padding:20px}@page{margin:1cm}}
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="brand-block">
    ${logo ? `<img src="${logo}" class="logo" alt="logo"/>` : ""}
    <div>
      <div class="brand-name">${company || freelancer}</div>
      ${company ? `<div class="brand-sub">${freelancer}</div>` : ""}
      ${email ? `<div class="brand-sub">${email}</div>` : ""}
      ${phone ? `<div class="brand-sub">${phone}</div>` : ""}
      ${website ? `<div class="brand-sub">${website}</div>` : ""}
      ${gst ? `<div class="brand-sub">GST: ${gst}</div>` : ""}
    </div>
  </div>
  <div class="meta">
    <div><strong>Quote ID:</strong> ${quoteId}</div>
    <div><strong>Date:</strong> ${sanitize(quote.createdOn)}</div>
    <div><strong>Valid Until:</strong> ${sanitize(quote.validUntil)}</div>
    <div style="margin-top:6px"><span class="badge">${serviceLabel}</span></div>
  </div>
</div>

<!-- PROJECT TITLE -->
<h2>${projectName || serviceLabel + " Project"}</h2>
<div class="subtitle">${baseTypeLabel} · ${timeline} delivery${platforms.length ? " · " + platforms.join(", ") : ""}</div>

<div class="validity">⏳ This quotation is valid until <strong>${sanitize(quote.validUntil)}</strong>. Prices may change after this date.</div>

<!-- CLIENT & FREELANCER -->
<div class="section">
  <div class="section-title">Parties</div>
  <div class="two-col">
    <div class="info-block">
      <div class="info-label">Client</div>
      <div class="info-value">${client}</div>
      ${clientCompany ? `<div style="font-size:12px;color:#666;margin-top:2px">${clientCompany}</div>` : ""}
      ${answers.clientEmail ? `<div style="font-size:11px;color:#888;margin-top:2px">${sanitize(answers.clientEmail)}</div>` : ""}
      ${answers.clientPhone ? `<div style="font-size:11px;color:#888">${sanitize(answers.clientPhone)}</div>` : ""}
    </div>
    <div class="info-block">
      <div class="info-label">Freelancer / Agency</div>
      <div class="info-value">${company || freelancer}</div>
      ${email ? `<div style="font-size:11px;color:#888;margin-top:2px">${email}</div>` : ""}
      ${gst ? `<div style="font-size:11px;color:#888">GST: ${gst}</div>` : ""}
    </div>
  </div>
</div>

<!-- PROJECT DETAILS -->
${answers.projectDescription || answers.scopeIncluded || answers.deliverables ? `
<div class="section">
  <div class="section-title">Project Details</div>
  ${projectDesc ? `<p style="margin-bottom:10px;line-height:1.7;color:#444">${projectDesc}</p>` : ""}
  <div class="two-col" style="margin-top:10px">
    ${answers.startDate ? `<div><div class="info-label">Start Date</div><div class="info-value">${sanitize(answers.startDate)}</div></div>` : ""}
    ${answers.endDate ? `<div><div class="info-label">Est. Completion</div><div class="info-value">${sanitize(answers.endDate)}</div></div>` : ""}
  </div>
  ${scopeIncluded ? `<div style="margin-top:12px"><div class="info-label" style="margin-bottom:6px">✅ Scope Included</div><div class="scope-box">${scopeIncluded}</div></div>` : ""}
  ${scopeExcluded ? `<div style="margin-top:10px"><div class="info-label" style="margin-bottom:6px">❌ Excluded</div><div class="scope-box">${scopeExcluded}</div></div>` : ""}
  ${deliverables ? `<div style="margin-top:10px"><div class="info-label" style="margin-bottom:6px">📦 Deliverables</div><div class="scope-box">${deliverables}</div></div>` : ""}
</div>` : ""}

<!-- PRICE BREAKDOWN -->
<div class="section">
  <div class="section-title">Price Breakdown</div>
  <table>
    <tr><th>Item</th><th style="text-align:right">Amount</th></tr>
    <tr><td>Base — ${quote.baseTypeLabel}</td><td class="amount">${fmt(quote.basePrice, currency)}</td></tr>
    ${quote.pagesCost > 0 ? `<tr><td>Pages</td><td class="amount">+${fmt(quote.pagesCost, currency)}</td></tr>` : ""}
    ${quote.selectedAddons.map(a => `<tr><td>${sanitize(a.icon)} ${sanitize(a.label)}</td><td class="amount">+${fmt(a.cost, currency)}</td></tr>`).join("")}
    ${(answers.lineItems || []).map(item => {
      let amt = 0, desc = sanitize(item.description || "Line item");
      if (item.type === "hourly") { amt = (parseFloat(item.hours)||0)*(parseFloat(item.rate)||0); desc += ` (${sanitize(item.hours)}h × ₹${sanitize(item.rate)}/hr)`; }
      else if (item.type === "quantity") { amt = (parseFloat(item.qty)||0)*(parseFloat(item.unitPrice)||0); desc += ` (${sanitize(item.qty)} × ₹${sanitize(item.unitPrice)})`; }
      else amt = parseFloat(item.amount)||0;
      return amt > 0 ? `<tr><td>${desc}</td><td class="amount">+${fmt(amt, currency)}</td></tr>` : "";
    }).join("")}
    <tr><td><strong>Subtotal</strong></td><td class="amount"><strong>${fmt(quote.subtotal, currency)}</strong></td></tr>
    ${quote.discount > 0 ? `<tr><td class="discount">Discount (${quote.discountPct}%)</td><td class="amount discount">−${fmt(quote.discount, currency)}</td></tr>` : ""}
    ${quote.gst > 0 ? `<tr><td>GST (18%)</td><td class="amount">+${fmt(quote.gst, currency)}</td></tr>` : ""}
    <tr class="total-row"><td>TOTAL ESTIMATE</td><td class="amount">${fmt(quote.total, currency)}</td></tr>
  </table>
</div>

<!-- PACKAGE TIERS -->
<div class="section">
  <div class="section-title">Package Options</div>
  <div class="tiers">
    ${quote.tierComparison.map(t => `
      <div class="tier ${t.key === "standard" ? "active" : ""}">
        <div class="tier-label">${t.label}</div>
        <div class="tier-price">${fmt(t.total, currency)}</div>
        <div style="font-size:10px;color:#aaa">${t.desc}</div>
      </div>`).join("")}
  </div>
</div>

<!-- PAYMENT TERMS -->
<div class="section">
  <div class="section-title">Payment Terms</div>
  <div class="two-col">
    <div class="payment-box">
      <strong>Advance (${answers.advancePct ?? 50}%)</strong><br/>
      ${fmt(quote.advanceAmount, currency)} — due before work starts
    </div>
    <div class="payment-box">
      <strong>On Delivery (${100 - (answers.advancePct ?? 50)}%)</strong><br/>
      ${fmt(quote.remainingAmount, currency)} — due on project completion
    </div>
  </div>
  ${paymentDets ? `<div style="margin-top:10px;font-size:12px;color:#555"><strong>Payment details:</strong> ${paymentDets}</div>` : ""}
  ${answers.latePaymentCharge ? `<div style="margin-top:6px;font-size:11px;color:#888">Late payment fee: ${sanitize(answers.latePaymentCharge)}% per week after ${sanitize(answers.latePaymentGrace || "3")} days grace period</div>` : ""}
</div>

<!-- MILESTONES -->
${milestones.length > 0 ? `
<div class="section">
  <div class="section-title">Project Milestones</div>
  <table>
    <tr><th>#</th><th>Milestone</th><th>Due Date</th><th style="text-align:right">Amount</th></tr>
    ${milestones.map((m, i) => `
      <tr class="milestone-row">
        <td>${i + 1}</td>
        <td><strong>${sanitize(m.name || "—")}</strong>${m.description ? `<br/><span style="font-size:11px;color:#888">${sanitize(m.description)}</span>` : ""}</td>
        <td>${sanitize(m.date || "—")}</td>
        <td class="amount">${m.amount ? fmt(parseFloat(m.amount), currency) : "—"}</td>
      </tr>`).join("")}
  </table>
</div>` : ""}

<!-- INCLUDED FEATURES -->
${quote.selectedAddons.length > 0 ? `
<div class="section">
  <div class="section-title">Included Features</div>
  <div class="features">
    ${quote.selectedAddons.map(a => `<span class="tag">${sanitize(a.icon)} ${sanitize(a.label)}</span>`).join("")}
  </div>
</div>` : ""}

<!-- TERMS -->
${termsText ? `
<div class="section">
  <div class="section-title">Terms &amp; Conditions</div>
  <div class="terms-box">${termsText}</div>
</div>` : ""}

<!-- APPROVAL -->
${includeApproval ? `
<div class="approval">
  <div class="approval-title">Client Approval</div>
  <div class="sig-grid">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Client Signature</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Date of Approval</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Client Name (Print)</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Freelancer Signature</div>
    </div>
  </div>
</div>` : ""}

<div class="footer">
  <span>Generated by QuoteGen · ${quote.createdOn}</span>
  <span>This is an estimate. Final pricing subject to project scope.</span>
</div>

</body>
</html>`;
}

// ── Generate client portal link ───────────────────────────────────────────────
function generatePortalLink(answers, quote, profile) {
  try {
    const safeProfile = profile ? { ...profile, logo: null } : null;
    const payload = { answers, quote, profile: safeProfile, currency: answers.currency || "INR" };
    const json = JSON.stringify(payload);
    const encoded = btoa(encodeURIComponent(json));
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  } catch {
    return null;
  }
}

export default function PreviewExport({ answers, setAnswers, profile, onNew, setActive }) {
  const currency = answers.currency || "INR";
  const [quoteId] = useState(() => answers.quoteId || generateQuoteId());
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkError, setLinkError] = useState("");

  const answersWithId = { ...answers, quoteId };
  const quote = calculateQuote(answersWithId);
  if (!quote) return (
    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontWeight: 700, color: "#ef4444", fontSize: 16 }}>No service selected</div>
      <div style={{ marginTop: 8, fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
        Please select a service first in the Pricing section to view the preview.
      </div>
      {setActive && (
        <Btn onClick={() => setActive("pricing")} variant="primary" style={{ padding: "8px 20px" }}>
          Go to Pricing
        </Btn>
      )}
    </div>
  );

  const handlePDF = () => {
    const html = buildPDFHtml(answersWithId, quote, currency, profile);
    const win = window.open("", "_blank");
    if (!win) { alert("Pop-up blocked! Please allow pop-ups for this site."); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 700);
  };

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage(answersWithId, quote, currency);
    const phone = answers.clientPhone?.replace(/\D/g, "") || "";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleEmail = () => {
    const { subject, body } = generateEmailBody(answersWithId, quote, currency);
    window.open(`mailto:${answers.clientEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const handleCopy = () => {
    const text = generateTextQuote(answersWithId, quote, currency);
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleSave = () => {
    saveQuoteToHistory(answersWithId, quote, quoteId, answers.mode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShareLink = () => {
    setLinkError("");
    const link = generatePortalLink(answersWithId, quote, profile);
    if (!link) { setLinkError("Could not generate link — quote may be too large."); return; }
    if (link.length > 100000) { setLinkError("Quote has too much data for a URL. Remove some line items or shorten descriptions."); return; }
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }).catch(() => {
      setLinkError("Could not copy — please copy manually: " + link.substring(0, 60) + "...");
    });
  };

  const revService = answers.service ? answers.service.charAt(0).toUpperCase() + answers.service.slice(1) : "";

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 28, padding: "28px 0", background: "linear-gradient(135deg,#0d1028,#12152e)", borderRadius: 20, border: "1px solid #1e2140" }}>
        <div style={{ fontSize: 11, color: "#8b9cf4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {answers.projectName || quote.serviceLabel}
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {fmt(quote.total, currency)}
        </div>
        <div style={{ fontSize: 13, color: "#8b9cf4", marginTop: 8 }}>
          {quote.baseTypeLabel} · {quote.timeline}
        </div>
        {answers.clientName && <div style={{ fontSize: 12, color: "#6c63ff", marginTop: 4 }}>For: {answers.clientName}{answers.clientCompany ? ` · ${answers.clientCompany}` : ""}</div>}
        <div style={{ fontSize: 11, color: "#4a5080", marginTop: 4 }}>Valid until {quote.validUntil} · {quoteId}</div>
      </div>

      {/* Tiers */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Package Options</CardTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {quote.tierComparison.map(tier => (
            <div key={tier.key} style={{
              flex: 1, background: "#12152e", borderRadius: 12, padding: 14, textAlign: "center",
              border: `2px solid ${tier.key === "standard" ? tier.color : "#1e2140"}`,
              boxShadow: tier.key === "standard" ? `0 0 20px ${tier.color}22` : "none",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tier.color, marginBottom: 5, textTransform: "uppercase" }}>{tier.label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{fmt(tier.total, currency)}</div>
              <div style={{ fontSize: 10, color: "#4a5080", marginTop: 3 }}>{tier.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Breakdown */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Price Breakdown</CardTitle>
        <PriceRow label={`Base — ${quote.baseTypeLabel}`} value={fmt(quote.basePrice, currency)} />
        {quote.pagesCost > 0 && <PriceRow label="Pages" value={`+${fmt(quote.pagesCost, currency)}`} />}
        {quote.selectedAddons.map((a, i) => <PriceRow key={i} label={`${a.icon} ${a.label}`} value={`+${fmt(a.cost, currency)}`} color="#a78bfa" />)}
        {quote.lineItemTotal > 0 && <PriceRow label="Line items" value={`+${fmt(quote.lineItemTotal, currency)}`} color="#a78bfa" />}
        <Divider style={{ margin: "10px 0" }} />
        <PriceRow label="Subtotal" value={fmt(quote.subtotal, currency)} bold />
        {quote.discount > 0 && <PriceRow label={`Discount (${quote.discountPct}%)`} value={`−${fmt(quote.discount, currency)}`} color="#34d399" />}
        {quote.gst > 0 && <PriceRow label="GST (18%)" value={`+${fmt(quote.gst, currency)}`} />}
        <Divider style={{ margin: "10px 0" }} />
        <PriceRow label="Total" value={fmt(quote.total, currency)} bold big />
      </Card>

      {/* Payment schedule */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Payment Schedule</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#12152e", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid #34d39933" }}>
            <div style={{ fontSize: 11, color: "#34d399", marginBottom: 4 }}>Advance ({quote.advancePct}%)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399" }}>{fmt(quote.advanceAmount, currency)}</div>
          </div>
          <div style={{ background: "#12152e", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid #a78bfa33" }}>
            <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 4 }}>On Delivery ({100 - quote.advancePct}%)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#a78bfa" }}>{fmt(quote.remainingAmount, currency)}</div>
          </div>
        </div>
      </Card>

      {/* Milestones preview */}
      {(answers.milestones || []).length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <CardTitle>Milestones</CardTitle>
          {answers.milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < answers.milestones.length - 1 ? "1px solid #1e2140" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.name || `Milestone ${i + 1}`}</div>
                {m.date && <div style={{ fontSize: 11, color: "#4a5080" }}>{m.date}</div>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa" }}>{m.amount ? fmt(parseFloat(m.amount), currency) : "—"}</div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ fontSize: 11, color: "#4a5080", textAlign: "center", marginBottom: 20 }}>
        Estimate valid 30 days · Final pricing subject to detailed scope
      </div>

      {/* Primary action */}
      <button onClick={handlePDF} style={{
        width: "100%", padding: 15, borderRadius: 12, border: "none",
        background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff",
        fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "inherit",
      }}>⬇ Download PDF</button>

      {/* Share link — client portal */}
      <button onClick={handleShareLink} style={{
        width: "100%", padding: 13, borderRadius: 12, marginBottom: 10,
        border: `1.5px solid ${linkCopied ? "#34d399" : "#6c63ff"}`,
        background: linkCopied ? "#0d2e1f" : "#0d1028",
        color: linkCopied ? "#34d399" : "#a78bfa",
        fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s",
      }}>
        {linkCopied ? "✓ Link copied! Send it to your client" : "🔗 Share Client Portal Link"}
      </button>
      {linkCopied && (
        <div style={{ fontSize: 11, color: "#4a5080", textAlign: "center", marginBottom: 10, marginTop: -6 }}>
          Client opens the link → sees the quote → clicks Accept or Reject
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <Btn onClick={handleWhatsApp} variant="ghost" style={{ border: "1.5px solid #25D366", color: "#25D366", padding: 13, width: "100%" }}>💬 WhatsApp</Btn>
        <Btn onClick={handleEmail} variant="ghost" style={{ padding: 13, width: "100%" }}>📧 Email</Btn>
        <Btn onClick={handleCopy} variant="ghost" style={{ color: copied ? "#34d399" : "#8b9cf4", padding: 13, width: "100%" }}>{copied ? "✓ Copied!" : "📋 Copy Text"}</Btn>
        <Btn onClick={handleSave} variant="ghost" style={{ color: saved ? "#34d399" : "#8b9cf4", padding: 13, width: "100%" }}>{saved ? "✓ Saved!" : "🕒 Save"}</Btn>
      </div>

      <Btn onClick={onNew} variant="outline" style={{ width: "100%", padding: 13 }}>+ New Quote</Btn>
    </div>
  );
}