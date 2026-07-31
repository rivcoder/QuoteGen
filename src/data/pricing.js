// ─── FREELANCER PRICING ──────────────────
export const SERVICES = {
  website: {
    label: "Website Development",
    icon: "🌐",
    base: {
      landing: { label: "Landing Page", price: 7000, desc: "Single page, modern responsive layout" },
      standard: { label: "Standard Website", price: 14000, desc: "Multi-page website (up to 5 pages), CMS integration" },
      webapp: { label: "Web Application", price: 22000, desc: "Custom features, user profiles, database, dynamic UI" },
    },
    pages: {
      "1": { label: "1 Page", price: 0 },
      "5": { label: "Up to 5 Pages", price: 1000 },
      "10": { label: "Up to 10 Pages", price: 2000 },
      "20": { label: "Up to 20 Pages", price: 3000 },
    },
    addons: {
      responsive: { label: "Mobile Responsive design", price: 1000, icon: "📱" },
      adminPanel: { label: "Admin Panel / CMS", price: 1500, icon: "🛡" },
      backend: { label: "Backend API Integration", price: 1500, icon: "⚙️" },
      paymentGateway: { label: "Payment Gateway Setup", price: 1500, icon: "💳" },
      auth: { label: "User Authentication", price: 1000, icon: "🔐" },
      cms: { label: "CMS Integration (WordPress/Strapi)", price: 1500, icon: "📝" },
      whatsapp: { label: "WhatsApp Chat Integration", price: 500, icon: "💬" },
      thirdPartyApi: { label: "Third-party API Integration", price: 1000, icon: "🔌" },
      seo: { label: "Basic SEO Setup", price: 1000, icon: "🔍" },
      multiLanguage: { label: "Multi-language Support", price: 1000, icon: "🌐" },
      livechat: { label: "Live Chat Integration", price: 800, icon: "💬" },
      analytics: { label: "Google Analytics Setup", price: 500, icon: "📊" },
      hosting: { label: "Deployment & Hosting Setup", price: 1000, icon: "☁️" },
      contentWriting: { label: "Content Writing (per page)", price: 500, icon: "✍️" },
      speedOpt: { label: "Speed & Performance Optimization", price: 800, icon: "⚡" },
      socialMedia: { label: "Social Media Integration", price: 500, icon: "📣" },
      customEmail: { label: "Custom Domain Email Setup", price: 500, icon: "📧" },
      maintenance: { label: "1-Month Maintenance Support", price: 1500, icon: "🔧" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "5": { label: "5 Rounds", price: 1000 },
      unlimited: { label: "Unlimited", price: 1500 },
    },
  },

  mobileApp: {
    label: "Mobile App Development",
    icon: "📱",
    base: {
      mvp: { label: "MVP App", price: 12000, desc: "Simple functionality, core flows, iOS & Android" },
      standard: { label: "Standard App", price: 18000, desc: "User profiles, database, push notifications, APIs" },
      premium: { label: "Premium Enterprise App", price: 24000, desc: "Complex logic, real-time data, high-security, custom backend" },
    },
    addons: {
      pushNotif: { label: "Push Notifications", price: 800, icon: "🔔" },
      offlineMode: { label: "Offline Mode support", price: 1000, icon: "💾" },
      maps: { label: "Maps & Geolocation", price: 1200, icon: "📍" },
      chat: { label: "In-App Chat / Messaging", price: 1500, icon: "💬" },
      socialLogin: { label: "Social Logins (Google/Apple)", price: 500, icon: "🔑" },
      camera: { label: "Camera & Media Uploads", price: 800, icon: "📷" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "5": { label: "5 Rounds", price: 1000 },
      unlimited: { label: "Unlimited", price: 1500 },
    },
  },

  uiux: {
    label: "UI/UX Design",
    icon: "🎨",
    base: {
      wireframes: { label: "Wireframes & Flowcharts", price: 6000, desc: "Low-fidelity UX blueprints, user journeys" },
      landingDesign: { label: "Landing Page Design", price: 12000, desc: "High-fidelity visual design, responsive layouts" },
      fullDesign: { label: "Full App/Website Design", price: 20000, desc: "Up to 10 screens, interactive prototype, asset export" },
    },
    addons: {
      userResearch: { label: "User Research & Interviews", price: 1000, icon: "👥" },
      designSystem: { label: "Component Design System", price: 1500, icon: "🧩" },
      branding: { label: "Logo & Brand Identity Pack", price: 1200, icon: "🏷️" },
      responsiveDesign: { label: "Mobile/Tablet Adaptation", price: 800, icon: "📱" },
      iconSet: { label: "Custom Icon Set", price: 500, icon: "✨" },
      darkMode: { label: "Dark Mode Theme Design", price: 800, icon: "🌙" },
      handoff: { label: "Developer Handoff Package", price: 500, icon: "📦" },
    },
    revisions: {
      "3": { label: "3 Rounds", price: 0 },
      "6": { label: "6 Rounds", price: 1000 },
      unlimited: { label: "Unlimited", price: 1500 },
    },
  },

  ecommerce: {
    label: "E-commerce Store",
    icon: "🛒",
    base: {
      shopify: { label: "Shopify Store Setup", price: 7000, desc: "Theme setup, domain link, payments, up to 20 products" },
      customStore: { label: "Custom WooCommerce Store", price: 14000, desc: "WordPress based, highly customizable, unlimited products" },
      headless: { label: "Headless E-commerce App", price: 22000, desc: "React/Next.js frontend, Stripe checkout, blazing fast speed" },
    },
    addons: {
      productUpload: { label: "Product Upload & Cataloging (up to 100 items)", price: 800, icon: "📁" },
      inventoryMgmt: { label: "Inventory Management & Sync", price: 1000, icon: "📦" },
      couponSystem: { label: "Advanced Coupons & Discounts", price: 500, icon: "🎫" },
      wishlist: { label: "User Wishlist & Saved Items", price: 500, icon: "❤️" },
      reviews: { label: "Product Reviews & Ratings", price: 500, icon: "⭐" },
      multiCurrency: { label: "Multi-currency Checkout", price: 800, icon: "💱" },
      emailMarketing: { label: "Abandoned Cart Email Setup", price: 1000, icon: "✉️" },
    },
    revisions: {
      "2": { label: "2 Rounds", price: 0 },
      "4": { label: "4 Rounds", price: 1000 },
      unlimited: { label: "Unlimited", price: 1500 },
    },
  },

  branding: {
    label: "Logo & Branding",
    icon: "🏷️",
    base: {
      logoOnly: { label: "Logo Design Package", price: 6000, desc: "Primary logo, submarks, vector source files" },
      starterBrand: { label: "Starter Brand Pack", price: 12000, desc: "Logo + Typography + Color Palette + Social assets" },
      fullBrand: { label: "Full Brand Strategy & Guidelines", price: 20000, desc: "Comprehensive brand book, voice guide, full corporate identity" },
    },
    addons: {
      businessCard: { label: "Business Card Design", price: 500, icon: "📇" },
      letterhead: { label: "Letterhead & Invoice Template", price: 500, icon: "📝" },
      socialKit: { label: "Social Media Banner Templates", price: 800, icon: "📸" },
      brandGuide: { label: "Style Guide PDF Document", price: 1000, icon: "📖" },
      mockups: { label: "3D Product Mockups", price: 800, icon: "🖥️" },
      favicon: { label: "Favicon & App Icon Bundle", price: 500, icon: "✨" },
    },
    revisions: {
      "3": { label: "3 Rounds", price: 0 },
      "5": { label: "5 Rounds", price: 1000 },
      unlimited: { label: "Unlimited", price: 1500 },
    },
  },
};

export const TIMELINE = {
  relaxed: { label: "Relaxed", duration: "6–8 weeks", multiplier: 0.9, desc: "-10% discount" },
  standard: { label: "Standard", duration: "3–4 weeks", multiplier: 1.0, desc: "Normal rate" },
  urgent: { label: "Rush", duration: "1–2 weeks", multiplier: 1.3, desc: "+30% rush fee" },
};

export const TIERS = {
  basic: { label: "Basic Tier", multiplier: 0.85, desc: "Essential features", color: "#64748b" },
  standard: { label: "Standard Tier", multiplier: 1.0, desc: "Fully featured package", color: "#6c63ff" },
  premium: { label: "Premium Tier", multiplier: 1.35, desc: "High-end specs & support", color: "#f59e0b" },
};

export const USD_RATE = 83;
