import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SwipeCardData } from "../../features/swipe/components/SwipeCard";
import { zustandStorage } from "../utils/storage";

type FavoritesState = {
  favorites: SwipeCardData[];
  addFavorite: (apartment: SwipeCardData) => void;
  removeFavorite: (apartmentId: string) => void;
  isFavorite: (apartmentId: string) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (apartment) => {
        const { favorites } = get();
        // Check if already in favorites to avoid duplicates
        const isAlreadyFavorite = favorites.some(fav => fav.id === apartment.id);
        if (!isAlreadyFavorite) {
          set({ favorites: [...favorites, { ...apartment, isFavorite: true }] });
        }
      },
      removeFavorite: (apartmentId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== apartmentId) });
      },
      isFavorite: (apartmentId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === apartmentId);
      },
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: zustandStorage,
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

