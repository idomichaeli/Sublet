import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyObject } from '../types/propertyObjects/PropertyObject';
import { OwnerProperty } from '../types/ownerPropertyList';
import { SwipeCardData } from '../../features/swipe/components/SwipeCard';
import { getPropertyDisplayName, getPropertyAddress } from '../types/propertyObjects/PropertyObject';

// Service to fetch all published properties from all owners for renters
export class RenterPropertyService {
  private static instance: RenterPropertyService;
  
  private constructor() {}
  
  public static getInstance(): RenterPropertyService {
    if (!RenterPropertyService.instance) {
      RenterPropertyService.instance = new RenterPropertyService();
    }
    return RenterPropertyService.instance;
  }

  // Get all published properties from all owners
  public async getAllPublishedProperties(): Promise<SwipeCardData[]> {
    try {
      // Get all keys from AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Filter keys that match the owner property pattern
      const ownerPropertyKeys = allKeys.filter(key => key.startsWith('owner_properties_'));
      
      const allProperties: SwipeCardData[] = [];
      
      // Fetch all owner property lists
      for (const key of ownerPropertyKeys) {
        try {
          const ownerData = await AsyncStorage.getItem(key);
          if (ownerData) {
            const ownerPropertyList = JSON.parse(ownerData);
            
            // Filter only published properties - OwnerProperty extends PropertyObject directly
            const publishedProperties = ownerPropertyList.properties?.filter(
              (property: OwnerProperty) => property.status === 'published'
            ) || [];
            
            // Convert to SwipeCardData format
            const swipeCardData = publishedProperties
              .filter((ownerProperty: OwnerProperty) => ownerProperty) // Filter out properties with missing data
              .map((ownerProperty: OwnerProperty) => {
                return this.convertOwnerPropertyToSwipeCardData(ownerProperty);
              });
            
            allProperties.push(...swipeCardData);
          }
        } catch (error) {
          console.error(`Error parsing property data for key ${key}:`, error);
        }
      }
      
      // Sort by creation date (newest first)
      allProperties.sort((a, b) => {
        // For now, we'll use a simple sort by ID
        // In a real app, you'd want to sort by actual creation date
        return b.id.localeCompare(a.id);
      });
      
      return allProperties;
    } catch (error) {
      console.error('Error fetching all published properties:', error);
      return [];
    }
  }

  // Convert OwnerProperty to SwipeCardData format (same structure as owner home)
  private convertOwnerPropertyToSwipeCardData(ownerProperty: OwnerProperty): SwipeCardData {
    // Validate property data
    if (!ownerProperty) {
      throw new Error('Property data is missing');
    }

    // Generate title from property details (same as owner home)
    const title = this.generatePropertyTitle(ownerProperty);
    
    // Get neighborhood and location strings
    const neighborhood = ownerProperty.area?.name || 'Tel Aviv';
    const location = `${ownerProperty.street} ${ownerProperty.streetNumber}, ${neighborhood}`;
    
    // Get photos array or use default
    const photos = ownerProperty.photos && ownerProperty.photos.length > 0 
      ? ownerProperty.photos 
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'];
    
    // Get first photo for backward compatibility
    const imageUrl = photos[0];
    
    // Calculate rooms (bedrooms + living room if applicable)
    const rooms = (ownerProperty.customBedrooms || ownerProperty.bedrooms || 1) + (ownerProperty.isOneBedroomLivingRoom ? 1 : 0);
    
    // Get bathrooms
    const bathrooms = ownerProperty.customBathrooms || ownerProperty.bathrooms || 1;
    
    return {
      id: ownerProperty.id,
      title,
      price: ownerProperty.price || 0,
      neighborhood,
      location,
      imageUrl,
      photos,
      rating: 4.5, // Default rating, could be calculated from reviews
      isFavorite: false,
      rooms,
      bathrooms,
      size: ownerProperty.size || 50,
      floor: ownerProperty.floor || '',
      hasShelter: ownerProperty.hasShelter || false,
      ownerId: ownerProperty.ownerId,
      availableFrom: ownerProperty.availableFrom,
      availableTo: ownerProperty.availableTo,
    };
  }

  // Generate a descriptive title for the property (same as owner home)
  private generatePropertyTitle(property: OwnerProperty): string {
    // Safe defaults for missing data
    const category = property.propertyCategory === 'house' ? 'House' : 'Apartment';
    const bedroomCount = property.customBedrooms || property.bedrooms || 1;
    const area = property.area?.name || 'Tel Aviv';
    
    // Create title based on property details
    let title = `${category}`;
    
    if (bedroomCount === 1) {
      title += ' Studio';
    } else if (bedroomCount === 2) {
      title += ' 2BR';
    } else if (bedroomCount === 3) {
      title += ' 3BR';
    } else if (bedroomCount >= 4) {
      title += ` ${bedroomCount}BR`;
    }
    
    title += ` in ${area}`;
    
    // Add renovation status if it's notable
    if (property.renovation === 'new') {
      title = `New ${title}`;
    } else if (property.renovation === 'renovated') {
      title = `Renovated ${title}`;
    }
    
    return title;
  }

  // Get properties by owner ID (same structure as owner home)
  public async getPropertiesByOwner(ownerId: string): Promise<SwipeCardData[]> {
    try {
      const ownerData = await AsyncStorage.getItem(`owner_properties_${ownerId}`);
      if (!ownerData) return [];
      
      const ownerPropertyList = JSON.parse(ownerData);
      const publishedProperties = ownerPropertyList.properties?.filter(
        (property: OwnerProperty) => property.status === 'published'
      ) || [];
      
      return publishedProperties.map((ownerProperty: OwnerProperty) => {
        return this.convertOwnerPropertyToSwipeCardData(ownerProperty);
      });
    } catch (error) {
      console.error(`Error fetching properties for owner ${ownerId}:`, error);
      return [];
    }
  }

  // Get full property object by ID for detailed view
  public async getPropertyById(propertyId: string): Promise<OwnerProperty | null> {
    try {
      // Get all keys from AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Filter keys that match the owner property pattern
      const ownerPropertyKeys = allKeys.filter(key => key.startsWith('owner_properties_'));
      
      // Search through all owner property lists
      for (const key of ownerPropertyKeys) {
        try {
          const ownerData = await AsyncStorage.getItem(key);
          if (ownerData) {
            const ownerPropertyList = JSON.parse(ownerData);
            
            // Find the property by ID
            const property = ownerPropertyList.properties?.find(
              (property: OwnerProperty) => property.id === propertyId
            );
            
            if (property) {
              return property;
            }
          }
        } catch (error) {
          console.error(`Error parsing property data for key ${key}:`, error);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      return null;
    }
  }

  // Search properties by location, price range, etc.
  public async searchProperties(filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    maxRooms?: number;
    minSize?: number;
    maxSize?: number;
  }): Promise<SwipeCardData[]> {
    const allProperties = await this.getAllPublishedProperties();
    
    return allProperties.filter(property => {
      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Price filters
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }
      
      // Room filters
      if (filters.minRooms && property.rooms < filters.minRooms) {
        return false;
      }
      if (filters.maxRooms && property.rooms > filters.maxRooms) {
        return false;
      }
      
      // Size filters
      if (filters.minSize && property.size < filters.minSize) {
        return false;
      }
      if (filters.maxSize && property.size > filters.maxSize) {
        return false;
      }
      
      return true;
    });
  }
}

// Export singleton instance
export const renterPropertyService = RenterPropertyService.getInstance();
