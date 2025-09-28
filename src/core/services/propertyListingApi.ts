import { Listing } from "../types/propertyListing";

export async function fetchListings(): Promise<Listing[]> {
  return [];
}

export async function createListing(listing: Omit<Listing, "id">): Promise<Listing> {
  return { ...listing, id: String(Date.now()) } as Listing;
}

export async function updateListing(listing: Listing): Promise<Listing> {
  return listing;
}

export async function deleteListing(id: string): Promise<{ success: boolean }> {
  return { success: true };
}


