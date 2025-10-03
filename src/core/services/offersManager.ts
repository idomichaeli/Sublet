import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfferObject, CreateOfferData } from '../types/offerObject';
import { OwnerProperty } from '../types/ownerPropertyList';

const OFFERS_STORAGE_KEY = 'uplet_offers_storage';
const SUBSCRIPTIONS_KEY = 'offer_subscriptions';
const CACHE_KEY = 'offers_cache';

/**
 * Centralized Offers Manager
 * Manages the complete flow from renter offer submission to owner inbox display
 */
class OffersManager {
  private offers: OfferObject[] = [];
  private subscriptions: Map<string, Array<(offers: OfferObject[]) => void>> = new Map();
  private isInitialized = false;

  /**
   * Initialize the offers manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadOffersFromStorage();
      this.startPeriodicCleanup();
      this.isInitialized = true;
      console.log('✅ OffersManager initialized with', this.offers.length, 'offers');
    } catch (error) {
      console.error('❌ Failed to initialize OffersManager:', error);
      this.offers = [];
    }
  }

  /**
   * Submit an offer from renter and ensure it reaches the owner
   */
  async submitRenterOffer(
    renterOffer: CreateOfferData & {
      renterId: string;
      renterName: string;
      renterAge: number;
      renterOccupation: string;
      renterLocation: string;
      renterProfileImage?: string;
      renterIsVerified?: boolean;
    },
    ownerInfo: {
      name: string;
    }
  ): Promise<{ success: boolean; offer?: OfferObject; error?: string }> {
    try {
      await this.initialize();

      // Validate the offer data
      const validation = this.validateRenterOffer(renterOffer);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Create the full offer object
      const offer = this.createOfferFromRenterSubmission(renterOffer, ownerInfo);

      // Store the offer
      this.offers.push(offer);
      await this.saveOffersToStorage();

      // Notify subscribers (owner inbox components)
      this.notifySubscribers(`owner_${renterOffer.ownerId}`);

      console.log('✅ Renter offer submitted successfully:', offer.id);
      console.log(`📧 Sent to owner inbox: ${offer.renterName} - $${offer.renterOfferPrice}/month`);
      console.log(`🏠 Property: ${offer.propertyTitle} (${offer.propertyId})`);

      return { success: true, offer };

    } catch (error) {
      console.error('❌ Failed to submit renter offer:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get offers for a specific owner and property
   */
  async getOffersForOwner(
    ownerId: string, 
    propertyId?: string,
    filters?: {
      status?: string[];
      priceRange?: { min?: number; max?: number };
    }
  ): Promise<OfferObject[]> {
    await this.initialize();

    let filteredOffers = this.offers.filter(offer => offer.ownerId === ownerId);

    // Filter by specific property if requested
    if (propertyId) {
      filteredOffers = filteredOffers.filter(offer => offer.propertyId === propertyId);
    }

    // Apply additional filters
    if (filters?.status && filters.status.length > 0) {
      filteredOffers = filteredOffers.filter(offer => 
        filters.status!.includes(offer.status)
      );
    }

    if (filters?.priceRange) {
      filteredOffers = filteredOffers.filter(offer => {
        const { min, max } = filters.priceRange!;
        return (
          (min === undefined || offer.renterOfferPrice >= min) &&
          (max === undefined || offer.renterOfferPrice <= max)
        );
      });
    }

    // Sort by creation date (newest first)
    return filteredOffers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get offers for a specific property (used in renter's saved offers)
   */
  async getOffersForProperty(propertyId: string): Promise<OfferObject[]> {
    await this.initialize();
    return this.offers.filter(offer => offer.propertyId === propertyId);
  }

  /**
   * Update offer status (accept/reject by owner)
   */
  async updateOfferStatus(
    offerId: string, 
    status: OfferObject['status'],
    updatedBy?: { id: string; name: string }
  ): Promise<{ success: boolean; offer?: OfferObject }> {
    try {
      await this.initialize();

      const offerIndex = this.offers.findIndex(o => o.id === offerId);
      if (offerIndex === -1) {
        return { success: false };
      }

      const updatedOffer = {
        ...this.offers[offerIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      this.offers[offerIndex] = updatedOffer;
      await this.saveOffersToStorage();

      // Notify all subscribers about the update
      this.notifyAllSubscribers();

      console.log(`✅ Offer ${offerId} status updated to: ${status}`);
      return { success: true, offer: updatedOffer };

    } catch (error) {
      console.error('❌ Failed to update offer status:', error);
      return { success: false };
    }
  }

  /**
   * Get offer statistics for owner dashboard
   */
  async getOwnerOfferStats(ownerId: string): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    expired: number;
    averageOfferPrice: number;
    totalToday: number;
  }> {
    await this.initialize();

    const ownerOffers = this.offers.filter(o => o.ownerId === ownerId);
    const today = new Date().toISOString().split('T')[0];

    return {
      total: ownerOffers.length,
      pending: ownerOffers.filter(o => o.status === 'pending').length,
      accepted: ownerOffers.filter(o => o.status === 'accepted').length,
      rejected: ownerOffers.filter(o => o.status === 'rejected').length,
      expired: ownerOffers.filter(o => o.status === 'expired').length,
      averageOfferPrice: ownerOffers.length > 0 
        ? ownerOffers.reduce((sum, o) => sum + o.renterOfferPrice, 0) / ownerOffers.length 
        : 0,
      totalToday: ownerOffers.filter(o => o.createdAt.startsWith(today)).length,
    };
  }

  /**
   * Subscribe to offer updates for specific owner/property
   */
  subscribe(
    key: string, // e.g., 'owner_current-owner' or 'property_prop-123'
    callback: (offers: OfferObject[]) => void
  ): () => void {
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, []);
    }
    this.subscriptions.get(key)!.push(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(key);
      if (subs) {
        const index = subs.indexOf(callback);
        if (index > -1) {
          subs.splice(index, 1);
        }
        if (subs.length === 0) {
          this.subscriptions.delete(key);
        }
      }
    };
  }

  /**
   * Create sample offers for testing/demo
   */
  async createSampleOffersForTesting(): Promise<void> {
    await this.initialize();

    const sampleOffers: OfferObject[] = [
      {
        id: 'offer_sample_1',
        propertyId: 'property_demo_1',
        propertyTitle: 'Beautiful 2BR Apartment in Tel Aviv',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        renterId: 'renter_1',
        renterName: 'Sarah Johnson',
        renterAge: 28,
        renterOccupation: 'Software Engineer',
        renterLocation: 'Tel Aviv',
        renterProfileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        renterIsVerified: true,
        ownerId: 'current-owner',
        ownerName: 'Property Owner',
        ownerPrice: 4500,
        ownerStartDate: '2024-02-01',
        ownerEndDate: '2024-11-30',
        renterOfferPrice: 4800,
        renterStartDate: '2024-02-15',
        renterEndDate: '2024-11-30',
        renterNote: 'Hi! I\'m very interested in your apartment. I\'m a responsible tenant with excellent references and ready to provide additional deposits.',
        status: 'pending',
        messagePreview: 'Hi! I\'m very interested in your apartment. I\'m a responsible tenant with excellent references...',
        priceDifference: 300,
        isPriceIncrease: true,
        weeklyRate: Math.round(4800 / 4.33),
        dailyRate: Math.round(4800 / 30),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        rentalDurationMonths: 9,
      },
      {
        id: 'offer_sample_2',
        propertyId: 'property_demo_1',
        propertyTitle: 'Beautiful 2BR Apartment in Tel Aviv',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        renterId: 'renter_2',
        renterName: 'Michael Chen',
        renterAge: 24,
        renterOccupation: 'Graduate Student',
        renterLocation: 'Haifa',
        renterProfileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        renterIsVerified: false,
        ownerId: 'current-owner',
        ownerName: 'Property Owner',
        ownerPrice: 4500,
        ownerStartDate: '2024-02-01',
        ownerEndDate: '2024-11-30',
        renterOfferPrice: 3300,
        renterStartDate: '2024-02-01',
        renterEndDate: '2024-08-01',
        renterNote: 'Hello! I would love to schedule a viewing. I\'m available this weekend and have all necessary documentation ready.',
        status: 'pending',
        messagePreview: 'Hello! I would love to schedule a viewing. I\'m available this weekend and have all necessary documentation...',
        priceDifference: -1200,
        isPriceIncrease: false,
        weeklyRate: Math.round(3300 / 4.33),
        dailyRate: Math.round(3300 / 30),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        rentalDurationMonths: 6,
      },
    ];

    this.offers.push(...sampleOffers);
    await this.saveOffersToStorage();

    // Notify owner inbox
    this.notifySubscribers('owner_current-owner');

    console.log('✅ Sample offers created for testing');
  }

  /**
   * Clear all offers (for testing)
   */
  async clearAllOffers(): Promise<void> {
    this.offers = [];
    await AsyncStorage.removeItem(OFFERS_STORAGE_KEY);
    this.notifyAllSubscribers();
    console.log('🧹 All offers cleared');
  }

  // Private methods

  private async loadOffersFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(OFFERS_STORAGE_KEY);
      if (stored) {
        this.offers = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offers from storage:', error);
      this.offers = [];
    }
  }

  private async saveOffersToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(this.offers));
    } catch (error) {
      console.error('Failed to save offers to storage:', error);
    }
  }

