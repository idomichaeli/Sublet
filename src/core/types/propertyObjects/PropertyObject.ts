import { TelAvivLocation } from "../../../shared/constants/locations";

// Base interfaces
export interface PropertyLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export type PropertyCategory = 
  | "house"
  | "apartment";

export type PropertyType = 
  | "entire_place"
  | "room"
  | "shared_room";

// Main Property Object - Contains all property data
export interface PropertyObject {
  // Step 0 - Property Category
  propertyCategory?: PropertyCategory;
  propertyType?: PropertyType;

  // Step 1 - Location
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

  // Step 2 - Basic Details
  bedrooms: number;
  customBedrooms?: number; // For when bedrooms is 4+, this stores the actual count (supports decimals)
  isOneBedroomLivingRoom: boolean; // Whether one of the bedrooms is a living room
  bathrooms: number;
  customBathrooms?: number; // For when bathrooms is 3+, this stores the actual count (supports decimals)
  renovation: "new" | "renovated" | "needs_work";
  size: number;
  additionalRooms: string[]; // Array of selected additional rooms

  // Step 3 - Amenities
  amenities: string[];

  // Step 4 - Photos
  photos: string[];

  // Step 5 - Availability
  availableFrom?: string;
  availableTo?: string;
  startDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";
  endDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";

  // Step 6 - Pricing
  price: number;
  pricingFrequency: "week" | "month"; // Whether price is set by week or month
}

// Default property object
export const createDefaultPropertyObject = (): PropertyObject => ({
  // Property Category
  propertyCategory: undefined,
  propertyType: undefined,

  // Location
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

  // Basic Details
  bedrooms: 1,
  customBedrooms: undefined,
  isOneBedroomLivingRoom: false,
  bathrooms: 1,
  customBathrooms: undefined,
  renovation: "new",
  size: 50,
  additionalRooms: [],

  // Amenities
  amenities: [],

  // Photos
  photos: [],

  // Availability
  availableFrom: undefined,
  availableTo: undefined,
  startDateFlexibility: undefined,
  endDateFlexibility: undefined,

  // Pricing
  price: 1200,
  pricingFrequency: "month",
});

// Property object validation
export const validatePropertyObject = (property: PropertyObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields validation
  if (!property.propertyCategory) errors.push("Property category is required");
  if (!property.propertyType) errors.push("Property type is required");
  if (!property.street.trim()) errors.push("Street is required");
  if (!property.streetNumber.trim()) errors.push("Street number is required");
  if (property.price <= 0) errors.push("Price must be greater than 0");
  if (property.photos.length === 0) errors.push("At least one photo is required");
  if (!property.availableFrom) errors.push("Available from date is required");

  // Amenities validation
  const requiredAmenityIds = ["wifi", "ac", "elevator", "furnished", "pet_friendly", "smoking_allowed", "accessible", "none"];
  const hasRequiredAmenity = property.amenities.some(amenityId => requiredAmenityIds.includes(amenityId));
  if (!hasRequiredAmenity) errors.push("At least one essential amenity is required");

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property object utilities
export const getPropertyDisplayName = (property: PropertyObject): string => {
  const category = property.propertyCategory === "house" ? "House" : "Apartment";
  const type = property.propertyType === "entire_place" ? "Entire Place" : 
               property.propertyType === "room" ? "Room" : "Shared Room";
  return `${category} - ${type}`;
};

export const getPropertyAddress = (property: PropertyObject): string => {
  const parts = [property.street, property.streetNumber];
  if (property.floor) parts.push(`Floor ${property.floor}`);
  if (property.apartmentNumber) parts.push(`Apt ${property.apartmentNumber}`);
  if (property.area?.name) parts.push(property.area.name);
  parts.push("Tel Aviv, Israel");
  return parts.join(", ");
};

export const getPropertySize = (property: PropertyObject): string => {
  return `${property.size}m²`;
};

export const getPropertyPrice = (property: PropertyObject): string => {
  return `$${property.price.toLocaleString()}/${property.pricingFrequency}`;
};

export const getPropertyRooms = (property: PropertyObject): string => {
  const bedroomCount = property.customBedrooms || property.bedrooms;
  const bathroomCount = property.customBathrooms || property.bathrooms;
  const additionalRoomsCount = property.additionalRooms?.length || 0;
  const hasLivingRoom = property.isOneBedroomLivingRoom;

  let rooms = [];
  rooms.push(`${bedroomCount} bedroom${bedroomCount !== 1 ? "s" : ""}`);
  if (hasLivingRoom) rooms.push("1 living room");
  if (additionalRoomsCount > 0) {
    rooms.push(`${additionalRoomsCount} additional room${additionalRoomsCount !== 1 ? "s" : ""}`);
  }
  rooms.push(`${bathroomCount} bathroom${bathroomCount !== 1 ? "s" : ""}`);

  return rooms.join(" • ");
};
