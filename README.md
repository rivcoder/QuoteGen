# ⚡ QuoteGen

**Professional quotation tool for freelancers, agencies, consultants and contractors.**

Generate detailed project quotes, export as PDF, share via WhatsApp or email, and send clients a portal link to accept or reject — all without a backend.

---

## Features

### Quote Builder
- Multi-step quote form with 10 sections
- Mixed pricing modes — fixed price, hourly rate, quantity-based, and custom line items on the same quote
- Service add-ons, revision rounds, timeline multipliers
- Discount slider (0–90%) and GST (18%) support
- INR and USD currency toggle
- Live total that updates as you build

### Client & Project Info
- Freelancer profile with logo upload (PNG/JPG/WebP, max 5MB)
- Client name, company, email, phone
- Project name, description, category, start/end dates
- Scope included / excluded / deliverables
- Target platform (web, mobile, desktop)

### Payment Terms
- Advance % slider with live amount preview
- Payment method selection (UPI, bank transfer, PayPal, etc.)
- UPI ID / bank details field shown on PDF
- Late payment charge % and grace period

### Milestones
- Add milestone rows with name, date, amount
- Auto-split button divides total equally across milestones
- Validation shows if milestones match quote total

### Terms & Conditions
- Pre-written contract auto-filled from your quote data (revision count, late fee %, freelancer name)
- Fully editable per client
- Reset to default button
- Optional client approval / signature section on PDF

### PDF Export
- Full professional PDF with freelancer branding, logo, client info, scope, pricing, milestones, T&C, signature line
- Package comparison (Basic / Standard / Premium tiers)
- Payment schedule shown
- Opens browser print dialog — save as PDF

### Client Portal
- One-click shareable link — no login required for client
- Client sees a clean read-only quote view
- Accept or Decline with optional note
- Decision recorded with timestamp

### Sharing
- WhatsApp — pre-filled message with project summary and total
- Email — opens mail client with professional subject + body
- Copy plain text — fallback for any platform

### Templates & History
- Save current quote as a named template
- Load template to pre-fill the entire form
- Up to 15 templates, 20 quote history entries
- All stored in browser localStorage

### Mode System
Pick your profile on first use — the form, services and pricing adapt to your industry:
- 🧑‍💻 Freelancer (web dev, design, content, mobile, UI/UX)
- 🏢 Agency / Studio (web projects, brand campaigns, retainers, digital marketing)
- 👔 Consultant (hourly, coaching, project consulting, fractional CXO)
- 🏗 Contractor (construction, interior design, civil work)
- 🛒 Product Seller (digital products, physical goods, wholesale)
- ✏️ Custom (start from freelancer base)

### Security
- PIN lock — 4-digit PIN hashed with SHA-256 (Web Crypto API) before storage
- XSS protection — all user input sanitized before going into PDF HTML
- SVG logos blocked — only PNG, JPG, WebP accepted
- localStorage bomb prevention — logo stripped from history and template entries
- Template key injection prevention — allowlist of ~60 known keys on load
- Financial overflow protection — all numeric inputs clamped, fmt() returns ₹0 for NaN/Infinity
- Zero API keys or credentials in code
- No external network calls

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 (Create React App) |
| Styling | Inline CSS-in-JS — no external CSS library |
| PDF | Browser Print API (window.open + window.print) |
| PIN Security | Web Crypto API (SHA-256) |
| Storage | localStorage (per-device, per-browser) |
| Sharing | WhatsApp URL API, mailto:, Clipboard API |
| Portal encoding | btoa / atob + JSON |

---

## Pricing Formula

```
Base Price
+ Pages Cost (website only)
+ Add-on Features
+ Revision Cost
+ Line Items (hourly/quantity/fixed/custom)
× Timeline Multiplier
− Discount (%)
+ GST (18%)
= Total

Advance = Total × advancePct%
Remaining = Total − Advance
```

---

## Known Limitations

- PDF requires browser popup permission
- No backend means no cross-device sync
- Client portal response not visible to freelancer without checking manually
- USD exchange rate hardcoded at ₹83

---

## License

MIT — free to use, modify and distribute.

---

Built with React. No external UI libraries. No backend required.
