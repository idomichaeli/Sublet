export const mockListings = [
  {
    id: "1",
    title: "Modern Studio in Tel Aviv",
    location: "Tel Aviv, Israel",
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
    amenities: ["wifi", "ac", "furnished"],
    isFavorite: false,
  },
  {
    id: "2",
    title: "Cozy 2BR Apartment",
    location: "Jerusalem, Israel",
    price: 2800,
    bedrooms: 2,
    bathrooms: 1,
    size: 65,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"],
    amenities: ["wifi", "heating", "parking"],
    isFavorite: false,
  },
];

export const heroData = [
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

export const quickFilters = [
  { id: "all", label: "All" },
  { id: "studio", label: "Studio" },
  { id: "1br", label: "1BR" },
  { id: "2br", label: "2BR" },
  { id: "3br", label: "3BR+" },
];
