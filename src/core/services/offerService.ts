import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfferObject, CreateOfferData, calculateOfferFields, OfferFilters, OfferStats } from '../types/offerObject';

const STORAGE_KEY = 'rental_offers';
const EXPIRED_CHECK_KEY = 'offer_expiry_check';

class OfferService {
  private offers: OfferObject[] = [];

  /**
   * Initialize service by loading offers from storage
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.offers = JSON.parse(stored);
        await this.cleanExpiredOffers();
      }
    } catch (error) {
      console.error('Failed to initialize offer service:', error);
      this.offers = [];
    }
  }

  /**
   * Create a new offer and send it to owner's inbox
   */
  async createOffer(offerData: CreateOfferData, userInfo: {
    renterId: string;
    renterName: string;
    renterAge: number;
    renterOccupation: string;
    renterLocation: string;
    renterProfileImage: string;
    renterIsVerified: boolean;
    ownerName: string;
  }): Promise<OfferObject> {
    try {
      // Validate offer data
      this.validateOfferData(offerData);
      
      // Generate offer ID
      const offerId = `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate all derived fields
      const calculatedFields = calculateOfferFields(offerData, userInfo);
      const now = new Date().toISOString();
      
      // Create complete offer object
      const newOffer: OfferObject = {
        ...calculatedFields,
        id: offerId,
        createdAt: now,
        updatedAt: now,
      };
      
      // Add to offers array
      this.offers.push(newOffer);
      
      // Persist to storage
      await this.saveToStorage();
      
      // Log offer creation (in real app, this would trigger owner notification)
      console.log(`✅ New offer created: ${offerId} for property ${offerData.propertyId}`);
      console.log(`💰 Offer: ${offerData.renterOfferPrice}/month vs Owner's ${offerData.ownerPrice}/month`);
      console.log(`📅 Dates: ${offerData.renterStartDate} to ${offerData.renterEndDate}`);
      console.log(`💬 Note: ${offerData.renterNote}`);
      
      return newOffer;
    } catch (error) {
      console.error('Failed to create offer:', error);
      throw new Error(`Failed to create offer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get offers for a specific property owner
   */
  async getOffersByOwner(ownerId: string, filters?: OfferFilters): Promise<OfferObject[]> {
    await this.initialize();
    
    let filteredOffers = this.offers.filter(offer => offer.ownerId === ownerId);
    
    if (filters) {
      filteredOffers = this.applyFilters(filteredOffers, filters);
    }
    
    // Sort by creation date (newest first)
    return filteredOffers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get offers for a specific property
   */
  async getOffersByProperty(propertyId: string): Promise<OfferObject[]> {
    await this.initialize();
    return this.offers.filter(offer => offer.propertyId === propertyId);
  }

  /**
   * Get offer statistics for owner dashboard
   */
  async getOfferStatsByOwner(ownerId: string): Promise<OfferStats> {
    const offers = await this.getOffersByOwner(ownerId);
    
    const stats: OfferStats = {
      totalOffers: offers.length,
      pendingOffers: offers.filter(o => o.status === 'pending').length,
      acceptedOffers: offers.filter(o => o.status === 'accepted').length,
      rejectedOffers: offers.filter(o => o.status === 'rejected').length,
      averageOfferPrice: offers.length > 0 
        ? offers.reduce((sum, o) => sum + o.renterOfferPrice, 0) / offers.length 
        : 0,
      totalOffersToday: offers.filter(o => {
        const today = new Date().toISOString().split('T')[0];
        return o.createdAt.startsWith(today);
      }).length,
    };
    
    return stats;
  }

  /**
   * Update offer status (accept, reject, etc.)
   */
  async updateOfferStatus(offerId: string, status: OfferObject['status']): Promise<OfferObject | null> {
    await this.initialize();
    
    const offerIndex = this.offers.findIndex(o => o.id === offerId);
    if (offerIndex === -1) {
      throw new Error(`Offer with ID ${offerId} not found`);
    }
    
    const updatedOffer = {
      ...this.offers[offerIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    this.offers[offerIndex] = updatedOffer;
    await this.saveToStorage();
    
    console.log(`✅ Offer ${offerId} status updated to: ${status}`);
    return updatedOffer;
  }

  /**
   * Delete an offer
   */
  async deleteOffer(offerId: string): Promise<boolean> {
    await this.initialize();
    
    const initialLength = this.offers.length;
    this.offers = this.offers.filter(o => o.id !== offerId);
    
    if (this.offers.length < initialLength) {
      await this.saveToStorage();
      console.log(`✅ Offer ${offerId} deleted`);
      return true;
    }
    
    return false;
  }

  /**
   * Get offer by ID
   */
  async getOfferById(offerId: string): Promise<OfferObject | null> {
    await this.initialize();
    return this.offers.find(o => o.id === offerId) || null;
  }

  /**
   * Close expired offers (automatically mark as expired)
   */
  private async cleanExpiredOffers(): Promise<void> {
    const now = new Date().toISOString();
    let hasExpiredOffers = false;
    
    this.offers = this.offers.map(offer => {
      if (offer.expiresAt <= now && offer.status === 'pending') {
        hasExpiredOffers = true;
        return {
          ...offer,
          status: 'expired' as const,
          updatedAt: now,
        };
      }
      return offer;
    });
    
    if (hasExpiredOffers) {
      await this.saveToStorage();
      console.log('🧹 Cleaned expired offers');
    }
  }

  /**
   * Apply filters to offers
   */
  private applyFilters(offers: OfferObject[], filters: OfferFilters): OfferObject[] {
    let filtered = offers;
    
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(o => filters.status!.includes(o.status));
    }
    
    if (filters.propertyId) {
      filtered = filtered.filter(o => o.propertyId === filters.propertyId);
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(o => {
        const price = o.renterOfferPrice;
        const min = filters.priceRange?.min || 0;
        const max = filters.priceRange?.max || Infinity;
        return price >= min && price <= max;
      });
    }
    
    if (filters.dateRange) {
      filtered = filtered.filter(o => {
        const offerStart = o.renterStartDate;
        const offerEnd = o.renterEndDate;
        const filterStart = filters.dateRange?.start;
        const filterEnd = filters.dateRange?.end;
        
        if (filterStart && filterEnd) {
          return offerStart >= filterStart && offerEnd <= filterEnd;
        } else if (filterStart) {
          return offerStart >= filterStart;
        } else if (filterEnd) {
          return offerEnd <= filterEnd;
        }
        
        return true;
      });
    }
    
    return filtered;
  }

  /**
   * Validate offer input data
   */
  private validateOfferData(data: CreateOfferData): void {
    if (!data.propertyId) {
      throw new Error('Property ID is required');
    }
    
    if (!data.ownerId) {
      throw new Error('Owner ID is required');
    }
    
    if (data.renterOfferPrice <= 0) {
      throw new Error('Renter offer price must be greater than 0');
    }
    
    if (!data.renterStartDate || !data.renterEndDate) {
      throw new Error('Both start and end dates are required');
    }
    
    const startDate = new Date(data.renterStartDate);
    const endDate = new Date(data.renterEndDate);
    
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }
    
    if (startDate < new Date(Date.now() + 24 * 60 * 60 * 1000)) {
      throw new Error('Start date must be at least 1 day in the future');
    }
    
    if (data.renterNote && data.renterNote.length > 500) {
      throw new Error('Note cannot exceed 500 characters');
    }
  }

  /**
   * Save offers to storage
   */
  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.offers));
    } catch (error) {
      console.error('Failed to save offers to storage:', error);
      throw error;
    }
  }

  /**
   * Get all offers (for admin/debugging purposes)
   */
  async getAllOffers(): Promise<OfferObject[]> {
    await this.initialize();
    return this.offers;
  }

  /**
   * Clear all offers (for testing purposes)
   */
  async clearAllOffers(): Promise<void> {
    this.offers = [];
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ All offers cleared');
  }
}

// Singleton instance
const offerService = new OfferService();

// Initialize service
offerService.initialize().catch(error => {
  console.error('Failed to initialize offer service:', error);
});

export default offerService;
export { OfferService };
