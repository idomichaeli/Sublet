import { PropertyObject } from './propertyObjects';

// Offer Status Types
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';

// Main Offer Object - Contains all offer data
export interface OfferObject {
  // Offer Identification
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  
  // User Information
  renterId: string;
  renterName: string;
  renterAge: number;
  renterOccupation: string;
  renterLocation: string;
  renterProfileImage: string;
  renterIsVerified: boolean;
  
  ownerId: string;
  ownerName: string;
  
  // Owner's Original Listing Details
  ownerPrice: number; // Owner's asking price per month
  ownerStartDate: string; // Owner's preferred start date
  ownerEndDate: string; // Owner's preferred end date
  
  // Renter's Offer Details
  renterOfferPrice: number; // Renter's proposed price per month
  renterStartDate: string; // Renter's preferred start date
  renterEndDate: string; // Renter's preferred end date
  renterNote: string; // Renter's message/note
  
  // Offer Management
  status: OfferStatus;
  messagePreview: string; // Auto-generated preview of renterNote
  
  // Calculation Fields
  priceDifference: number; // renterOfferPrice - ownerPrice
  isPriceIncrease: boolean; // true if renter offers more than asking
  weeklyRate: number; // Calculated from renterOfferPrice
  dailyRate: number; // Calculated from renterOfferPrice
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  expiresAt: string; // Auto-generated expiry (e.g., 48h from creation)
  
  // Additional Fields
  rentalDurationMonths: number; // Calculated from dates
  chatId?: string; // Reference to chat if offer progresses
}

// Input data for creating a new offer
export interface CreateOfferData {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  
  // Owner details (should be fetched from property data)
  ownerId: string;
  ownerPrice: number;
  ownerStartDate: string;
  ownerEndDate: string;
  
  // Renter input
  renterOfferPrice: number;
  renterStartDate: string;
  renterEndDate: string;
  renterNote: string;
}

// Offer filters for owner inbox
export interface OfferFilters {
  status?: OfferStatus[];
  propertyId?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
}

// Offer statistics for owner dashboard
export interface OfferStats {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;
  averageOfferPrice: number;
  totalOffersToday: number;
}

// Counter offer structure for negotiations
export interface CounterOffer {
  id: string;
  offerId: string;
  fromOwner: boolean; // true if counter is from owner, false if from renter
  counterPrice?: number;
  counterStartDate?: string;
  counterEndDate?: string;
  counterMessage: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Default offer object creator
export const createDefaultOfferObject = (): OfferObject => ({
  id: '',
  propertyId: '',
  propertyTitle: '',
  propertyImage: '',
  renterId: '',
  renterName: '',
  renterAge: 0,
  renterOccupation: '',
  renterLocation: '',
  renterProfileImage: '',
  renterIsVerified: false,
  ownerId: '',
  ownerName: '',
  ownerPrice: 0,
  ownerStartDate: '',
  ownerEndDate: '',
  renterOfferPrice: 0,
  renterStartDate: '',
  renterEndDate: '',
  renterNote: '',
  status: 'pending',
  messagePreview: '',
  priceDifference: 0,
  isPriceIncrease: false,
  weeklyRate: 0,
  dailyRate: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
  rentalDurationMonths: 0,
});

// Helper function to calculate derived fields
export const calculateOfferFields = (data: CreateOfferData, userInfo: {
  renterId: string;
  renterName: string;
  renterAge: number;
  renterOccupation: string;
  renterLocation: string;
  renterProfileImage: string;
  renterIsVerified: boolean;
  ownerName: string;
}): Omit<OfferObject, 'id' | 'createdAt' | 'updatedAt'> => {
  const priceDifference = data.renterOfferPrice - data.ownerPrice;
  const weeklyRate = data.renterOfferPrice / 4.33;
  const dailyRate = data.renterOfferPrice / 30;
  
  // Calculate rental duration in months
  const startDate = new Date(data.renterStartDate);
  const endDate = new Date(data.renterEndDate);
  const rentalDurationMonths = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  // Generate message preview (first 50 chars of note)
  const messagePreview = data.renterNote.length > 50 
    ? data.renterNote.substring(0, 50) + '...'
    : data.renterNote;
  
  return {
    propertyId: data.propertyId,
    propertyTitle: data.propertyTitle,
    propertyImage: data.propertyImage,
    renterId: userInfo.renterId,
    renterName: userInfo.renterName,
    renterAge: userInfo.renterAge,
    renterOccupation: userInfo.renterOccupation,
    renterLocation: userInfo.renterLocation,
    renterProfileImage: userInfo.renterProfileImage,
    renterIsVerified: userInfo.renterIsVerified,
    ownerId: data.ownerId,
    ownerName: userInfo.ownerName,
    ownerPrice: data.ownerPrice,
    ownerStartDate: data.ownerStartDate,
    ownerEndDate: data.ownerEndDate,
    renterOfferPrice: data.renterOfferPrice,
    renterStartDate: data.renterStartDate,
    renterEndDate: data.renterEndDate,
    renterNote: data.renterNote,
    status: 'pending',
    messagePreview,
    priceDifference,
    isPriceIncrease: priceDifference > 0,
    weeklyRate,
    dailyRate,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
    rentalDurationMonths,
  };
};