  private validateRenterOffer(offer: any): { isValid: boolean; error?: string } {
    if (!offer.propertyId || !offer.ownerId || !offer.renterId) {
      return { isValid: false, error: 'Missing required IDs' };
    }
    
    if (!offer.renterOfferPrice || offer.renterOfferPrice <= 0) {
      return { isValid: false, error: 'Invalid offer price' };
    }

    if (!offer.renterStartDate || !offer.renterEndDate) {
      return { isValid: false, error: 'Missing rental dates' };
    }

    const startDate = new Date(offer.renterStartDate);
    const endDate = new Date(offer.renterEndDate);

    if (startDate >= endDate) {
      return { isValid: false, error: 'End date must be after start date' };
    }

    return { isValid: true };
  }

  private createOfferFromRenterSubmission(
    renterOffer: CreateOfferData & any,
    ownerInfo: { name: string }
  ): OfferObject {
    const now = new Date().toISOString();
    const priceDifference = renterOffer.renterOfferPrice - renterOffer.ownerPrice;
    const weeklyRate = renterOffer.renterOfferPrice / 4.33;
    const dailyRate = renterOffer.renterOfferPrice / 30;

    // Calculate rental duration
    const startDate = new Date(renterOffer.renterStartDate);
    const endDate = new Date(renterOffer.renterEndDate);
    const rentalDurationMonths = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Generate message preview
    const messagePreview = renterOffer.renterNote && renterOffer.renterNote.length > 50
      ? renterOffer.renterNote.substring(0, 50) + '...'
      : renterOffer.renterNote || '';

    return {
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      propertyId: renterOffer.propertyId,
      propertyTitle: renterOffer.propertyTitle,
      propertyImage: renterOffer.propertyImage,
      renterId: renterOffer.renterId,
      renterName: renterOffer.renterName,
      renterAge: renterOffer.renterAge,
      renterOccupation: renterOffer.renterOccupation,
      renterLocation: renterOffer.renterLocation,
      renterProfileImage: renterOffer.renterProfileImage || 'https://via.placeholder.com/100?text=User',
      renterIsVerified: renterOffer.renterIsVerified || false,
      ownerId: renterOffer.ownerId,
      ownerName: ownerInfo.name,
      ownerPrice: renterOffer.ownerPrice,
      ownerStartDate: renterOffer.ownerStartDate,
      ownerEndDate: renterOffer.ownerEndDate,
      renterOfferPrice: renterOffer.renterOfferPrice,
      renterStartDate: renterOffer.renterStartDate,
      renterEndDate: renterOffer.renterEndDate,
      renterNote: renterOffer.renterNote || '',
      status: 'pending',
      messagePreview,
      priceDifference,
      isPriceIncrease: priceDifference > 0,
      weeklyRate,
      dailyRate,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      rentalDurationMonths,
    };
  }

