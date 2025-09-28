import { SwipeCardData } from "../components/SwipeCard";
import { Listing } from "../components/ListingsSection";
import { HeroItem } from "../components/HeroCarousel";
import { TEL_AVIV_LOCATIONS } from "../../../shared/constants/locations";

// Unified apartment data for both list and swipe views
export const browserApartments: SwipeCardData[] = [
  {
    id: "1",
    title: "Modern Studio in Neve Tzedek",
    location: TEL_AVIV_LOCATIONS[20], // Neve Tzedek
    price: 3500,
    rooms: 1,
    bathrooms: 1,
    size: 45,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    rating: 4.5,
    isFavorite: false,
    ownerId: "owner-1",
    availableFrom: "2025-09-25",
    availableTo: "2025-12-31",
  },
  {
    id: "2",
    title: "Cozy 2BR in Florentin",
    location: TEL_AVIV_LOCATIONS[23], // Florentin
    price: 2800,
    rooms: 2,
    bathrooms: 1,
    size: 65,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.2,
    isFavorite: false,
    ownerId: "owner-2",
    availableFrom: "2025-10-01",
    availableTo: "2025-12-31",
  },
  {
    id: "3",
    title: "Luxury 3BR in Ramat Aviv",
    location: TEL_AVIV_LOCATIONS[3], // Ramat Aviv Aleph
    price: 5500,
    rooms: 3,
    bathrooms: 2,
    size: 120,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    rating: 4.8,
    isFavorite: false,
    ownerId: "owner-3",
    availableFrom: "2025-11-01",
    availableTo: "2025-12-31",
  },
  {
    id: "4",
    title: "Budget 1BR in Shapira",
    location: TEL_AVIV_LOCATIONS[27], // Shapira
    price: 1800,
    rooms: 1,
    bathrooms: 1,
    size: 35,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    rating: 3.8,
    isFavorite: false,
    ownerId: "owner-4",
    availableFrom: "2025-09-15",
    availableTo: "2025-12-31",
  },
  {
    id: "5",
    title: "Family 4BR in Tzahala",
    location: TEL_AVIV_LOCATIONS[9], // Tzahala
    price: 4200,
    rooms: 4,
    bathrooms: 3,
    size: 150,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.6,
    isFavorite: false,
    ownerId: "owner-5",
    availableFrom: "2025-10-15",
    availableTo: "2025-12-31",
  },
];

// Convert SwipeCardData to Listing format for list view
export const browserListings: Listing[] = browserApartments.map(apartment => ({
  id: apartment.id,
  title: apartment.title,
  location: apartment.location,
  price: apartment.price,
  bedrooms: apartment.rooms,
  bathrooms: apartment.bathrooms,
  size: apartment.size,
  images: [apartment.imageUrl],
  amenities: ["WiFi", "Parking", "Pet Friendly"], // Default amenities
  isFavorite: apartment.isFavorite,
}));

// Hero carousel data
export const heroData: HeroItem[] = [
  {
    id: "1",
    title: "Find Your Perfect Home",
    subtitle: "Discover amazing apartments in your city",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "2",
    title: "Premium Locations",
    subtitle: "Live in the best neighborhoods",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
  },
];

// Quick filters
export const quickFilters = [
  { id: "all", label: "All" },
  { id: "studio", label: "Studio" },
  { id: "1br", label: "1BR" },
  { id: "2br", label: "2BR" },
  { id: "3br", label: "3BR+" },
];
