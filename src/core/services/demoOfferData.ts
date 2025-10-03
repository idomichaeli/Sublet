import renterOfferService from './renterOfferService';
import offerService from './offerService';

/**
 * Demo script to test the offer submission flow
 * This creates sample offers for testing the owner inbox functionality
 */
export const createDemoOffers = async () => {
  try {
    console.log('🚀 Creating demo offers...');
    
    // Demo property data (would normally come from property listings)
    const demoProperty = {
      id: 'property_demo_1',
      title: 'Beautiful 2BR Apartment in Tel Aviv',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      ownerId: 'current-owner',
      ownerPrice: 4500, // Owner's asking price per month
      ownerStartDate: '2024-02-01', // Owner's preferred start date
      ownerEndDate: '2024-11-30', // Owner's preferred end date
    };
    
    const ownerInfo = {
      name: 'Property Owner'
    };
    
    // Demo renters
    const demoRenters = [
      {
        id: 'renter_1',
        name: 'Sarah Johnson',
        age: 28,
        occupation: 'Software Engineer',
        location: 'Tel Aviv',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        isVerified: true,
      },
      {
        id: 'renter_2',
        name: 'Michael Chen',
        age: 24,
        occupation: 'Graduate Student',
        location: 'Haifa',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        isVerified: false,
      },
      {
        id: 'renter_3',
        name: 'Emma Davis',
        age: 31,
        occupation: 'Marketing Manager',
        location: 'Jerusalem',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        isVerified: true,
      },
      {
        id: 'renter_4',
        name: 'David Wilson',
        age: 26,
        occupation: 'Software Engineer',
        location: 'Ramat Gan',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        isVerified: true,
      },
    ];
    
    // Demo offers with different scenarios
    const demoOffers = [
      {
        renter: demoRenters[0],
        offer: {
          offerPrice: 4800, // Higher than asking price
          startDate: '2024-02-15',
          endDate: '2024-11-30',
          note: 'Hi! I\'m very interested in your apartment. I\'m a responsible tenant with excellent references and ready to provide additional deposits. I can move in immediately and would love to schedule a viewing.',
        }
      },
      {
        renter: demoRenters[1],
        offer: {
          offerPrice: 3300, // Lower than asking price
          startDate: '2024-02-01',
          endDate: '2024-08-01',
          note: 'Hello! I would love to schedule a viewing. I\'m available this weekend and have all necessary documentation ready. Could we discuss flexible payment terms?',
        }
      },
      {
        renter: demoRenters[2],
        offer: {
          offerPrice: 4500, // Same as asking price
          startDate: '2024-02-01',
          endDate: '2024-11-30',
          note: 'This property looks perfect for my needs. I\'m ready to move forward and can provide references from my previous landlords. I\'m flexible with move-in dates.',
        }
      },
      {
        renter: demoRenters[3],
        offer: {
          offerPrice: 4700, // Slightly higher than asking price
          startDate: '2024-02-20',
          endDate: '2024-07-20',
          note: 'I\'m a software engineer looking for a quiet place to work from home. I don\'t smoke, have no pets, and keep very clean. I can pay upfront for several months.',
        }
      },
    ];
    
    // Submit each offer
    const results = [];
    for (const { renter, offer } of demoOffers) {
      const result = await renterOfferService.submitOffer(
        demoProperty,
        offer,
        renter,
        ownerInfo
      );
      
      results.push(result);
      
      if (result.success) {
        console.log(`✅ Offer submitted for ${renter.name}: $${offer.offerPrice}/month`);
        console.log(`📅 Dates: ${offer.startDate} to ${offer.endDate}`);
        console.log(`💬 "${offer.note.substring(0, 50)}..."`);
        console.log('---');
      } else {
        console.error(`❌ Failed to submit offer for ${renter.name}:`, result.error);
      }
    }
    
    // Update one offer to accepted status for demonstration
    if (results[0]?.offer?.id) {
      await offerService.updateOfferStatus(results[0].offer.id, 'accepted');
      console.log('✅ Updated first offer to ACCEPTED status');
    }
    
    // Update second offer to rejected status for demonstration
    if (results[1]?.offer?.id) {
      await offerService.updateOfferStatus(results[1].offer.id, 'rejected');
      console.log('❌ Updated second offer to REJECTED status');
    }
    
    console.log('🎉 Demo offers created successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${results.filter(r => r.success).length} offers created`);
    console.log(`   • Property: ${demoProperty.title}`);
    console.log(`   • Owner: ${ownerInfo.name} (current-owner)`);
    console.log(`   • Check the owner inbox to see incoming offers!`);
    
    return results;
  } catch (error) {
    console.error('❌ Error creating demo offers:', error);
    throw error;
  }
};

/**
 * Clear all demo offers (useful for resetting test data)
 */
export const clearDemoOffers = async () => {
  try {
    await offerService.clearAllOffers();
    console.log('🧹 All demo offers cleared');
  } catch (error) {
    console.error('❌ Error clearing demo offers:', error);
    throw error;
  }
};

/**
 * Get offer statistics for the owner dashboard
 */
export const getOwnerOfferStats = async (ownerId: string = 'current-owner') => {
  try {
    const stats = await offerService.getOfferStatsByOwner(ownerId);
    console.log('📊 Owner Offer Statistics:');
    console.log(`   • Total Offers: ${stats.totalOffers}`);
    console.log(`   • Pending: ${stats.pendingOffers}`);
    console.log(`   • Accepted: ${stats.acceptedOffers}`);
    console.log(`   • Rejected: ${stats.rejectedOffers}`);
    console.log(`   • Average Offer: $${Math.round(stats.averageOfferPrice)}`);
    console.log(`   • Today's Offers: ${stats.totalOffersToday}`);
    return stats;
  } catch (error) {
    console.error('❌ Error getting offer stats:', error);
    throw error;
  }
};
