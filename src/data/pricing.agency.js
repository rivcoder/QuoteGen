// ─── AGENCY / STUDIO PRICING ──────────────────────────────────────────────────

export const SERVICES = {
  webProject: {
    label: "Web Project",
    icon: "🌐",
    base: {
      landing: { label: "Landing Page Campaign", price: 35000, desc: "Single page, high-conversion design" },
      corporate: { label: "Corporate Website", price: 80000, desc: "Multi-page, CMS, brand aligned" },
      webapp: { label: "Web Application", price: 180000, desc: "Full-stack, database, user auth" },
    },
    addons: {
      seo: { label: "SEO Setup & Strategy", price: 20000, icon: "🔍" },
      analytics: { label: "Analytics & Reporting", price: 12000, icon: "📊" },
      cms: { label: "CMS Training (team)", price: 8000, icon: "📝" },
      maintenance: { label: "Monthly Maintenance", price: 15000, icon: "🔧" },
      hosting: { label: "Managed Hosting Setup", price: 10000, icon: "☁️" },
      security: { label: "Security Audit", price: 18000, icon: "🔐" },
      performance: { label: "Performance Optimization", price: 14000, icon: "⚡" },
      support: { label: "Priority Support (3mo)", price: 25000, icon: "🎯" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "4": { label: "4 Rounds", price: 10000 },
      unlimited: { label: "Unlimited", price: 25000 },
    },
  },

  brandCampaign: {
    label: "Brand & Campaign",
    icon: "🎨",
    base: {
      rebrand: { label: "Brand Refresh", price: 60000, desc: "Logo, colors, typography update" },
      fullBrand: { label: "Full Brand Identity", price: 150000, desc: "Complete brand system & guidelines" },
      campaign: { label: "Marketing Campaign", price: 80000, desc: "Multi-channel campaign design" },
    },
    addons: {
      socialKit: { label: "Social Media Kit", price: 20000, icon: "📣" },
      adCreatives: { label: "Ad Creatives (10 sets)", price: 30000, icon: "🖼️" },
      videoScript: { label: "Video Script & Storyboard", price: 25000, icon: "🎬" },
      printCollateral: { label: "Print Collateral", price: 20000, icon: "🖨️" },
      brandGuide: { label: "Brand Guidelines PDF", price: 15000, icon: "📘" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "4": { label: "4 Rounds", price: 15000 },
      unlimited: { label: "Unlimited", price: 35000 },
    },
  },

  retainer: {
    label: "Monthly Retainer",
    icon: "🔄",
    base: {
      basic: { label: "Basic Retainer", price: 30000, desc: "Up to 20 hrs/month" },
      standard: { label: "Standard Retainer", price: 60000, desc: "Up to 50 hrs/month" },
      premium: { label: "Premium Retainer", price: 120000, desc: "Dedicated team, unlimited requests" },
    },
    addons: {
      reporting: { label: "Monthly Report & Analytics", price: 8000, icon: "📊" },
      strategyCall: { label: "Monthly Strategy Call", price: 5000, icon: "📞" },
      priorityTurnaround: { label: "24hr Priority Turnaround", price: 15000, icon: "⚡" },
    },
    revisions: {
      included: { label: "Included in retainer", price: 0 },
    },
  },

  digitalMarketing: {
    label: "Digital Marketing",
    icon: "📈",
    base: {
      social: { label: "Social Media Management", price: 25000, desc: "3 platforms, 12 posts/month" },
      ppc: { label: "PPC Campaign Management", price: 35000, desc: "Google/Meta ads, monthly" },
      contentMarketing: { label: "Content Marketing", price: 40000, desc: "Blog, SEO, email monthly" },
    },
    addons: {
      adSpend: { label: "Ad Spend Management", price: 10000, icon: "💰" },
      influencer: { label: "Influencer Outreach", price: 20000, icon: "🌟" },
      emailCampaign: { label: "Email Campaign (monthly)", price: 12000, icon: "📧" },
      videoAds: { label: "Video Ad Creation", price: 30000, icon: "🎬" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "3": { label: "3 Rounds", price: 8000 },
    },
  },
};

export const TIMELINE = {
  relaxed: { label: "Relaxed", duration: "8–10 weeks", multiplier: 1.0, desc: "Best price" },
  standard: { label: "Standard", duration: "4–6 weeks", multiplier: 1.15, desc: "+15%" },
  urgent: { label: "Rush", duration: "2–3 weeks", multiplier: 1.5, desc: "+50%" },
};

export const TIERS = {
  basic: { label: "Starter", multiplier: 0.75, desc: "Core deliverables", color: "#64748b" },
  standard: { label: "Standard", multiplier: 1.0, desc: "Full scope", color: "#f59e0b" },
  premium: { label: "Premium", multiplier: 1.5, desc: "White glove, priority", color: "#ef4444" },
};

export const USD_RATE = 83;