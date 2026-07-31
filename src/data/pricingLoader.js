// ─── PRICING LOADER ───────────────────────────────────────────────────────────
// Returns the correct pricing data based on the selected mode

import * as freelancer from "./pricing";
import * as agency from "./pricing.agency";
import * as business from "./pricing.business";
import * as contractor from "./pricing.contractor";
import * as product from "./pricing.product";

const PRICING_MAP = {
  freelancer,
  agency,
  business,
  consultant: business, // alias
  contractor,
  product,
  custom: freelancer,   // custom starts from freelancer base
};

export function getPricingForMode(mode) {
  return PRICING_MAP[mode] || freelancer;
}

export function findModeForService(serviceName) {
  if (!serviceName) return null;
  const modes = ["freelancer", "agency", "business", "contractor", "product"];
  for (const m of modes) {
    const pricing = PRICING_MAP[m];
    if (pricing && pricing.SERVICES && pricing.SERVICES[serviceName]) {
      return m;
    }
  }
  return null;
}

export const MODE_LABELS = {
  freelancer: "Freelancer",
  agency: "Agency / Studio",
  business: "Consultant / Business",
  contractor: "Contractor / Trade",
  product: "Product Seller",
  custom: "Custom",
};

export const MODE_COLORS = {
  freelancer: "#6c63ff",
  agency: "#f59e0b",
  business: "#10b981",
  contractor: "#f87171",
  product: "#38bdf8",
  custom: "#a78bfa",
};

export const MODE_ICONS = {
  freelancer: "🧑‍💻",
  agency: "🏢",
  business: "👔",
  contractor: "🏗",
  product: "🛒",
  custom: "✏️",
};