  private notifySubscribers(key: string): void {
    const subs = this.subscriptions.get(key);
    if (subs) {
      const relevantOffers = this.getOffersForSubscriber(key);
      subs.forEach(callback => {
        try {
          callback(relevantOffers);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });
    }
  }

  private notifyAllSubscribers(): void {
    this.subscriptions.forEach((callbacks, key) => {
      const relevantOffers = this.getOffersForSubscriber(key);
      callbacks.forEach(callback => {
        try {
          callback(relevantOffers);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });
    });
  }

  private getOffersForSubscriber(key: string): OfferObject[] {
    if (key.startsWith('owner_')) {
      const ownerId = key.replace('owner_', '');
      return this.offers.filter(offer => offer.ownerId === ownerId);
    } else if (key.startsWith('property_')) {
      const propertyId = key.replace('property_', '');
      return this.offers.filter(offer => offer.propertyId === propertyId);
    }
    return this.offers;
  }

  private startPeriodicCleanup(): void {
    // Clean up expired offers every hour
    setInterval(() => {
      this.cleanupExpiredOffers();
    }, 60 * 60 * 1000); // 1 hour
  }

  private async cleanupExpiredOffers(): Promise<void> {
    const now = new Date().toISOString();
    let hasChanges = false;

    this.offers = this.offers.map(offer => {
      if (offer.expiresAt <= now && offer.status === 'pending') {
        hasChanges = true;
        return {
          ...offer,
          status: 'expired' as const,
          updatedAt: now,
        };
      }
      return offer;
    });

    if (hasChanges) {
      await this.saveOffersToStorage();
      this.notifyAllSubscribers();
      console.log('🧹 Cleaned up expired offers');
    }
  }
}

// Singleton instance
const offersManager = new OffersManager();

// Auto-initialize
offersManager.initialize().catch(console.error);

export default offersManager;
export { OffersManager };
