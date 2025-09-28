export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area?: string; // Tel Aviv area/neighborhood
  images: string[];
  available: boolean;
  rooms: number;
  bathrooms: number;
  size: number; // in square meters
}


