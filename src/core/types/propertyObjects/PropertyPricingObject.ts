// Property Pricing Object - Step 6
export interface PropertyPricingObject {
  price: number;
  pricingFrequency: "week" | "month";
}

// Pricing constraints
export const PRICING_CONSTRAINTS = {
  MIN_PRICE: 500,
  MAX_PRICE: 8000,
  PRICE_STEP: 50,
  DEFAULT_PRICE: 1200,
};

// Pricing frequency options
export const PRICING_FREQUENCIES = [
  {
    id: "month" as const,
    label: "Monthly",
    description: "Price per month",
  },
  {
    id: "week" as const,
    label: "Weekly", 
    description: "Price per week",
  },
];

// Default property pricing object
export const createDefaultPropertyPricingObject = (): PropertyPricingObject => ({
  price: PRICING_CONSTRAINTS.DEFAULT_PRICE,
  pricingFrequency: "month",
});

// Property pricing validation
export const validatePropertyPricing = (pricing: PropertyPricingObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (pricing.price < PRICING_CONSTRAINTS.MIN_PRICE) {
    errors.push(`Price must be at least $${PRICING_CONSTRAINTS.MIN_PRICE}`);
  }

  if (pricing.price > PRICING_CONSTRAINTS.MAX_PRICE) {
    errors.push(`Price cannot exceed $${PRICING_CONSTRAINTS.MAX_PRICE}`);
  }

  if (pricing.price % PRICING_CONSTRAINTS.PRICE_STEP !== 0) {
    errors.push(`Price must be in increments of $${PRICING_CONSTRAINTS.PRICE_STEP}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property pricing utilities
export const getPricingFrequencyLabel = (frequency: "week" | "month"): string => {
  const found = PRICING_FREQUENCIES.find(f => f.id === frequency);
  return found?.label || "Unknown";
};

export const getPricingFrequencyDescription = (frequency: "week" | "month"): string => {
  const found = PRICING_FREQUENCIES.find(f => f.id === frequency);
  return found?.description || "";
};

export const getPriceDisplay = (pricing: PropertyPricingObject): string => {
  return `$${pricing.price.toLocaleString()}/${pricing.pricingFrequency}`;
};

export const getFormattedPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};

// Price conversion utilities
export const convertToMonthly = (price: number, frequency: "week" | "month"): number => {
  if (frequency === "month") {
    return price;
  }
  // Convert weekly to monthly (approximately 4.33 weeks per month)
  return Math.round(price * 4.33);
};

export const convertToWeekly = (price: number, frequency: "week" | "month"): number => {
  if (frequency === "week") {
    return price;
  }
  // Convert monthly to weekly (approximately 4.33 weeks per month)
  return Math.round(price / 4.33);
};

export const convertToNightly = (price: number, frequency: "week" | "month"): number => {
  if (frequency === "week") {
    return Math.round(price / 7);
  }
  // Convert monthly to nightly (30 days per month)
  return Math.round(price / 30);
};

export const getDerivedPrices = (pricing: PropertyPricingObject): { monthly: number; weekly: number; nightly: number } => {
  const monthlyPrice = convertToMonthly(pricing.price, pricing.pricingFrequency);
  const weeklyPrice = convertToWeekly(monthlyPrice, "month");
  const nightlyPrice = convertToNightly(monthlyPrice, "month");

  return {
    monthly: monthlyPrice,
    weekly: weeklyPrice,
    nightly: nightlyPrice,
  };
};

export const getPriceBreakdown = (pricing: PropertyPricingObject): string => {
  const derived = getDerivedPrices(pricing);
  return `$${derived.monthly}/month • $${derived.weekly}/week • $${derived.nightly}/night`;
};

export const getPriceRange = (): { min: number; max: number; step: number } => {
  return {
    min: PRICING_CONSTRAINTS.MIN_PRICE,
    max: PRICING_CONSTRAINTS.MAX_PRICE,
    step: PRICING_CONSTRAINTS.PRICE_STEP,
  };
};

export const isValidPrice = (price: number): boolean => {
  return price >= PRICING_CONSTRAINTS.MIN_PRICE && 
         price <= PRICING_CONSTRAINTS.MAX_PRICE && 
         price % PRICING_CONSTRAINTS.PRICE_STEP === 0;
};

export const roundToNearestStep = (price: number): number => {
  return Math.round(price / PRICING_CONSTRAINTS.PRICE_STEP) * PRICING_CONSTRAINTS.PRICE_STEP;
};

export const setPrice = (pricing: PropertyPricingObject, price: number): PropertyPricingObject => {
  const roundedPrice = roundToNearestStep(price);
  const clampedPrice = Math.max(PRICING_CONSTRAINTS.MIN_PRICE, 
                                Math.min(PRICING_CONSTRAINTS.MAX_PRICE, roundedPrice));
  
  return {
    ...pricing,
    price: clampedPrice
  };
};

export const setPricingFrequency = (pricing: PropertyPricingObject, frequency: "week" | "month"): PropertyPricingObject => {
  return {
    ...pricing,
    pricingFrequency: frequency
  };
};

export const increasePrice = (pricing: PropertyPricingObject, step: number = PRICING_CONSTRAINTS.PRICE_STEP): PropertyPricingObject => {
  const newPrice = Math.min(PRICING_CONSTRAINTS.MAX_PRICE, pricing.price + step);
  return setPrice(pricing, newPrice);
};

export const decreasePrice = (pricing: PropertyPricingObject, step: number = PRICING_CONSTRAINTS.PRICE_STEP): PropertyPricingObject => {
  const newPrice = Math.max(PRICING_CONSTRAINTS.MIN_PRICE, pricing.price - step);
  return setPrice(pricing, newPrice);
};

// Price comparison utilities
export const isPriceInRange = (price: number, min: number, max: number): boolean => {
  return price >= min && price <= max;
};

export const getPriceCategory = (price: number): string => {
  if (price < 1000) return "Budget";
  if (price < 2000) return "Mid-range";
  if (price < 4000) return "Premium";
  return "Luxury";
};

export const getPriceCategoryColor = (price: number): string => {
  const category = getPriceCategory(price);
  switch (category) {
    case "Budget": return "#4CAF50"; // Green
    case "Mid-range": return "#FF9800"; // Orange
    case "Premium": return "#2196F3"; // Blue
    case "Luxury": return "#9C27B0"; // Purple
    default: return "#757575"; // Gray
  }
};

// Property pricing step props
export interface PropertyPricingStepProps {
  data: PropertyPricingObject;
  onUpdate: (updates: Partial<PropertyPricingObject>) => void;
}
