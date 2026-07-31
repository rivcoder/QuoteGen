// ─── PRODUCT SELLER PRICING ───────────────────────────────────────────────────

export const SERVICES = {
  digitalProducts: {
    label: "Digital Products",
    icon: "💻",
    base: {
      template: { label: "Template / UI Kit", price: 2000, desc: "Single digital product" },
      course: { label: "Online Course", price: 5000, desc: "Full course creation & delivery" },
      software: { label: "Software / SaaS Product", price: 50000, desc: "Custom software license" },
    },
    addons: {
      customization: { label: "Customization Service", price: 5000, icon: "✏️" },
      installation: { label: "Installation & Setup", price: 3000, icon: "⚙️" },
      support: { label: "3-Month Support", price: 8000, icon: "🎧" },
      updates: { label: "1-Year Updates", price: 5000, icon: "🔄" },
      license: { label: "Extended License", price: 10000, icon: "📄" },
    },
    revisions: {
      none: { label: "No revisions (digital product)", price: 0 },
      "1": { label: "1 Customization Round", price: 3000 },
    },
  },

  physicalGoods: {
    label: "Physical Products",
    icon: "📦",
    base: {
      small: { label: "Small Order (1–10 units)", price: 5000, desc: "Per batch pricing" },
      medium: { label: "Medium Order (11–50 units)", price: 20000, desc: "Bulk discount applied" },
      large: { label: "Large Order (51–200 units)", price: 60000, desc: "Wholesale pricing" },
    },
    addons: {
      customPacking: { label: "Custom Packaging", price: 8000, icon: "🎁" },
      branding: { label: "Product Branding / Labels", price: 5000, icon: "🏷" },
      shipping: { label: "Shipping & Handling", price: 3000, icon: "🚚" },
      insurance: { label: "Shipping Insurance", price: 2000, icon: "🛡" },
      qualityCheck: { label: "Quality Inspection", price: 4000, icon: "✅" },
    },
    revisions: {
      none: { label: "No revisions", price: 0 },
      sample: { label: "Sample Approval Round", price: 5000 },
    },
  },

  wholesale: {
    label: "Wholesale / B2B Supply",
    icon: "🏭",
    base: {
      trial: { label: "Trial Order", price: 15000, desc: "Small trial batch for new buyers" },
      regular: { label: "Regular Supply Order", price: 50000, desc: "Monthly supply contract" },
      annual: { label: "Annual Supply Contract", price: 400000, desc: "12-month committed supply" },
    },
    addons: {
      exclusivity: { label: "Exclusivity Agreement", price: 20000, icon: "🔒" },
      dedicatedAccount: { label: "Dedicated Account Manager", price: 10000, icon: "👤" },
      priorityStock: { label: "Priority Stock Allocation", price: 8000, icon: "⚡" },
      creditTerms: { label: "Net-30 Credit Terms", price: 5000, icon: "📅" },
    },
    revisions: {
      none: { label: "Standard terms apply", price: 0 },
    },
  },
};

export const TIMELINE = {
  standard: { label: "Standard", duration: "7–10 days", multiplier: 1.0, desc: "Regular delivery" },
  express: { label: "Express", duration: "3–5 days", multiplier: 1.2, desc: "+20%" },
  sameDay: { label: "Same Day", duration: "24 hours", multiplier: 1.5, desc: "+50%" },
};

export const TIERS = {
  basic: { label: "Basic", multiplier: 0.9, desc: "Standard spec", color: "#64748b" },
  standard: { label: "Standard", multiplier: 1.0, desc: "Regular quality", color: "#38bdf8" },
  premium: { label: "Premium", multiplier: 1.3, desc: "Top quality, priority", color: "#f59e0b" },
};

export const USD_RATE = 83;