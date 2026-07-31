// ─── CONTRACTOR / TRADE PRICING ───────────────────────────────────────────────

export const SERVICES = {
  construction: {
    label: "Construction",
    icon: "🏗",
    base: {
      residential: { label: "Residential Construction", price: 500000, desc: "Per 1000 sq ft approx." },
      commercial: { label: "Commercial Construction", price: 1200000, desc: "Per 1000 sq ft approx." },
      renovation: { label: "Renovation / Remodeling", price: 200000, desc: "Full home/office renovation" },
    },
    addons: {
      architectural: { label: "Architectural Drawing", price: 50000, icon: "📐" },
      structural: { label: "Structural Engineering", price: 40000, icon: "🏛" },
      electrical: { label: "Electrical Work", price: 80000, icon: "⚡" },
      plumbing: { label: "Plumbing Work", price: 60000, icon: "🔧" },
      tiling: { label: "Tiling & Flooring", price: 70000, icon: "🪟" },
      painting: { label: "Painting & Finishing", price: 40000, icon: "🖌" },
      siteSupervision: { label: "Site Supervision (monthly)", price: 15000, icon: "👷" },
    },
    revisions: {
      "1": { label: "1 Design Revision", price: 0 },
      "2": { label: "2 Design Revisions", price: 15000 },
      "3": { label: "3 Design Revisions", price: 25000 },
    },
  },

  interior: {
    label: "Interior Design",
    icon: "🛋",
    base: {
      consultation: { label: "Design Consultation", price: 15000, desc: "Space planning & mood board" },
      partial: { label: "Partial Interior", price: 80000, desc: "2–3 rooms, full design" },
      full: { label: "Full Home Interior", price: 200000, desc: "Complete turnkey interior" },
    },
    addons: {
      furniture: { label: "Furniture Sourcing & Procurement", price: 30000, icon: "🪑" },
      lighting: { label: "Lighting Design", price: 20000, icon: "💡" },
      customFurniture: { label: "Custom Furniture Design", price: 40000, icon: "🪚" },
      supervision: { label: "On-site Supervision", price: 25000, icon: "👷" },
      vastu: { label: "Vastu Compliance Review", price: 10000, icon: "🧭" },
      smartHome: { label: "Smart Home Integration", price: 50000, icon: "📱" },
    },
    revisions: {
      "2": { label: "2 Design Rounds", price: 0 },
      "3": { label: "3 Design Rounds", price: 10000 },
      unlimited: { label: "Unlimited Revisions", price: 25000 },
    },
  },

  civilWork: {
    label: "Civil / Infrastructure",
    icon: "🚧",
    base: {
      roadWork: { label: "Road / Pathway Work", price: 150000, desc: "Per project estimate" },
      waterproofing: { label: "Waterproofing", price: 80000, desc: "Full building waterproofing" },
      foundation: { label: "Foundation Work", price: 300000, desc: "Per project estimate" },
    },
    addons: {
      soilTesting: { label: "Soil Testing Report", price: 15000, icon: "🧪" },
      qualityAudit: { label: "Quality Audit", price: 20000, icon: "✅" },
      permit: { label: "Permit & Approval Assistance", price: 25000, icon: "📋" },
      insurance: { label: "Site Insurance Coordination", price: 10000, icon: "🛡" },
    },
    revisions: {
      "1": { label: "1 Plan Revision", price: 0 },
      "2": { label: "2 Plan Revisions", price: 20000 },
    },
  },
};

export const TIMELINE = {
  normal: { label: "Normal", duration: "As per plan", multiplier: 1.0, desc: "Standard timeline" },
  expedited: { label: "Expedited", duration: "20% faster", multiplier: 1.2, desc: "+20% cost" },
  urgent: { label: "Urgent", duration: "ASAP", multiplier: 1.5, desc: "+50% cost" },
};

export const TIERS = {
  basic: { label: "Economy", multiplier: 0.8, desc: "Standard materials", color: "#64748b" },
  standard: { label: "Standard", multiplier: 1.0, desc: "Good quality materials", color: "#f87171" },
  premium: { label: "Premium", multiplier: 1.4, desc: "Best materials, warranty", color: "#f59e0b" },
};

export const USD_RATE = 83;