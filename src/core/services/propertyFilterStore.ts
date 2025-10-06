import { create } from "zustand";
import { FilterData } from "../../features/swipe/types/FilterData";
import { SwipeCardData } from "../../features/swipe/components/SwipeCard";

interface FilterStore {
  appliedFilters: FilterData;
  setAppliedFilters: (filters: FilterData) => void;
  clearFilters: () => void;
  isLoading: boolean;
  properties: SwipeCardData[];
  filteredProperties: SwipeCardData[];
  setFilteredProperties: (properties: SwipeCardData[]) => void;
  hasNoMatchingProperties: boolean;
  setHasNoMatchingProperties: (hasNoMatches: boolean) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  appliedFilters: {},
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
  clearFilters: () => set({ appliedFilters: {}, filteredProperties: [], hasNoMatchingProperties: false }),
  isLoading: false,
  properties: [],
  filteredProperties: [],
  setFilteredProperties: (properties) => set({ 
    filteredProperties: properties,
    hasNoMatchingProperties: properties.length === 0
  }),
  hasNoMatchingProperties: false,
  setHasNoMatchingProperties: (hasNoMatches) => set({ hasNoMatchingProperties: hasNoMatches }),
}));
