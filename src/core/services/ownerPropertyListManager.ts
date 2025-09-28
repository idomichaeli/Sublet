import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  OwnerProperty, 
  OwnerPropertyList, 
  createDefaultOwnerPropertyList,
  createDefaultOwnerProperty,
  getPropertyStats,
  sortPropertiesByDate,
  sortPropertiesByStatus,
  filterPropertiesBySearch,
  updatePropertyStatus,
  incrementPropertyViews,
  incrementPropertyInquiries,
  incrementPropertyBookings
} from '../types/ownerPropertyList';
import { PropertyObject } from '../types/propertyObjects';

// Owner Property List Manager Service
export class OwnerPropertyListManager {
  private ownerId: string;
  private propertyList: OwnerPropertyList;

  constructor(ownerId: string) {
    this.ownerId = ownerId;
    this.propertyList = createDefaultOwnerPropertyList(ownerId);
    this.loadPropertyList().catch(error => {
      console.error('Failed to initialize property list:', error);
    });
  }

  // Initialize property list
  private async loadPropertyList(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem(`owner_properties_${this.ownerId}`);
      if (saved) {
        this.propertyList = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load property list:', error);
    }
  }

  // Save property list to storage
  private async savePropertyList(): Promise<void> {
    try {
      await AsyncStorage.setItem(`owner_properties_${this.ownerId}`, JSON.stringify(this.propertyList));
    } catch (error) {
      console.error('Failed to save property list:', error);
    }
  }

  // Update property list stats
  private updateStats(): void {
    const stats = getPropertyStats(this.propertyList.properties);
    this.propertyList.totalProperties = stats.total;
    this.propertyList.publishedProperties = stats.published;
    this.propertyList.draftProperties = stats.draft;
    this.propertyList.archivedProperties = stats.archived;
  }

  // Add new property to owner's list
  public async addProperty(propertyData: PropertyObject, status: OwnerProperty['status'] = 'draft'): Promise<{ success: boolean; propertyId?: string; errors?: string[] }> {
    try {
      const newProperty = createDefaultOwnerProperty(this.ownerId, propertyData);
      newProperty.status = status;
      
      if (status === 'published') {
        newProperty.publishedAt = new Date().toISOString();
      }

      this.propertyList.properties.push(newProperty);
      this.updateStats();
      await this.savePropertyList();

      // Print the saved property object
      console.log('Saved Property Object:', JSON.stringify(newProperty, null, 2));

      return { success: true, propertyId: newProperty.id };
    } catch (error) {
      return { success: false, errors: ['Failed to add property'] };
    }
  }

  // Update existing property
  public async updateProperty(propertyId: string, updates: Partial<PropertyObject>): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      const updatedProperty = {
        ...this.propertyList.properties[propertyIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.propertyList.properties[propertyIndex] = updatedProperty;
      await this.savePropertyList();

      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to update property'] };
    }
  }

  // Update property status
  public async updatePropertyStatus(propertyId: string, newStatus: OwnerProperty['status']): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      this.propertyList.properties[propertyIndex] = updatePropertyStatus(
        this.propertyList.properties[propertyIndex], 
        newStatus
      );

