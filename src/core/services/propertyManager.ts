import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  PropertyObject, 
  createDefaultPropertyObject,
  validatePropertyObject,
  PropertyCategoryObject,
  PropertyLocationObject,
  PropertyBasicDetailsObject,
  PropertyAmenitiesObject,
  PropertyPhotosObject,
  PropertyAvailabilityObject,
  PropertyPricingObject,
  PropertyReviewObject
} from '../types/propertyObjects';
import { getOwnerPropertyListManager } from './ownerPropertyListManager';

// Property Manager Service
export class PropertyManager {
  private currentProperty: PropertyObject;
  private propertyId: string | null = null;
  private isDraft: boolean = false;
  private ownerId: string | null = null;

  constructor(ownerId?: string) {
    this.currentProperty = createDefaultPropertyObject();
    this.ownerId = ownerId || null;
  }

  // Initialize a new property
  public initializeNewProperty(): PropertyObject {
    this.currentProperty = createDefaultPropertyObject();
    this.propertyId = null;
    this.isDraft = false;
    return this.currentProperty;
  }

  // Load existing property
  public loadProperty(property: PropertyObject, id?: string): void {
    this.currentProperty = { ...property };
    this.propertyId = id || null;
    this.isDraft = true;
  }

  // Get current property
  public getCurrentProperty(): PropertyObject {
    return { ...this.currentProperty };
  }

  // Update property with partial data
  public updateProperty(updates: Partial<PropertyObject>): PropertyObject {
    this.currentProperty = { ...this.currentProperty, ...updates };
    return this.getCurrentProperty();
  }

  // Step-specific update methods
  public updatePropertyCategory(categoryData: Partial<PropertyCategoryObject>): PropertyObject {
    return this.updateProperty(categoryData);
  }

  public updatePropertyLocation(locationData: Partial<PropertyLocationObject>): PropertyObject {
    return this.updateProperty(locationData);
  }

  public updatePropertyBasicDetails(detailsData: Partial<PropertyBasicDetailsObject>): PropertyObject {
    return this.updateProperty(detailsData);
  }

  public updatePropertyAmenities(amenitiesData: Partial<PropertyAmenitiesObject>): PropertyObject {
    return this.updateProperty(amenitiesData);
  }

  public updatePropertyPhotos(photosData: Partial<PropertyPhotosObject>): PropertyObject {
    return this.updateProperty(photosData);
  }

  public updatePropertyAvailability(availabilityData: Partial<PropertyAvailabilityObject>): PropertyObject {
    return this.updateProperty(availabilityData);
  }

  public updatePropertyPricing(pricingData: Partial<PropertyPricingObject>): PropertyObject {
    return this.updateProperty(pricingData);
  }

  // Validation
  public validateCurrentProperty(): { isValid: boolean; errors: string[] } {
    return validatePropertyObject(this.currentProperty);
  }

  // Save property (draft or final)
  public async saveProperty(isDraft: boolean = true): Promise<{ success: boolean; propertyId?: string; errors?: string[] }> {
    try {
      // Validate if not draft
      if (!isDraft) {
        const validation = this.validateCurrentProperty();
        if (!validation.isValid) {
          return { success: false, errors: validation.errors };
        }
      }

      // Generate property ID if new
      if (!this.propertyId) {
        this.propertyId = this.generatePropertyId();
      }

      this.isDraft = isDraft;

      // Save to owner's property list if ownerId is available
      if (this.ownerId) {
        const ownerPropertyManager = getOwnerPropertyListManager(this.ownerId);
        const status = isDraft ? 'draft' : 'published';
        
        if (this.propertyId && this.isExistingProperty()) {
          // Update existing property
          const result = await ownerPropertyManager.updateProperty(this.propertyId, this.currentProperty);
          if (!result.success) {
            return { success: false, errors: result.errors };
          }
          
          // Update status if changed
          const existingProperty = ownerPropertyManager.getPropertyById(this.propertyId);
          if (existingProperty && existingProperty.status !== status) {
            await ownerPropertyManager.updatePropertyStatus(this.propertyId, status);
          }
        } else {
          // Add new property
          const result = await ownerPropertyManager.addProperty(this.currentProperty, status);
          if (!result.success) {
            return { success: false, errors: result.errors };
          }
          this.propertyId = result.propertyId || null;
        }
      } else {
        // Fallback to AsyncStorage if no ownerId
        await this.saveToStorage();
      }

      return { success: true, propertyId: this.propertyId || undefined };
    } catch (error) {
      return { success: false, errors: ['Failed to save property'] };
    }
  }

  // Publish property (final save)
  public async publishProperty(): Promise<{ success: boolean; propertyId?: string; errors?: string[] }> {
    return await this.saveProperty(false);
  }

  // Get property by ID
  public async getPropertyById(id: string): Promise<PropertyObject | null> {
    try {
      const savedProperties = await this.getSavedProperties();
      const property = savedProperties.find((p: any) => p.id === id);
      return property ? property.property : null;
    } catch {
      return null;
    }
  }

