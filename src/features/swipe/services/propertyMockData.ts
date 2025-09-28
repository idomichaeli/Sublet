import { HeroItem } from "../components/HeroCarousel";
import { Listing } from "../components/PropertyListingsSection";

// Mock data with enhanced properties
export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    location: "Downtown, New York",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    status: "available" as const,
    rating: 4.5,
    reviewCount: 128,
    isFavorite: false,
    amenities: ["WiFi", "Parking", "Pet Friendly"],
  },
  {
    id: "2",
    title: "Cozy Studio with City View",
    location: "Brooklyn, New York",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    status: "available" as const,
    rating: 4.8,
    reviewCount: 89,
    isFavorite: true,
    amenities: ["WiFi", "Balcony"],
  },
  {
    id: "3",
    title: "Luxury Penthouse Suite",
    location: "Manhattan, New York",
    price: 300,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    status: "available" as const,
    rating: 4.9,
    reviewCount: 67,
    isFavorite: false,
    amenities: ["WiFi", "Parking", "Pool", "Gym"],
  },
  {
    id: "4",
    title: "Charming Garden Apartment",
    location: "Queens, New York",
    price: 95,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    bedrooms: 2,
    bathrooms: 1,
    size: 75,
    status: "available" as const,
    rating: 4.3,
    reviewCount: 156,
    isFavorite: false,
    amenities: ["WiFi", "Garden"],
  },
  {
    id: "5",
    title: "Modern Loft with Exposed Brick",
    location: "Williamsburg, New York",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    bedrooms: 2,
    bathrooms: 1,
    size: 95,
    status: "available" as const,
    rating: 4.6,
    reviewCount: 92,
    isFavorite: true,
    amenities: ["WiFi", "Parking", "Pet Friendly"],
  },
];

// Hero carousel data
export const heroData: HeroItem[] = [
  {
    id: "hero1",
    title: "Top Apartments in Tel Aviv",
    subtitle: "Discover the best stays in the city",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  },
  {
    id: "hero2",
    title: "Special Discounts",
    subtitle: "Up to 30% off on selected properties",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  },
  {
    id: "hero3",
    title: "Pet-Friendly Stays",
    subtitle: "Find the perfect place for you and your furry friend",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  },
];

export const quickFilters = [
  { label: "All", value: "All" },
  { label: "Under $100", value: "Under100" },
  { label: "Pet Friendly", value: "PetFriendly" },
  { label: "Near Transit", value: "NearTransit" },
  { label: "Instant Book", value: "InstantBook" },
];
