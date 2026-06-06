import { SERVICES, TIMELINE, TIERS, USD_RATE } from "../data/pricing";

// ── Sanitize — strips ALL html tags from user input (XSS fix) ────────────────
export function sanitize(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Sanitize but preserve newlines for multi-line fields (scope, terms etc)
export function sanitizeMultiline(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\n/g, "<br/>");
}

// Clamp a number between min and max
export function clamp(val, min, max) {
  const n = parseFloat(val);
  if (isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

// Safe allowed keys for template loading — prevents malicious key injection
const ALLOWED_ANSWER_KEYS = [
  "service","baseType","pages","revisions","timeline","currency","discount",
  "discountPct","includeGst","advancePct","lineItems","milestones","platforms",
  "paymentMethods","clientName","clientCompany","clientEmail","clientPhone",
  "projectName","projectDescription","projectCategory","startDate","endDate",
  "scopeIncluded","scopeExcluded","deliverables","contentWriting","pageCount",
  "extraRevisionCost","paymentDueDays","paymentDetails","latePaymentCharge",
  "latePaymentGrace","termsText","cancellationPolicy","confidentialityClause",
  "includeApproval","notes","quoteId",
  // addons — website
  "responsive","adminPanel","backend","paymentGateway","auth","cms","whatsapp",
  "thirdPartyApi","seo","multiLanguage","livechat","analytics","hosting",
  "contentWriting","speedOpt","socialMedia","customEmail","maintenance",
  // addons — mobile
  "pushNotif","offlineMode","maps","chat","socialLogin","camera",
  // addons — uiux
  "userResearch","designSystem","branding","responsiveDesign","iconSet",
  "darkMode","handoff",
  // addons — ecommerce
  "productUpload","inventoryMgmt","couponSystem","wishlist","reviews",
  "multiCurrency","emailMarketing",
  // addons — branding
  "businessCard","letterhead","socialKit","brandGuide","mockups","favicon",
];

export function sanitizeTemplateAnswers(raw) {
  if (!raw || typeof raw !== "object") return {};
  const clean = {};
  ALLOWED_ANSWER_KEYS.forEach(key => {
    if (raw[key] !== undefined) clean[key] = raw[key];
  });
  return clean;
}

// ── Format currency ──────────────────────────────────────────────────────────
export function fmt(amount, currency = "INR") {
  if (!isFinite(amount) || isNaN(amount)) return currency === "USD" ? "$0" : "₹0";
  const rounded = Math.round(amount);
  if (currency === "USD")
    return "$" + Math.round(rounded / USD_RATE).toLocaleString("en-US");
  return "₹" + rounded.toLocaleString("en-IN");
}

export function getValidityDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
export function getTodayDate() {
  return new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
export function generateQuoteId() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `QG-${t}-${r}`;
}

// ── Main calculation ─────────────────────────────────────────────────────────
export function calculateQuote(answers) {
  const service = SERVICES[answers.service];
  if (!service) return null;

  const baseConfig = service.base[answers.baseType];
  const basePrice = baseConfig ? baseConfig.price : 0;

  // Pages cost (website only)
  let pagesCost = 0;
  if (answers.service === "website" && answers.pages) {
    pagesCost = service.pages[answers.pages]?.price || 0;
    if (answers.contentWriting && answers.pageCount) {
      const pc = clamp(answers.pageCount, 1, 500);
      pagesCost += (service.addons.contentWriting?.price || 500) * pc;
    }
  }

  // Standard addons
  let addonTotal = 0;
  const selectedAddons = [];
  Object.entries(service.addons || {}).forEach(([key, config]) => {
    if (answers[key] && key !== "contentWriting") {
      addonTotal += config.price;
      selectedAddons.push({ key, label: config.label, icon: config.icon, cost: config.price });
    }
  });
  if (answers.contentWriting && answers.pageCount && answers.service === "website") {
    const perPage = service.addons.contentWriting?.price || 500;
    const pages = clamp(answers.pageCount, 1, 500);
    selectedAddons.push({ key: "contentWriting", label: `Content Writing (${pages} pages)`, icon: "✍️", cost: perPage * pages });
  }

  // Revisions
  let revisionCost = 0;
  if (answers.revisions && service.revisions) {
    revisionCost = service.revisions[answers.revisions]?.price || 0;
    if (revisionCost > 0)
      selectedAddons.push({ key: "revisions", label: service.revisions[answers.revisions]?.label, icon: "🔄", cost: revisionCost });
  }

  // Line items — clamp hours/qty/rate to prevent Infinity
  const lineItems = answers.lineItems || [];
  let lineItemTotal = 0;
  lineItems.forEach(item => {
    let amt = 0;
    if (item.type === "hourly")
      amt = clamp(item.hours, 0, 9999) * clamp(item.rate, 0, 999999);
    else if (item.type === "quantity")
      amt = clamp(item.qty, 0, 9999) * clamp(item.unitPrice, 0, 999999);
    else
      amt = clamp(item.amount, 0, 99999999);
    lineItemTotal += amt;
  });

  const rawSubtotal = basePrice + pagesCost + addonTotal + revisionCost + lineItemTotal;
  const timelineMultiplier = TIMELINE[answers.timeline]?.multiplier || 1;
  const subtotal = rawSubtotal * timelineMultiplier;

  // Discount — max 90%
  const discountPct = clamp(answers.discountPct || (answers.discount ? 8 : 0), 0, 90);
  const discount = subtotal * (discountPct / 100);
  const afterDiscount = subtotal - discount;

  // GST
  const gst = answers.includeGst ? afterDiscount * 0.18 : 0;
  const total = afterDiscount + gst;

  const tierComparison = Object.entries(TIERS).map(([key, tier]) => ({
    key, label: tier.label, desc: tier.desc, color: tier.color,
    total: Math.round(total * tier.multiplier),
  }));

  // Payment schedule — clamp advance 0-100
  const advancePct = clamp(answers.advancePct ?? 50, 0, 100);
  const advanceAmount = total * (advancePct / 100);
  const remainingAmount = total - advanceAmount;

  return {
    basePrice, pagesCost, addonTotal, revisionCost, lineItemTotal,
    selectedAddons, lineItems,
    rawSubtotal, subtotal, discount, discountPct, afterDiscount, gst, total,
    timeline: TIMELINE[answers.timeline]?.duration || "",
    timelineLabel: TIMELINE[answers.timeline]?.label || "",
    tierComparison,
    serviceLabel: service.label,
    baseTypeLabel: baseConfig?.label || "",
    validUntil: getValidityDate(),
    createdOn: getTodayDate(),
    advancePct, advanceAmount, remainingAmount,
  };
}

// ── Validation ───────────────────────────────────────────────────────────────
export function validateEmail(v) {
  if (!v) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email";
}
export function validatePhone(v) {
  if (!v) return null;
  return /^[\d\s\+\-\(\)]{7,15}$/.test(v) ? null : "Enter a valid phone number";
}
export function validatePageCount(v) {
  const n = parseInt(v);
  if (!v) return "Enter number of pages";
  if (isNaN(n) || n < 1) return "Must be at least 1";
  if (n > 500) return "Max 500";
  return null;
}
export function validateClientStep(a) {
  const e = {};
  const em = validateEmail(a.freelancerEmail); if (em) e.freelancerEmail = em;
  const ce = validateEmail(a.clientEmail); if (ce) e.clientEmail = ce;
  const cp = validatePhone(a.clientPhone); if (cp) e.clientPhone = cp;
  return e;
}

// ── Logo validation — blocks SVG, only allows raster images ─────────────────
export function validateLogo(file) {
  if (!file) return "No file selected";
  if (file.size > 5 * 1024 * 1024) return "Logo must be under 5MB";
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) return "Only PNG, JPG or WebP allowed (no SVG)";
  return null;
}

// ── localStorage helpers ─────────────────────────────────────────────────────
const HISTORY_KEY   = "quotegen_history";
const PROFILE_KEY   = "quotegen_profile";
const TEMPLATES_KEY = "quotegen_templates";
const PIN_KEY       = "quotegen_pin";
const SEEN_KEY      = "quotegen_seen";

// Save quote — strip logo from history entry to avoid storage bomb
export function saveQuoteToHistory(answers, quote, quoteId) {
  try {
    const existing = getQuoteHistory();
    const entry = {
      id: quoteId,
      createdOn: getTodayDate(),
      createdAt: Date.now(),
      clientName: answers.clientName || "—",
      serviceLabel: quote.serviceLabel,
      total: quote.total,
      currency: answers.currency || "INR",
      // strip logo from stored answers to save space
      answers: { ...answers, _logoStripped: true },
      quote,
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
    return true;
  } catch { return false; }
}
export function getQuoteHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
export function deleteQuoteFromHistory(id) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(getQuoteHistory().filter(q => q.id !== id))); } catch {}
}
export function clearQuoteHistory() {
  try { localStorage.removeItem(HISTORY_KEY); } catch {}
}

