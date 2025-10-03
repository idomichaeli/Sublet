import { SwipeCardData } from '../../features/swipe/components/SwipeCard';
import { FilterData } from '../../features/swipe/types/FilterData';
import { renterPropertyService } from './renterPropertyService';

export interface FilterCriteria {
  /** Search query for text-based filtering */
  query?: string;
  /** Applied filter data */
  filters: FilterData;
  excludeFavorites?: boolean;
}

export interface FilterResult {
  properties: SwipeCardData[];
  totalCount: number;
  filteredCount: number;
  appliedFiltersCount: number;
}

/**
 * Enhanced property filter service that handles all filtering logic
 */
export class PropertyFilterService {
  private static instance: PropertyFilterService;

  private constructor() {}

  public static getInstance(): PropertyFilterService {
    if (!PropertyFilterService.instance) {
      PropertyFilterService.instance = new PropertyFilterService();
    }
    return PropertyFilterService.instance;
  }

  /**
   * Apply comprehensive filtering to properties
   */
  public async applyFilters(criteria: FilterCriteria): Promise<FilterResult> {
    try {
      // Validate input criteria to prevent crashes
      if (!criteria || typeof criteria !== 'object') {
        console.warn('Invalid criteria provided to applyFilters');
        return this.getEmptyResult();
      }

      // Get all published properties
      const allProperties = await renterPropertyService.getAllPublishedProperties();
      
      // Ensure we have valid array
      if (!Array.isArray(allProperties)) {
        console.warn('Invalid properties array received');
        return this.getEmptyResult();
      }
      
      let filteredProperties = [...allProperties];

      // Apply text-based search query
      if (criteria.query && typeof criteria.query === 'string' && criteria.query.trim() !== '') {
        filteredProperties = this.applyTextSearch(filteredProperties, criteria.query);
      }

      // Apply filters
      const filtersCount = this.countActiveFilters(criteria.filters);
      if (filtersCount > 0) {
        filteredProperties = this.applyPropertyFilters(filteredProperties, criteria.filters);
      }

      // Apply favorites exclusion
      if (criteria.excludeFavorites) {
        // This will be handled by the calling component since it needs access to favorites store
      }

      return {
        properties: filteredProperties,
        totalCount: allProperties.length,
        filteredCount: filteredProperties.length,
        appliedFiltersCount: filtersCount,
      };
    } catch (error) {
      console.error('Error applying filters:', error);
      return this.getEmptyResult();
    }
  }

  /**
   * Apply text-based search across multiple property fields
   */
  private applyTextSearch(properties: SwipeCardData[], query: string): SwipeCardData[] {
    const searchTerm = query.toLowerCase().trim();
    
    return properties.filter(property => {
      // Search across multiple fields with null safety
      return (
        (property.title?.toLowerCase().includes(searchTerm)) ||
        (property.location?.toLowerCase().includes(searchTerm)) ||
        (property.description?.toLowerCase().includes(searchTerm)) ||
        (property.propertyType?.toLowerCase().includes(searchTerm))
      );
    });
  }