      this.updateStats();
      await this.savePropertyList();

      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to update property status'] };
    }
  }

  // Publish property
  public async publishProperty(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    return await this.updatePropertyStatus(propertyId, 'published');
  }

  // Archive property
  public async archiveProperty(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    return await this.updatePropertyStatus(propertyId, 'archived');
  }

  // Unarchive property
  public async unarchiveProperty(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    return await this.updatePropertyStatus(propertyId, 'published');
  }

  // Delete property
  public async deleteProperty(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      this.propertyList.properties.splice(propertyIndex, 1);
      this.updateStats();
      await this.savePropertyList();

      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to delete property'] };
    }
  }

  // Get property by ID
  public getPropertyById(propertyId: string): OwnerProperty | null {
    const property = this.propertyList.properties.find(p => p.id === propertyId);
    return property || null;
  }

  // Get all properties
  public getAllProperties(): OwnerProperty[] {
    return [...this.propertyList.properties];
  }

  // Get properties by status
  public getPropertiesByStatus(status: OwnerProperty['status']): OwnerProperty[] {
    return this.propertyList.properties.filter(p => p.status === status);
  }

  // Get published properties
  public getPublishedProperties(): OwnerProperty[] {
    return this.getPropertiesByStatus('published');
  }

  // Get draft properties
  public getDraftProperties(): OwnerProperty[] {
    return this.getPropertiesByStatus('draft');
  }

  // Get archived properties
  public getArchivedProperties(): OwnerProperty[] {
    return this.getPropertiesByStatus('archived');
  }

  // Get property list with stats
  public getPropertyList(): OwnerPropertyList {
    return { ...this.propertyList };
  }

  // Get property stats
  public getPropertyStats() {
    return getPropertyStats(this.propertyList.properties);
  }

  // Sort properties
  public sortProperties(sortBy: 'date' | 'status' = 'date', order: 'asc' | 'desc' = 'desc'): OwnerProperty[] {
    if (sortBy === 'date') {
      return sortPropertiesByDate(this.propertyList.properties, order);
    }
    return sortPropertiesByStatus(this.propertyList.properties);
  }

  // Search properties
  public searchProperties(searchTerm: string): OwnerProperty[] {
    return filterPropertiesBySearch(this.propertyList.properties, searchTerm);
  }

  // Increment property views
  public async incrementViews(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      this.propertyList.properties[propertyIndex] = incrementPropertyViews(
        this.propertyList.properties[propertyIndex]
      );

      await this.savePropertyList();
      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to increment views'] };
    }
  }

  // Increment property inquiries
  public async incrementInquiries(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      this.propertyList.properties[propertyIndex] = incrementPropertyInquiries(
        this.propertyList.properties[propertyIndex]
      );

      await this.savePropertyList();
      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to increment inquiries'] };
    }
  }

  // Increment property bookings
  public async incrementBookings(propertyId: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const propertyIndex = this.propertyList.properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        return { success: false, errors: ['Property not found'] };
      }

      this.propertyList.properties[propertyIndex] = incrementPropertyBookings(
        this.propertyList.properties[propertyIndex]
      );

      await this.savePropertyList();
      return { success: true };
    } catch (error) {
      return { success: false, errors: ['Failed to increment bookings'] };
    }
  }

  // Clear all properties (for testing)
  public clearAllProperties(): void {
    this.propertyList = createDefaultOwnerPropertyList(this.ownerId);
    this.savePropertyList();
  }
}

// Singleton instances for different owners
const ownerPropertyManagers = new Map<string, OwnerPropertyListManager>();

// Get or create property list manager for owner
export const getOwnerPropertyListManager = (ownerId: string): OwnerPropertyListManager => {
  if (!ownerPropertyManagers.has(ownerId)) {
    ownerPropertyManagers.set(ownerId, new OwnerPropertyListManager(ownerId));
  }
  return ownerPropertyManagers.get(ownerId)!;
};

// Hook for React components
export const useOwnerPropertyList = (ownerId: string) => {
  const manager = getOwnerPropertyListManager(ownerId);

  return {
    // Property management
    addProperty: async (propertyData: PropertyObject, status?: OwnerProperty['status']) => 
      await manager.addProperty(propertyData, status),
    updateProperty: async (propertyId: string, updates: Partial<PropertyObject>) => 
      await manager.updateProperty(propertyId, updates),
    deleteProperty: async (propertyId: string) => await manager.deleteProperty(propertyId),
    
    // Status management
    updatePropertyStatus: async (propertyId: string, status: OwnerProperty['status']) => 
      await manager.updatePropertyStatus(propertyId, status),
    publishProperty: async (propertyId: string) => await manager.publishProperty(propertyId),
    archiveProperty: async (propertyId: string) => await manager.archiveProperty(propertyId),
    unarchiveProperty: async (propertyId: string) => await manager.unarchiveProperty(propertyId),
    
    // Data retrieval
    getPropertyById: (propertyId: string) => manager.getPropertyById(propertyId),
    getAllProperties: () => manager.getAllProperties(),
    getPublishedProperties: () => manager.getPublishedProperties(),
    getDraftProperties: () => manager.getDraftProperties(),
    getArchivedProperties: () => manager.getArchivedProperties(),
    getPropertyList: () => manager.getPropertyList(),
    getPropertyStats: () => manager.getPropertyStats(),
    
    // Sorting and searching
    sortProperties: (sortBy?: 'date' | 'status', order?: 'asc' | 'desc') => 
      manager.sortProperties(sortBy, order),
    searchProperties: (searchTerm: string) => manager.searchProperties(searchTerm),
    
    // Analytics
    incrementViews: async (propertyId: string) => await manager.incrementViews(propertyId),
    incrementInquiries: async (propertyId: string) => await manager.incrementInquiries(propertyId),
    incrementBookings: async (propertyId: string) => await manager.incrementBookings(propertyId),
  };
};
