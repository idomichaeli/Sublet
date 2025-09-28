import { create } from "zustand";
import { Listing } from "../types/propertyListing";
import * as api from "./propertyListingApi";

type ListingsState = {
  listings: Listing[];
  isLoading: boolean;
  fetch: () => Promise<void>;
  add: (listing: Omit<Listing, "id">) => Promise<void>;
  update: (listing: Listing) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  isLoading: false,
  fetch: async () => {
    set({ isLoading: true });
    const data = await api.fetchListings();
    set({ listings: data, isLoading: false });
  },
  add: async (listing) => {
    const created = await api.createListing(listing);
    set({ listings: [...get().listings, created] });
  },
  update: async (listing) => {
    const updated = await api.updateListing(listing);
    set({ listings: get().listings.map((l) => (l.id === updated.id ? updated : l)) });
  },
  remove: async (id) => {
    await api.deleteListing(id);
    set({ listings: get().listings.filter((l) => l.id !== id) });
  },
}));