  // Get all saved properties
  public async getSavedProperties(): Promise<Array<{ id: string; property: PropertyObject; isDraft: boolean; createdAt: string; updatedAt: string }>> {
    try {
      const saved = await AsyncStorage.getItem('saved_properties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Delete property
  public async deleteProperty(id: string): Promise<boolean> {
    try {
      const savedProperties = await this.getSavedProperties();
      const filtered = savedProperties.filter(p => p.id !== id);
      await AsyncStorage.setItem('saved_properties', JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  // Clear current property
  public clearCurrentProperty(): void {
    this.currentProperty = createDefaultPropertyObject();
    this.propertyId = null;
    this.isDraft = false;
  }

  // Get property status
  public getPropertyStatus(): { isDraft: boolean; hasId: boolean; isComplete: boolean } {
    const validation = this.validateCurrentProperty();
    return {
      isDraft: this.isDraft,
      hasId: !!this.propertyId,
      isComplete: validation.isValid
    };
  }

  // Get completion percentage
  public getCompletionPercentage(): number {
    const totalFields = 8; // Number of steps
    let completedFields = 0;

    // Check each step
    if (this.currentProperty.propertyCategory && this.currentProperty.propertyType) completedFields++;
    if (this.currentProperty.street && this.currentProperty.streetNumber) completedFields++;
    if (this.currentProperty.bedrooms && this.currentProperty.bathrooms && this.currentProperty.size) completedFields++;
    if (this.currentProperty.amenities.length > 0) completedFields++;
    if (this.currentProperty.photos.length > 0) completedFields++;
    if (this.currentProperty.availableFrom) completedFields++;
    if (this.currentProperty.price > 0) completedFields++;
    // Note: name, email, phone are not part of PropertyObject interface
    // Contact info completion is handled separately if needed

    return Math.round((completedFields / totalFields) * 100);
  }

  // Private methods
  private generatePropertyId(): string {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isExistingProperty(): boolean {
    return !!this.propertyId && this.isDraft;
  }

  private async saveToStorage(): Promise<void> {
    try {
      const savedProperties = await this.getSavedProperties();
      const existingIndex = savedProperties.findIndex(p => p.id === this.propertyId);

      const propertyData = {
        id: this.propertyId!,
        property: this.currentProperty,
        isDraft: this.isDraft,
        createdAt: existingIndex >= 0 ? savedProperties[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        savedProperties[existingIndex] = propertyData;
      } else {
        savedProperties.push(propertyData);
      }

      await AsyncStorage.setItem('saved_properties', JSON.stringify(savedProperties));
      
      // Print the saved property object
      console.log('Saved Property Object (fallback storage):', JSON.stringify(propertyData, null, 2));
    } catch (error) {
      console.error('Failed to save property to storage:', error);
    }
  }
}

// Singleton instances for different owners
const propertyManagers = new Map<string, PropertyManager>();

// Get or create property manager for owner
export const getPropertyManager = (ownerId?: string): PropertyManager => {
  const key = ownerId || 'default';
  if (!propertyManagers.has(key)) {
    propertyManagers.set(key, new PropertyManager(ownerId));
  }
  return propertyManagers.get(key)!;
};

// Default property manager (for backward compatibility)
export const propertyManager = getPropertyManager();

// Hook for React components
export const usePropertyManager = (ownerId?: string) => {
  const manager = getPropertyManager(ownerId);
  
  return {
    // Property management
    initializeNewProperty: () => manager.initializeNewProperty(),
    getCurrentProperty: () => manager.getCurrentProperty(),
    updateProperty: (updates: Partial<PropertyObject>) => manager.updateProperty(updates),
    
    // Step-specific updates
    updatePropertyCategory: (data: Partial<PropertyCategoryObject>) => manager.updatePropertyCategory(data),
    updatePropertyLocation: (data: Partial<PropertyLocationObject>) => manager.updatePropertyLocation(data),
    updatePropertyBasicDetails: (data: Partial<PropertyBasicDetailsObject>) => manager.updatePropertyBasicDetails(data),
    updatePropertyAmenities: (data: Partial<PropertyAmenitiesObject>) => manager.updatePropertyAmenities(data),
    updatePropertyPhotos: (data: Partial<PropertyPhotosObject>) => manager.updatePropertyPhotos(data),
    updatePropertyAvailability: (data: Partial<PropertyAvailabilityObject>) => manager.updatePropertyAvailability(data),
    updatePropertyPricing: (data: Partial<PropertyPricingObject>) => manager.updatePropertyPricing(data),
    
    // Validation and status
    validateProperty: () => manager.validateCurrentProperty(),
    getPropertyStatus: () => manager.getPropertyStatus(),
    getCompletionPercentage: () => manager.getCompletionPercentage(),
    
    // Save operations
    saveDraft: async () => await manager.saveProperty(true),
    publishProperty: async () => await manager.publishProperty(),
    
    // Utility
    clearProperty: () => manager.clearCurrentProperty(),
  };
};