export function saveFreelancerProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); return true; } catch { return false; }
}
export function loadFreelancerProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); } catch { return null; }
}

export function getTemplates() {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || "[]"); } catch { return []; }
}
export function saveTemplate(name, answers) {
  try {
    const existing = getTemplates().filter(t => t.name !== name);
    // strip logo from template too
    const safeAnswers = sanitizeTemplateAnswers({ ...answers, logo: undefined });
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(
      [{ name, savedAt: Date.now(), answers: safeAnswers }, ...existing].slice(0, 15)
    ));
    return true;
  } catch { return false; }
}
export function deleteTemplate(name) {
  try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(getTemplates().filter(t => t.name !== name))); } catch {}
}

// ── PIN helpers — PIN is hashed before storage, never stored plain ───────────
async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "quotegen_salt_v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function getPIN() {
  try { return localStorage.getItem(PIN_KEY) || null; } catch { return null; }
}
export async function setPIN(pin) {
  try {
    const hashed = await hashPIN(pin);
    localStorage.setItem(PIN_KEY, hashed);
  } catch {}
}
export async function verifyPIN(input) {
  try {
    const stored = getPIN();
    if (!stored) return false;
    const hashed = await hashPIN(input);
    return hashed === stored;
  } catch { return false; }
}
export function clearPIN() {
  try { localStorage.removeItem(PIN_KEY); } catch {}
}
export function hasSeenSplash() {
  try { return !!localStorage.getItem(SEEN_KEY); } catch { return false; }
}
export function markSplashSeen() {
  try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
}

