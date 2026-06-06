// ─── PRICING DATA ─────────────────────────────────────────────────────────────
// Edit these values to match your own rates

export const SERVICES = {
  website: {
    label: "Website Development",
    icon: "🌐",
    base: {
      static: { label: "Static Website", price: 8000, desc: "Portfolio / Brochure / Landing page" },
      dynamic: { label: "Dynamic Website", price: 18000, desc: "Database-driven, custom features" },
    },
    pages: {
      "1-5": { label: "1–5 pages", price: 0 },
      "6-10": { label: "6–10 pages", price: 4000 },
      "11-20": { label: "11–20 pages", price: 9000 },
      "20+": { label: "20+ pages", price: 18000 },
    },
    addons: {
      responsive: { label: "Responsive / Mobile Design", price: 3000, icon: "📱" },
      adminPanel: { label: "Admin Panel", price: 6000, icon: "🖥️" },
      backend: { label: "Backend / Server-side", price: 8000, icon: "⚙️" },
      paymentGateway: { label: "Payment Gateway", price: 7000, icon: "💳" },
      auth: { label: "User Authentication", price: 5000, icon: "🔐" },
      cms: { label: "CMS Integration", price: 6000, icon: "📝" },
      whatsapp: { label: "WhatsApp Integration", price: 3500, icon: "💬" },
      thirdPartyApi: { label: "3rd Party API", price: 5000, icon: "🔗" },
      seo: { label: "SEO Optimization", price: 4000, icon: "🔍" },
      multiLanguage: { label: "Multi-Language", price: 5000, icon: "🌐" },
      livechat: { label: "Live Chat", price: 3000, icon: "🗨️" },
      analytics: { label: "Analytics Dashboard", price: 2500, icon: "📊" },
      hosting: { label: "Hosting & Domain Setup", price: 2000, icon: "☁️" },
      contentWriting: { label: "Content Writing", price: 500, icon: "✍️", perPage: true },
      speedOpt: { label: "Speed Optimization", price: 3000, icon: "⚡" },
      socialMedia: { label: "Social Media Integration", price: 1500, icon: "📣" },
      customEmail: { label: "Custom Email Setup", price: 1500, icon: "📧" },
      maintenance: { label: "Maintenance Plan (monthly)", price: 2000, icon: "🔧" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 1500 },
      "3": { label: "3 Revisions", price: 2500 },
      unlimited: { label: "Unlimited Revisions", price: 5000 },
    },
  },

  mobileApp: {
    label: "Mobile App Development",
    icon: "📱",
    base: {
      android: { label: "Android Only", price: 25000, desc: "Native Android app" },
      ios: { label: "iOS Only", price: 30000, desc: "Native iOS app" },
      both: { label: "Android + iOS", price: 50000, desc: "Cross-platform (React Native / Flutter)" },
    },
    addons: {
      auth: { label: "User Authentication", price: 5000, icon: "🔐" },
      paymentGateway: { label: "Payment Gateway", price: 8000, icon: "💳" },
      pushNotif: { label: "Push Notifications", price: 4000, icon: "🔔" },
      adminPanel: { label: "Admin Panel", price: 8000, icon: "🖥️" },
      offlineMode: { label: "Offline Mode", price: 6000, icon: "📶" },
      maps: { label: "Maps / Location", price: 5000, icon: "📍" },
      chat: { label: "In-app Chat", price: 7000, icon: "💬" },
      analytics: { label: "Analytics", price: 3000, icon: "📊" },
      socialLogin: { label: "Social Login (Google/FB)", price: 3500, icon: "🔑" },
      camera: { label: "Camera / Media Upload", price: 4000, icon: "📷" },
      hosting: { label: "Backend Hosting Setup", price: 3000, icon: "☁️" },
      maintenance: { label: "Maintenance Plan (monthly)", price: 3000, icon: "🔧" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 2000 },
      "3": { label: "3 Revisions", price: 3500 },
      unlimited: { label: "Unlimited Revisions", price: 7000 },
    },
  },

  uiux: {
    label: "UI/UX Design",
    icon: "🎨",
    base: {
      wireframe: { label: "Wireframes Only", price: 5000, desc: "Low-fidelity structure & flow" },
      mockup: { label: "UI Mockups", price: 12000, desc: "High-fidelity static designs" },
      prototype: { label: "Interactive Prototype", price: 20000, desc: "Clickable Figma prototype" },
    },
    addons: {
      userResearch: { label: "User Research", price: 5000, icon: "🔍" },
      designSystem: { label: "Design System / Style Guide", price: 8000, icon: "📐" },
      branding: { label: "Brand Identity Integration", price: 6000, icon: "🎯" },
      responsiveDesign: { label: "Responsive Screens (mobile+desktop)", price: 4000, icon: "📱" },
      iconSet: { label: "Custom Icon Set", price: 3500, icon: "✨" },
      darkMode: { label: "Dark Mode Variant", price: 3000, icon: "🌙" },
      handoff: { label: "Developer Handoff (Zeplin/Figma)", price: 2000, icon: "🤝" },
      contentWriting: { label: "UX Copywriting", price: 3000, icon: "✍️" },
      maintenance: { label: "Design Maintenance (monthly)", price: 1500, icon: "🔧" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 1000 },
      "3": { label: "3 Revisions", price: 2000 },
      unlimited: { label: "Unlimited Revisions", price: 4000 },
    },
  },

  ecommerce: {
    label: "E-commerce Store",
    icon: "🛒",
    base: {
      shopify: { label: "Shopify Store", price: 15000, desc: "Theme customization + setup" },
      woocommerce: { label: "WooCommerce (WordPress)", price: 20000, desc: "Full WooCommerce setup" },
      custom: { label: "Custom Built", price: 40000, desc: "Fully custom e-commerce solution" },
    },
    addons: {
      productUpload: { label: "Product Upload (up to 50)", price: 3000, icon: "📦" },
      paymentGateway: { label: "Payment Gateway (Razorpay/Stripe)", price: 5000, icon: "💳" },
      inventoryMgmt: { label: "Inventory Management", price: 6000, icon: "📋" },
      couponSystem: { label: "Coupon / Discount System", price: 3000, icon: "🏷️" },
      wishlist: { label: "Wishlist Feature", price: 2500, icon: "❤️" },
      reviews: { label: "Product Reviews & Ratings", price: 2500, icon: "⭐" },
      multiCurrency: { label: "Multi-Currency Support", price: 4000, icon: "💱" },
      seo: { label: "SEO Optimization", price: 4000, icon: "🔍" },
      emailMarketing: { label: "Email Marketing Integration", price: 3500, icon: "📧" },
      analytics: { label: "Sales Analytics Dashboard", price: 4000, icon: "📊" },
      hosting: { label: "Hosting & Domain Setup", price: 2000, icon: "☁️" },
      maintenance: { label: "Maintenance Plan (monthly)", price: 2500, icon: "🔧" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 2000 },
      "3": { label: "3 Revisions", price: 3000 },
      unlimited: { label: "Unlimited Revisions", price: 6000 },
    },
  },

  branding: {
    label: "Logo + Branding",
    icon: "✨",
    base: {
      logo: { label: "Logo Only", price: 3000, desc: "3 concepts, 2 revisions" },
      basic: { label: "Basic Branding", price: 8000, desc: "Logo + colors + typography" },
      full: { label: "Full Brand Identity", price: 20000, desc: "Logo + guidelines + all assets" },
    },
    addons: {
      businessCard: { label: "Business Card Design", price: 1500, icon: "🪪" },
      letterhead: { label: "Letterhead & Invoice Template", price: 2000, icon: "📄" },
      socialKit: { label: "Social Media Kit", price: 3000, icon: "📣" },
      brandGuide: { label: "Brand Guidelines PDF", price: 4000, icon: "📘" },
      mockups: { label: "Brand Mockups", price: 2500, icon: "🖼️" },
      favicon: { label: "Favicon + App Icon", price: 1000, icon: "⭐" },
      maintenance: { label: "Brand Support (monthly)", price: 1000, icon: "🔧" },
    },
    revisions: {
      "1": { label: "1 Revision", price: 0 },
      "2": { label: "2 Revisions", price: 800 },
      "3": { label: "3 Revisions", price: 1500 },
      unlimited: { label: "Unlimited Revisions", price: 3000 },
    },
  },
};

export const TIMELINE = {
  relaxed: { label: "Relaxed", duration: "6–8 weeks", multiplier: 1.0, desc: "Best price" },
  standard: { label: "Standard", duration: "4–6 weeks", multiplier: 1.1, desc: "+10%" },
  urgent: { label: "Urgent", duration: "2–3 weeks", multiplier: 1.3, desc: "+30%" },
};

export const TIERS = {
  basic: {
    label: "Basic",
    multiplier: 0.75,
    desc: "Core features only, minimal design",
    color: "#64748b",
  },
  standard: {
    label: "Standard",
    multiplier: 1.0,
    desc: "Balanced quality and features",
    color: "#6c63ff",
  },
  premium: {
    label: "Premium",
    multiplier: 1.4,
    desc: "Top quality, priority support",
    color: "#f59e0b",
  },
};

export const USD_RATE = 83;