  /**
   * Apply comprehensive property filters
   */
  private applyPropertyFilters(properties: SwipeCardData[], filters: FilterData): SwipeCardData[] {
    return properties.filter(property => {
      // Skip properties with missing essential data
      if (!property || !property.id) {
        return false;
      }

      // Bedrooms filter - allow multiple bedroom counts (with null safety)
      if (filters.bedrooms && filters.bedrooms.length > 0) {
        const propertyRooms = property.rooms ?? 0; // Default to 0 if undefined
        const matchesBedrooms = filters.bedrooms.some(bedroomCount => {
          if (bedroomCount === 6) {
            return propertyRooms >= 6; // 6+ bedrooms
          }
          return propertyRooms === bedroomCount;
        });
        if (!matchesBedrooms) return false;
      }

      // Bathrooms filter (with null safety)
      if (filters.bathrooms) {
        const propertyBathrooms = property.bathrooms ?? 0;
        if (propertyBathrooms < filters.bathrooms) {
          return false;
        }
      }

      // Living room filter
      if (filters.hasLivingRoom !== undefined) {
        const hasLivingRoom = this.checkLivingRoom(property);
        if (filters.hasLivingRoom && !hasLivingRoom) {
          return false;
        }
        if (filters.hasLivingRoom === false && hasLivingRoom) {
          return false;
        }
      }

      // Size filters (with null safety)
      if (filters.minSize) {
        const propertySize = property.size ?? 0;
        if (propertySize < filters.minSize) {
          return false;
        }
      }
      if (filters.maxSize) {
        const propertySize = property.size ?? Infinity;
        if (propertySize > filters.maxSize) {
          return false;
        }
      }

      // Price filters (with null safety)
      if (filters.minPrice) {
        const propertyPrice = property.price ?? 0;
        if (propertyPrice < filters.minPrice) {
          return false;
        }
      }
      if (filters.maxPrice) {
        const propertyPrice = property.price ?? Infinity;
        if (propertyPrice > filters.maxPrice) {
          return false;
        }
      }

      // Property type filter (with null safety)
      if (filters.propertyType && filters.propertyType !== 'any') {
        const propertyType = property.propertyType ?? 'unknown';
        const normalizedPropertyType = this.normalizePropertyType(propertyType);
        if (normalizedPropertyType !== filters.propertyType) {
          return false;
        }
      }

      // Renovation status filter
      if (filters.renovation && filters.renovation !== 'any') {
        // This would need to be added to SwipeCardData interface
        // For now, skip this filter
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const propertyAmenities = this.extractAmenities(property);
        const hasRequiredAmenities = filters.amenities.every(requiredAmenity =>
          propertyAmenities.some(amenity =>
            amenity.toLowerCase().includes(requiredAmenity.toLowerCase()) ||
            requiredAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasRequiredAmenities) {
          return false;
        }
      }

      // Area/Location filter (with null safety)
      if (filters.areas && filters.areas.length > 0) {
        const propertyLocation = property.location ?? '';
        const matchesArea = filters.areas.some(area =>
          propertyLocation.toLowerCase().includes(area.toLowerCase())
        );
        if (!matchesArea) {
          return false;
        }
      }

      // Additional rooms filter (with null safety)
      if (filters.additionalRooms && filters.additionalRooms.length > 0) {
        const hasRequiredRooms = filters.additionalRooms.every(requiredRoom => {
          return this.checkAdditionalRoom(property, requiredRoom);
        });
        if (!hasRequiredRooms) {
          return false;
        }
      }

      // Availability date filters
      if (filters.availableFrom || filters.availableTo) {
        // This would need additional data about availability
        // For now, skip this filter
      }

      return true;
    });
  }

  /**
   * Check if property has a living room
   */
  private checkLivingRoom(property: SwipeCardData): boolean {
    // Check if property has description with living room info (with null safety)
    const description = property.description ?? '';
    const lowerDescription = description.toLowerCase();
    return (
      lowerDescription.includes('living room') ||
      lowerDescription.includes('lounge') ||
      lowerDescription.includes('sitting room')
    );
  }

  /**
   * Extract amenities from property description
   */
  private extractAmenities(property: SwipeCardData): string[] {
    // This would need proper amenity data structure
    // For now, return empty array
    return [];
  }

  /**
   * Check if property has a specific additional room
   */
  private checkAdditionalRoom(property: SwipeCardData, roomType: string): boolean {
    // This would need proper room data structure
    // For now, check if description mentions the room type (with null safety)
    const description = property.description ?? '';
    return description.toLowerCase().includes(roomType.toLowerCase());
  }

  /**
   * Normalize property type for consistent comparison
   */
  private normalizePropertyType(propertyType: string): string {
    const normalized = propertyType.toLowerCase();
    
    if (normalized.includes('entire') || normalized.includes('whole')) {
      return 'entire_place';
    }
    if (normalized.includes('room') && !normalized.includes('shared')) {
      return 'room';
    }
    if (normalized.includes('shared')) {
      return 'shared_room';
    }
    
    return 'entire_place'; // default fallback
  }

  /**
   * Count the number of active filters
   */
  private countActiveFilters(filters: FilterData): number {
    let count = 0;
    
    // Basic details filters
    if (filters.bedrooms && filters.bedrooms.length > 0) count++;
    if (filters.bathrooms) count++;
    if (filters.hasLivingRoom !== undefined) count++;
    if (filters.minSize || filters.maxSize) count++;
    
    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'any') count++;
    
    // Price filters
    if (filters.minPrice || filters.maxPrice) count++;
    
    // Location filters
    if (filters.areas && filters.areas.length > 0) count++;
    
    // Amenities filters
    if (filters.amenities && filters.amenities.length > 0) count++;
    if (filters.additionalRooms && filters.additionalRooms.length > 0) count++;
    
    // Renovation filter
    if (filters.renovation && filters.renovation !== 'any') count++;
    
    // Availability filters
    if (filters.availableFrom || filters.availableTo) count++;
    
    return count;
  }

