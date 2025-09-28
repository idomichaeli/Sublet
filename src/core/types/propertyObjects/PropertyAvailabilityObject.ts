// Property Availability Object - Step 5
export interface PropertyAvailabilityObject {
  availableFrom?: string;
  availableTo?: string;
  startDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";
  endDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";
}

// Flexibility options
export const FLEXIBILITY_OPTIONS = [
  {
    id: "exact" as const,
    label: "Exact Date",
    description: "No flexibility - exact date required",
  },
  {
    id: "3days" as const,
    label: "±3 days",
    description: "Flexible within 3 days",
  },
  {
    id: "1week" as const,
    label: "±1 week",
    description: "Flexible within 1 week",
  },
  {
    id: "2weeks" as const,
    label: "±2 weeks",
    description: "Flexible within 2 weeks",
  },
];

// Date constraints
export const DATE_CONSTRAINTS = {
  MIN_DATE_OFFSET_DAYS: 0, // Today
  MAX_DATE_OFFSET_DAYS: 365, // 1 year from now
};

// Default property availability object
export const createDefaultPropertyAvailabilityObject = (): PropertyAvailabilityObject => ({
  availableFrom: undefined,
  availableTo: undefined,
  startDateFlexibility: undefined,
  endDateFlexibility: undefined,
});

// Property availability validation
export const validatePropertyAvailability = (availability: PropertyAvailabilityObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!availability.availableFrom) {
    errors.push("Available from date is required");
  }

  if (availability.availableFrom && availability.availableTo) {
    const fromDate = new Date(availability.availableFrom);
    const toDate = new Date(availability.availableTo);
    
    if (fromDate >= toDate) {
      errors.push("Available to date must be after available from date");
    }
  }

  // Validate date ranges
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (availability.availableFrom) {
    const fromDate = new Date(availability.availableFrom);
    if (fromDate < today) {
      errors.push("Available from date cannot be in the past");
    }
  }

  if (availability.availableTo) {
    const toDate = new Date(availability.availableTo);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + DATE_CONSTRAINTS.MAX_DATE_OFFSET_DAYS);
    
    if (toDate > maxDate) {
      errors.push(`Available to date cannot be more than ${DATE_CONSTRAINTS.MAX_DATE_OFFSET_DAYS} days in the future`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property availability utilities
export const getFlexibilityLabel = (flexibility: "exact" | "3days" | "1week" | "2weeks"): string => {
  const found = FLEXIBILITY_OPTIONS.find(f => f.id === flexibility);
  return found?.label || "Unknown";
};

export const getFlexibilityDescription = (flexibility: "exact" | "3days" | "1week" | "2weeks"): string => {
  const found = FLEXIBILITY_OPTIONS.find(f => f.id === flexibility);
  return found?.description || "";
};

export const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getMaxDate = (): string => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + DATE_CONSTRAINTS.MAX_DATE_OFFSET_DAYS);
  return maxDate.toISOString().split("T")[0];
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "Not set";
  
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString();
  } catch {
    return "Invalid date";
  }
};

export const getAvailabilityDisplay = (availability: PropertyAvailabilityObject): string => {
  if (!availability.availableFrom) {
    return "Not set";
  }

  let display = `Available from ${formatDate(availability.availableFrom)}`;
  
  if (availability.startDateFlexibility && availability.startDateFlexibility !== "exact") {
    display += ` (${getFlexibilityLabel(availability.startDateFlexibility)})`;
  }

  if (availability.availableTo) {
    display += ` until ${formatDate(availability.availableTo)}`;
    
    if (availability.endDateFlexibility && availability.endDateFlexibility !== "exact") {
      display += ` (${getFlexibilityLabel(availability.endDateFlexibility)})`;
    }
  }

  return display;
};

export const getAvailabilityPeriod = (availability: PropertyAvailabilityObject): { start: string; end: string | null } => {
  return {
    start: availability.availableFrom || "",
    end: availability.availableTo || null
  };
};

export const getFlexibilityDisplay = (availability: PropertyAvailabilityObject): { start: string; end: string | null } => {
  return {
    start: availability.startDateFlexibility ? getFlexibilityLabel(availability.startDateFlexibility) : "Not set",
    end: availability.endDateFlexibility ? getFlexibilityLabel(availability.endDateFlexibility) : null
  };
};

export const isAvailableNow = (availability: PropertyAvailabilityObject): boolean => {
  if (!availability.availableFrom) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const availableFrom = new Date(availability.availableFrom);
  
  return availableFrom <= today;
};

export const getDaysUntilAvailable = (availability: PropertyAvailabilityObject): number | null => {
  if (!availability.availableFrom) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const availableFrom = new Date(availability.availableFrom);
  
  const diffTime = availableFrom.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getAvailabilityDuration = (availability: PropertyAvailabilityObject): number | null => {
  if (!availability.availableFrom || !availability.availableTo) return null;
  
  const fromDate = new Date(availability.availableFrom);
  const toDate = new Date(availability.availableTo);
  
  const diffTime = toDate.getTime() - fromDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const setAvailableFrom = (availability: PropertyAvailabilityObject, date: string): PropertyAvailabilityObject => {
  return {
    ...availability,
    availableFrom: date
  };
};

export const setAvailableTo = (availability: PropertyAvailabilityObject, date: string): PropertyAvailabilityObject => {
  return {
    ...availability,
    availableTo: date
  };
};

export const setStartFlexibility = (availability: PropertyAvailabilityObject, flexibility: "exact" | "3days" | "1week" | "2weeks"): PropertyAvailabilityObject => {
  return {
    ...availability,
    startDateFlexibility: flexibility
  };
};

export const setEndFlexibility = (availability: PropertyAvailabilityObject, flexibility: "exact" | "3days" | "1week" | "2weeks"): PropertyAvailabilityObject => {
  return {
    ...availability,
    endDateFlexibility: flexibility
  };
};

// Property availability step props
export interface PropertyAvailabilityStepProps {
  data: PropertyAvailabilityObject;
  onUpdate: (updates: Partial<PropertyAvailabilityObject>) => void;
}
