import { PropertyObject } from './PropertyObject';
import { PropertyCategoryObject } from './PropertyCategoryObject';
import { PropertyLocationObject } from './PropertyLocationObject';
import { PropertyBasicDetailsObject, getRenovationLabel } from './PropertyBasicDetailsObject';
import { REQUIRED_AMENITIES } from './PropertyAmenitiesObject';
import { getPropertyTypeLabel } from './PropertyCategoryObject';
import { PropertyAmenitiesObject } from './PropertyAmenitiesObject';
import { PropertyPhotosObject } from './PropertyPhotosObject';
import { PropertyAvailabilityObject } from './PropertyAvailabilityObject';
import { PropertyPricingObject } from './PropertyPricingObject';

// Property Review Object - Step 7 (Final Review)
export interface PropertyReviewObject extends PropertyObject {
  // Contact Information
  name: string;
  email: string;
  phone: string;
}

// Review sections
export const REVIEW_SECTIONS = [
  {
    id: "contact",
    title: "Contact Information",
    icon: "👤",
    required: true,
  },
  {
    id: "category",
    title: "Property Type",
    icon: "🏠",
    required: true,
  },
  {
    id: "location",
    title: "Location",
    icon: "📍",
    required: true,
  },
  {
    id: "details",
    title: "Property Details",
    icon: "🏠",
    required: true,
  },
  {
    id: "amenities",
    title: "Amenities",
    icon: "✨",
    required: true,
  },
  {
    id: "photos",
    title: "Photos",
    icon: "📸",
    required: true,
  },
  {
    id: "availability",
    title: "Availability",
    icon: "📅",
    required: true,
  },
  {
    id: "pricing",
    title: "Pricing",
    icon: "💰",
    required: true,
  },
];

// Default property review object
export const createDefaultPropertyReviewObject = (): PropertyReviewObject => {
  return {
    // Property Category
    propertyCategory: undefined,
    propertyType: undefined,

    // Contact Info
    name: "",
    email: "",
    phone: "",

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
  };
};

// Property review validation
export const validatePropertyReview = (review: PropertyReviewObject): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Contact validation
  if (!review.name.trim()) errors.push("Name is required");
  if (!review.email.trim()) errors.push("Email is required");
  if (!review.phone.trim()) errors.push("Phone is required");

  // Category validation
  if (!review.propertyCategory) errors.push("Property category is required");
  if (!review.propertyType) errors.push("Property type is required");

  // Location validation
  if (!review.street.trim()) errors.push("Street is required");
  if (!review.streetNumber.trim()) errors.push("Street number is required");
  if (!review.area) warnings.push("Neighborhood not detected - consider verifying address");

  // Basic details validation
  if (review.bedrooms < 1) errors.push("At least 1 bedroom is required");
  if (review.bathrooms < 1) errors.push("At least 1 bathroom is required");
  if (review.size < 30) errors.push("Property size must be at least 30m²");

  // Amenities validation
  const requiredAmenityIds = REQUIRED_AMENITIES.map(a => a.id);
  const hasRequiredAmenity = review.amenities.some(amenityId => requiredAmenityIds.includes(amenityId));
  if (!hasRequiredAmenity) errors.push("At least one essential amenity is required");

  // Photos validation
  if (review.photos.length === 0) errors.push("At least one photo is required");
  if (review.photos.length < 3) warnings.push("Consider adding more photos for better visibility");

  // Availability validation
  if (!review.availableFrom) errors.push("Available from date is required");

  // Pricing validation
  if (review.price <= 0) errors.push("Price must be greater than 0");

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Property review utilities
export const getPropertySummary = (review: PropertyReviewObject): string => {
  const category = review.propertyCategory === "house" ? "House" : "Apartment";
  const type = review.propertyType ? getPropertyTypeLabel(review.propertyType) : "Unknown";
  const bedrooms = review.customBedrooms || review.bedrooms;
  const bathrooms = review.customBathrooms || review.bathrooms;
  
  return `${category} - ${type} • ${bedrooms} bed • ${bathrooms} bath • ${review.size}m²`;
};

export const getPropertyHighlights = (review: PropertyReviewObject): string[] => {
  const highlights = [];
  
  const bedrooms = review.customBedrooms || review.bedrooms;
  const bathrooms = review.customBathrooms || review.bathrooms;
  
  highlights.push(`${bedrooms} bedroom${bedrooms !== 1 ? "s" : ""}`);
  highlights.push(`${bathrooms} bathroom${bathrooms !== 1 ? "s" : ""}`);
  highlights.push(`${review.size}m²`);
  highlights.push(`$${review.price.toLocaleString()}/${review.pricingFrequency}`);
  
  return highlights;
};

export const getContactInfo = (review: PropertyReviewObject): { name: string; email: string; phone: string } => {
  return {
    name: review.name,
    email: review.email,
    phone: review.phone,
  };
};

