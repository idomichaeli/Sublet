import { TelAvivLocation } from "../../../shared/constants/locations";
import { PropertyLocation } from './PropertyObject';

// Property Location Object - Step 1
export interface PropertyLocationObject {
  location?: PropertyLocation;
  area?: typeof TelAvivLocation;
  street: string;
  streetNumber: string;
  floor: string;
  apartmentNumber: string;
  postcode: string;
  hasShelter: boolean;
  shelterLocation?: "in_apartment" | "in_floor" | "in_building" | "other";
  shelterDistance?: number; // in meters, only if shelterLocation is "other"
}

// Shelter location options
export const SHELTER_LOCATIONS = [
  {
    id: "in_apartment" as const,
    label: "In the apartment",
    description: "Shelter is located within the apartment",
  },
  {
    id: "in_floor" as const,
    label: "In the floor",
    description: "Shelter is located on the same floor",
  },
  {
    id: "in_building" as const,
    label: "In the building",
    description: "Shelter is located within the building",
  },
  {
    id: "other" as const,
    label: "Other",
    description: "Shelter is located elsewhere",
  },
];

// Default property location object
export const createDefaultPropertyLocationObject = (): PropertyLocationObject => ({
  location: undefined,
  area: undefined,
  street: "",
  streetNumber: "",
  floor: "",
  apartmentNumber: "",
  postcode: "",
  hasShelter: false,
  shelterLocation: undefined,
  shelterDistance: undefined,
});

// Property location validation
export const validatePropertyLocation = (location: PropertyLocationObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!location.street.trim()) {
    errors.push("Street name is required");
  }

  if (!location.streetNumber.trim()) {
    errors.push("Street number is required");
  }

  if (location.hasShelter && !location.shelterLocation) {
    errors.push("Shelter location is required when shelter is available");
  }

  if (location.shelterLocation === "other" && (!location.shelterDistance || location.shelterDistance <= 0)) {
    errors.push("Shelter distance is required when location is 'other'");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property location utilities
export const getPropertyAddress = (location: PropertyLocationObject): string => {
  const parts = [location.street, location.streetNumber];
  if (location.floor) parts.push(`Floor ${location.floor}`);
  if (location.apartmentNumber) parts.push(`Apt ${location.apartmentNumber}`);
  if (location.area?.name) parts.push(location.area.name);
  parts.push("Tel Aviv, Israel");
  return parts.join(", ");
};

export const getShelterLocationLabel = (location: "in_apartment" | "in_floor" | "in_building" | "other"): string => {
  const found = SHELTER_LOCATIONS.find(l => l.id === location);
  return found?.label || "Unknown";
};

export const getShelterLocationDescription = (location: "in_apartment" | "in_floor" | "in_building" | "other"): string => {
  const found = SHELTER_LOCATIONS.find(l => l.id === location);
  return found?.description || "";
};

export const getShelterDisplay = (location: PropertyLocationObject): string => {
  if (!location.hasShelter) {
    return "No shelter";
  }

  if (!location.shelterLocation) {
    return "Shelter available (location not specified)";
  }

  const locationLabel = getShelterLocationLabel(location.shelterLocation);
  
  if (location.shelterLocation === "other" && location.shelterDistance) {
    return `${locationLabel} (${location.shelterDistance}m away)`;
  }

  return locationLabel;
};

export const getNeighborhoodDisplay = (location: PropertyLocationObject): string => {
  return location.area?.name || "Neighborhood not detected";
};

export const getCoordinatesDisplay = (location: PropertyLocationObject): string => {
  if (!location.location) {
    return "Coordinates not available";
  }

  return `${location.location.latitude.toFixed(6)}, ${location.location.longitude.toFixed(6)}`;
};

// Property location step props
export interface PropertyLocationStepProps {
  data: PropertyLocationObject;
  onUpdate: (updates: Partial<PropertyLocationObject>) => void;
}
