import { create } from "zustand";
import { FilterData } from "../../features/swipe/types/PropertyFilterData";

interface FilterStore {
  appliedFilters: FilterData;
  setAppliedFilters: (filters: FilterData) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  appliedFilters: {},
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
  clearFilters: () => set({ appliedFilters: {} }),
}));