export const getLocationInfo = (review: PropertyReviewObject): { address: string; neighborhood: string; coordinates: string } => {
  const address = [review.street, review.streetNumber];
  if (review.floor) address.push(`Floor ${review.floor}`);
  if (review.apartmentNumber) address.push(`Apt ${review.apartmentNumber}`);
  address.push("Tel Aviv, Israel");
  
  return {
    address: address.join(", "),
    neighborhood: review.area?.name || "Not detected",
    coordinates: review.location ? `${review.location.latitude.toFixed(6)}, ${review.location.longitude.toFixed(6)}` : "Not available",
  };
};

export const getPropertyDetails = (review: PropertyReviewObject): { rooms: string; renovation: string; additionalRooms: string } => {
  const bedrooms = review.customBedrooms || review.bedrooms;
  const bathrooms = review.customBathrooms || review.bathrooms;
  const additionalRoomsCount = review.additionalRooms?.length || 0;
  const hasLivingRoom = review.isOneBedroomLivingRoom;

  let rooms = [];
  rooms.push(`${bedrooms} bedroom${bedrooms !== 1 ? "s" : ""}`);
  if (hasLivingRoom) rooms.push("1 living room");
  if (additionalRoomsCount > 0) {
    rooms.push(`${additionalRoomsCount} additional room${additionalRoomsCount !== 1 ? "s" : ""}`);
  }
  rooms.push(`${bathrooms} bathroom${bathrooms !== 1 ? "s" : ""}`);

  return {
    rooms: rooms.join(" • "),
    renovation: getRenovationLabel(review.renovation),
    additionalRooms: review.additionalRooms?.join(", ") || "None",
  };
};

export const getAmenitiesInfo = (review: PropertyReviewObject): { selected: string; count: number } => {
  const amenityLabels = {
    wifi: "WiFi",
    ac: "Air Conditioning",
    elevator: "Elevator",
    furnished: "Furnished",
    pet_friendly: "Pet-friendly",
    smoking_allowed: "Smoking Allowed",
    accessible: "Accessible",
    none: "None of them",
    heating: "Heating",
    parking: "Parking",
    balcony: "Balcony",
    gym: "Gym",
    pool: "Pool",
    laundry: "Laundry",
    storage: "Storage",
    garden: "Garden",
    rooftop: "Rooftop",
  };

  const selectedLabels = review.amenities.map(id => amenityLabels[id as keyof typeof amenityLabels] || id);
  
  return {
    selected: selectedLabels.length > 0 ? selectedLabels.join(", ") : "None selected",
    count: review.amenities.length,
  };
};

export const getPhotosInfo = (review: PropertyReviewObject): { count: number; display: string } => {
  return {
    count: review.photos.length,
    display: `${review.photos.length} photo${review.photos.length !== 1 ? "s" : ""} uploaded`,
  };
};

export const getAvailabilityInfo = (review: PropertyReviewObject): { period: string; flexibility: string } => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString + "T00:00:00");
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getFlexibilityLabel = (flexibility: string) => {
    const labels = {
      exact: "Exact Date",
      "3days": "±3 days",
      "1week": "±1 week",
      "2weeks": "±2 weeks",
    };
    return labels[flexibility as keyof typeof labels] || "Not set";
  };

  let period = "Not set";
  if (review.availableFrom) {
    period = `From ${formatDate(review.availableFrom)}`;
    if (review.availableTo) {
      period += ` until ${formatDate(review.availableTo)}`;
    }
  }

  let flexibility = "Not set";
  if (review.startDateFlexibility) {
    flexibility = getFlexibilityLabel(review.startDateFlexibility);
    if (review.endDateFlexibility) {
      flexibility += ` / ${getFlexibilityLabel(review.endDateFlexibility)}`;
    }
  }

  return { period, flexibility };
};

export const getPricingInfo = (review: PropertyReviewObject): { price: string; frequency: string; breakdown: string } => {
  const monthlyPrice = review.pricingFrequency === "month" ? review.price : Math.round(review.price * 4.33);
  const weeklyPrice = Math.round(monthlyPrice / 4.33);
  const nightlyPrice = Math.round(monthlyPrice / 30);

  return {
    price: `$${review.price.toLocaleString()}/${review.pricingFrequency}`,
    frequency: review.pricingFrequency === "month" ? "Monthly" : "Weekly",
    breakdown: `$${monthlyPrice}/month • $${weeklyPrice}/week • $${nightlyPrice}/night`,
  };
};

export const getCompletionStatus = (review: PropertyReviewObject): { completed: number; total: number; percentage: number } => {
  const sections = REVIEW_SECTIONS;
  let completed = 0;

  // Check each section
  if (review.name && review.email && review.phone) completed++; // Contact
  if (review.propertyCategory && review.propertyType) completed++; // Category
  if (review.street && review.streetNumber) completed++; // Location
  if (review.bedrooms && review.bathrooms && review.size) completed++; // Details
  if (review.amenities.length > 0) completed++; // Amenities
  if (review.photos.length > 0) completed++; // Photos
  if (review.availableFrom) completed++; // Availability
  if (review.price > 0) completed++; // Pricing

  const percentage = Math.round((completed / sections.length) * 100);

  return {
    completed,
    total: sections.length,
    percentage,
  };
};

// Property review step props
export interface PropertyReviewStepProps {
  data: PropertyReviewObject;
  onUpdate: (updates: Partial<PropertyReviewObject>) => void;
}
