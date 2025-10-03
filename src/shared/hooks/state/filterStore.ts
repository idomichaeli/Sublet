import { create } from "zustand";
import { FilterData } from "../../../features/swipe/types/FilterData";
import { SwipeCardData } from "../../../features/swipe/components/SwipeCard";
import { FilterResult } from "../../../core/services/propertyFilterService";
import { propertyFilterService } from "../../../core/services/propertyFilterService";

interface FilterStore extends FilterResult {
  appliedFilters: FilterData;
  searchQuery: string;
  isLoading: boolean;
  lastUpdateTime: number;
  
  // Actions
  setAppliedFilters: (filters: FilterData) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  clearSearch: () => void;
  applyFiltersAndSearch: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // Initial state
  appliedFilters: {},
  searchQuery: "",
  isLoading: false,
  lastUpdateTime: 0,
  
  // Filter result state
  properties: [],
  totalCount: 0,
  filteredCount: 0,
  appliedFiltersCount: 0,

  // Actions
  setAppliedFilters: (filters) => {
    // Validate filters before applying to prevent crashes
    const validatedFilters = propertyFilterService.validateFilters(filters);
    set({ appliedFilters: validatedFilters });
    // Automatically trigger filter application
    get().applyFiltersAndSearch();
  },

  setSearchQuery: (query) => {
    // Sanitize search query to prevent crashes
    const sanitizedQuery = typeof query === 'string' ? query.trim() : '';
    set({ searchQuery: sanitizedQuery });
    // Automatically trigger filter application
    get().applyFiltersAndSearch();
  },

  clearFilters: () => {
    set({ appliedFilters: {} });
    get().applyFiltersAndSearch();
  },

  clearSearch: () => {
    set({ searchQuery: "" });
    get().applyFiltersAndSearch();
  },

  applyFiltersAndSearch: async () => {
    const { appliedFilters, searchQuery } = get();
    
    set({ isLoading: true });
    
    try {
      const result = await propertyFilterService.applyFilters({
        query: searchQuery,
        filters: appliedFilters,
        excludeFavorites: false, // Will be handled by components
      });

      set({
        properties: result.properties,
        totalCount: result.totalCount,
        filteredCount: result.filteredCount,
        appliedFiltersCount: result.appliedFiltersCount,
        isLoading: false,
        lastUpdateTime: Date.now(),
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      set({ 
        isLoading: false,
        properties: [],
        totalCount: 0,
        filteredCount: 0,
        appliedFiltersCount: 0,
      });
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));