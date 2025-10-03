import offersManager from './offersManager';

/**
 * Simplified service for renters to submit offers
 * All offers go through the central OffersManager
 */
export class RenterOfferSubmission {
  
  /**
   * Submit an offer from renter - this will reach the owner's inbox automatically
   */
  async submitOffer(
    propertyData: {
      id: string;
      title: string;
      image: string;
      ownerId: string;
      ownerPrice: number;
      ownerStartDate: string;
      ownerEndDate: string;
    },
    renterInput: {
      offerPrice: number;
      startDate: string;
      endDate: string;
      note: string;
    },
    currentUser: {
      id: string;
      name: string;
      age: number;
      occupation: string;
      location: string;
      profileImage?: string;
      isVerified?: boolean;
    },
    ownerInfo: {
      name: string;
    }
  ): Promise<{ success: boolean; offer?: any; error?: string; message?: string }> {
    
    try {
      console.log('📝 Submitting offer from renter to owner inbox...');
      
      const offerSubmission = {
        // Property data
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        propertyImage: propertyData.image,
        ownerId: propertyData.ownerId,
        ownerPrice: propertyData.ownerPrice,
        ownerStartDate: propertyData.ownerStartDate,
        ownerEndDate: propertyData.ownerEndDate,
        
        // Renter input
        renterOfferPrice: renterInput.offerPrice,
        renterStartDate: renterInput.startDate,
        renterEndDate: renterInput.endDate,
        renterNote: renterInput.note,
        
        // Renter info
        renterId: currentUser.id,
        renterName: currentUser.name,
        renterAge: currentUser.age,
        renterOccupation: currentUser.occupation,
        renterLocation: currentUser.location,
        renterProfileImage: currentUser.profileImage,
        renterIsVerified: currentUser.isVerified,
      };

      // Submit through centralized manager
      const result = await offersManager.submitRenterOffer(offerSubmission, ownerInfo);
      
      if (result.success) {
        console.log('✅ Offer successfully sent to owner inbox!');
        console.log(`🏠 Property: ${propertyData.title}`);
        console.log(`👤 From: ${currentUser.name} (${currentUser.occupation})`);
        console.log(`💰 Offer: $${renterInput.offerPrice}/month (Owner asked: $${propertyData.ownerPrice})`);
        console.log(`📅 Dates: ${renterInput.startDate} to ${renterInput.endDate}`);
        
        return {
          success: true,
          offer: result.offer,
          message: 'Your offer has been submitted and sent to the property owner\'s inbox!'
        };
      } else {
        return {
          success: false,
          error: result.error,
          message: 'Failed to submit offer. Please try again.'
        };
      }

    } catch (error) {
      console.error('❌ Error submitting offer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to submit offer. Please try again.'
      };
    }
  }

  /**
   * Get recommended offer prices for a property
   */
  calculatePriceRecommendations(ownerPrice: number) {
    return {
      conservative: Math.round(ownerPrice * 0.95), // 5% below asking
      listingPrice: ownerPrice, // At asking price
      competitive: Math.round(ownerPrice * 1.05), // 5% above asking
      premium: Math.round(ownerPrice * 1.10), // 10% above asking
    };
  }

  /**
   * Validate offer input before submission
   */
  validateOfferInput(input: {
    offerPrice: number;
    startDate: string;
    endDate: string;
    note: string;
  }): { isValid: boolean; error?: string } {
    
    if (!input.offerPrice || input.offerPrice <= 0) {
      return { isValid: false, error: 'Invalid offer amount' };
    }
    
    if (!input.startDate || !input.endDate) {
      return { isValid: false, error: 'Start and end dates are required' };
    }
    
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    
    if (startDate >= endDate) {
      return { isValid: false, error: 'End date must be after start date' };
    }
    
    // Check minimum rental period (30 days)
    const rentalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (rentalDays < 30) {
      return { isValid: false, error: 'Minimum rental period is 30 days' };
    }
    
    // Check if start date is at least tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (startDate < tomorrow) {
      return { isValid: false, error: 'Start date must be at least 1 day in the future' };
    }
    
    if (input.note && input.note.length > 500) {
      return { isValid: false, error: 'Note cannot exceed 500 characters' };
    }
    
    return { isValid: true };
  }

  /**
   * Format offer summary for display
   */
  formatOfferSummary(offer: {
    renterOfferPrice: number;
    renterStartDate: string;
    renterEndDate: string;
    note: string;
  }) {
    const startDate = new Date(offer.renterStartDate);
    const endDate = new Date(offer.renterEndDate);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return {
      formattedPrice: `$${offer.renterOfferPrice}/month`,
      formattedDateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      duration: `${duration} months`,
      totalAmount: offer.renterOfferPrice * duration,
      weeklyRate: Math.round(offer.renterOfferPrice / 4.33),
      dailyRate: Math.round(offer.renterOfferPrice / 30),
      notePreview: offer.note.length > 50 
        ? offer.note.substring(0, 50) + '...'
        : offer.note,
    };
  }
}

// Export singleton
export const renterOfferSubmission = new RenterOfferSubmission();
export default renterOfferSubmission;
