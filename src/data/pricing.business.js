// ─── CONSULTANT / BUSINESS PRICING ───────────────────────────────────────────

export const SERVICES = {
  consulting: {
    label: "Consulting Services",
    icon: "💼",
    base: {
      hourly: { label: "Hourly Consulting", price: 3000, desc: "Per hour, billed monthly" },
      halfDay: { label: "Half-Day Workshop", price: 20000, desc: "4 hours, on-site or remote" },
      fullDay: { label: "Full-Day Workshop", price: 35000, desc: "8 hours, on-site or remote" },
    },
    addons: {
      report: { label: "Detailed Report", price: 10000, icon: "📄" },
      followUp: { label: "30-Day Follow-up Support", price: 15000, icon: "📞" },
      implementation: { label: "Implementation Support", price: 25000, icon: "⚙️" },
      presentation: { label: "Board Presentation", price: 12000, icon: "📊" },
      research: { label: "Market Research", price: 20000, icon: "🔍" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 5000 },
      unlimited: { label: "Unlimited", price: 12000 },
    },
  },

  coaching: {
    label: "Coaching / Training",
    icon: "🎯",
    base: {
      session: { label: "Single Session (1hr)", price: 5000, desc: "One-on-one coaching session" },
      package5: { label: "5-Session Package", price: 20000, desc: "Save 20% vs single sessions" },
      package10: { label: "10-Session Package", price: 35000, desc: "Save 30%, 3 month program" },
    },
    addons: {
      workbook: { label: "Custom Workbook / Materials", price: 8000, icon: "📚" },
      groupSession: { label: "Group Session (up to 10)", price: 15000, icon: "👥" },
      recording: { label: "Session Recordings", price: 5000, icon: "🎬" },
      assessment: { label: "Initial Assessment", price: 6000, icon: "📋" },
      certification: { label: "Certificate of Completion", price: 3000, icon: "🏆" },
    },
    revisions: {
      none: { label: "No revisions needed", price: 0 },
    },
  },

  projectConsulting: {
    label: "Project Consulting",
    icon: "📋",
    base: {
      audit: { label: "Business Audit", price: 30000, desc: "Full analysis & recommendations" },
      strategy: { label: "Strategy Planning", price: 50000, desc: "6-month roadmap & execution plan" },
      transformation: { label: "Digital Transformation", price: 100000, desc: "End-to-end transformation project" },
    },
    addons: {
      stakeholder: { label: "Stakeholder Interviews", price: 15000, icon: "🤝" },
      competitorAnalysis: { label: "Competitor Analysis", price: 18000, icon: "🔍" },
      financialModel: { label: "Financial Modeling", price: 25000, icon: "📊" },
      legalReview: { label: "Legal Review Coordination", price: 20000, icon: "⚖️" },
      changeManagement: { label: "Change Management Plan", price: 30000, icon: "🔄" },
    },
    revisions: {
      "1": { label: "1 Round", price: 0 },
      "2": { label: "2 Rounds", price: 8000 },
      "3": { label: "3 Rounds", price: 15000 },
    },
  },

  retainer: {
    label: "Monthly Retainer",
    icon: "🔄",
    base: {
      advisory: { label: "Advisory Retainer", price: 20000, desc: "5 hrs/month advisory calls" },
      fractionalCXO: { label: "Fractional CXO", price: 60000, desc: "Part-time executive role" },
      fullRetainer: { label: "Full Retainer", price: 100000, desc: "Dedicated consulting support" },
    },
    addons: {
      weeklyCall: { label: "Weekly Check-in Call", price: 5000, icon: "📞" },
      reporting: { label: "Monthly KPI Report", price: 8000, icon: "📊" },
      teamTraining: { label: "Team Training Session", price: 12000, icon: "👥" },
    },
    revisions: {
      included: { label: "Included", price: 0 },
    },
  },
};

export const TIMELINE = {
  flexible: { label: "Flexible", duration: "As needed", multiplier: 1.0, desc: "Best price" },
  standard: { label: "Standard", duration: "2–4 weeks", multiplier: 1.1, desc: "+10%" },
  urgent: { label: "Urgent", duration: "Within 1 week", multiplier: 1.4, desc: "+40%" },
};

export const TIERS = {
  basic: { label: "Essential", multiplier: 0.8, desc: "Core services only", color: "#64748b" },
  standard: { label: "Professional", multiplier: 1.0, desc: "Full engagement", color: "#10b981" },
  premium: { label: "Executive", multiplier: 1.4, desc: "White-glove, priority access", color: "#f59e0b" },
};

export const USD_RATE = 83;