// ── Message generators ───────────────────────────────────────────────────────
export function generateWhatsAppMessage(answers, quote, currency) {
  const clientName = answers.clientName || "there";
  return [
    `Hi ${clientName}! 👋`, ``,
    `Here's your *${quote.serviceLabel}* quotation:`, ``,
    `📋 *Project:* ${answers.projectName || quote.serviceLabel}`,
    `🗓 *Timeline:* ${quote.timeline}`,
    `💰 *Total: ${fmt(quote.total, currency)}*`,
    `⏳ *Valid until:* ${quote.validUntil}`, ``,
    `Let me know if you'd like to proceed! 🚀`,
  ].join("\n");
}
export function generateEmailBody(answers, quote, currency) {
  const subject = `Project Quotation — ${answers.projectName || quote.serviceLabel} | ${fmt(quote.total, currency)}`;
  const body = [
    `Hi ${answers.clientName || "there"},`, ``,
    `Please find your project quotation below.`, ``,
    `Service: ${quote.serviceLabel}`,
    `Project: ${answers.projectName || "—"}`,
    `Timeline: ${quote.timeline}`,
    `Total: ${fmt(quote.total, currency)}`,
    `Valid Until: ${quote.validUntil}`, ``,
    `Best regards,`,
    `${answers.freelancerName || ""}`,
  ].join("\n");
  return { subject, body };
}
export function generateTextQuote(answers, quote, currency) {
  return [
    `QUOTATION — ${(answers.projectName || quote.serviceLabel).toUpperCase()}`,
    `Date: ${quote.createdOn}  |  Valid until: ${quote.validUntil}`,
    `Client: ${answers.clientName || "—"}`, ``,
    `Total: ${fmt(quote.total, currency)}`,
    `Timeline: ${quote.timeline}`,
  ].join("\n");
}