  /**
   * Clear all filters
   */
  public clearAllFilters(): FilterData {
    return {};
  }

  /**
   * Get default filter values
   */
  public getDefaultFilters(): FilterData {
    return {
      propertyType: 'any',
      renovation: 'any',
    };
  }

  /**
   * Validate filter data and return sanitized version
   */
  public validateFilters(filters: FilterData): Partial<FilterData> {
    const validated: Partial<FilterData> = {};

    // Validate bedrooms
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      validated.bedrooms = filters.bedrooms.filter(bed => bed > 0 && bed <= 10);
    }

    // Validate bathrooms
    if (filters.bathrooms && filters.bathrooms > 0) {
      validated.bathrooms = Math.min(filters.bathrooms, 10);
    }

    // Validate size
    if (filters.minSize && filters.minSize > 0) {
      validated.minSize = filters.minSize;
    }
    if (filters.maxSize && filters.maxSize > 0) {
      validated.maxSize = filters.maxSize;
      if (validated.minSize && filters.maxSize < validated.minSize) {
        delete validated.minSize; // Clear conflicting minSize
      }
    }

    // Validate price
    if (filters.minPrice && filters.minPrice > 0) {
      validated.minPrice = filters.minPrice;
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      validated.maxPrice = filters.maxPrice;
      if (validated.minPrice && filters.maxPrice < validated.minPrice) {
        delete validated.minPrice; // Clear conflicting minPrice
      }
    }

    // Validate property type
    const validPropertyTypes = ['entire_place', 'room', 'shared_room', 'any'];
    if (filters.propertyType && validPropertyTypes.includes(filters.propertyType)) {
      validated.propertyType = filters.propertyType;
    }

    // Validate renovation
    const validRenovations = ['new', 'renovated', 'needs_work', 'any'];
    if (filters.renovation && validRenovations.includes(filters.renovation)) {
      validated.renovation = filters.renovation;
    }

    // Copy other filters as-is for now
    if (filters.hasLivingRoom !== undefined) {
      validated.hasLivingRoom = filters.hasLivingRoom;
    }
    if (filters.amenities) {
      validated.amenities = filters.amenities;
    }
    if (filters.areas) {
      validated.areas = filters.areas;
    }
    if (filters.additionalRooms) {
      validated.additionalRooms = filters.additionalRooms;
    }
    if (filters.availableFrom) {
      validated.availableFrom = filters.availableFrom;
    }
    if (filters.availableTo) {
      validated.availableTo = filters.availableTo;
    }

    return validated;
  }

  /**
   * Get empty result for error cases
   */
  private getEmptyResult(): FilterResult {
    return {
      properties: [],
      totalCount: 0,
      filteredCount: 0,
      appliedFiltersCount: 0,
    };
  }
}

// Export singleton instance
export const propertyFilterService = PropertyFilterService.getInstance();
