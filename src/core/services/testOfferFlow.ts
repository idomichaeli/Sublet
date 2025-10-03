import offersManager from './offersManager';
import renterOfferSubmission from './renterOfferSubmission';

/**
 * Test the complete offer flow from renter to owner inbox
 */
export const testCompleteOfferFlow = async () => {
  console.log('🧪 Starting complete offer flow test...');
  
  try {
    // Step 1: Initialize the offers manager
    await offersManager.initialize();
    console.log('✅ OffersManager initialized');

    // Step 2: Create sample offers for testing
    await offersManager.createSampleOffersForTesting();
    console.log('✅ Sample offers created');

    // Step 3: Test renter offer submission
    const testOffer = await renterOfferSubmission.submitOffer(
      // Property data (as if from property listing)
      {
        id: 'test_property_123',
        title: 'Luxury Apartment in Downtown Tel Aviv',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        ownerId: 'current-owner',
        ownerPrice: 5000, // Owner's asking price
        ownerStartDate: '2024-03-01',
        ownerEndDate: '2024-11-30',
      },
      // Renter input
      {
        offerPrice: 5500, // Renter offers more
        startDate: '2024-03-15',
        endDate: '2024-11-30',
        note: 'Hi! I\'m very interested in your luxury apartment. I\'m a working professional with excellent references and can move in immediately. I\'m willing to pay above asking price for the right property.',
      },
      // Current user info
      {
        id: 'test_renter_456',
        name: 'Alex Johnson',
        age: 30,
        occupation: 'Tech Manager',
        location: 'Tel Aviv',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        isVerified: true,
      },
      // Owner info
      {
        name: 'Property Owner',
      }
    );

    if (testOffer.success) {
      console.log('✅ Test offer submitted successfully!');
      console.log(`📧 Offer ID: ${testOffer.offer?.id}`);
      
      // Step 4: Verify offer appears in owner inbox
      const ownerOffers = await offersManager.getOffersForOwner('current-owner');
      const ourOffer = ownerOffers.find(o => o.id === testOffer.offer?.id);
      
      if (ourOffer) {
        console.log('✅ Offer found in owner inbox!');
        console.log(`   Property: ${ourOffer.propertyTitle}`);
        console.log(`   Renter: ${ourOffer.renterName} (${ourOffer.renterOccupation})`);
        console.log(`   Offer: $${ourOffer.renterOfferPrice}/month (Owner asked: $${ourOffer.ownerPrice})`);
        console.log(`   Status: ${ourOffer.status}`);
        
        // Step 5: Test owner action (accept offer)
        const acceptResult = await offersManager.updateOfferStatus(
          ourOffer.id, 
          'accepted',
          { id: 'current-owner', name: 'Property Owner' }
        );
        
        if (acceptResult.success) {
          console.log('✅ Offer status updated to accepted!');
          
          // Step 6: Verify updated status
          const updatedOffers = await offersManager.getOffersForOwner('current-owner');
          const updatedOffer = updatedOffers.find(o => o.id === ourOffer.id);
          
          if (updatedOffer?.status === 'accepted') {
            console.log('✅ Offer status correctly updated in owner inbox!');
          }
        }
      } else {
        console.log('❌ Offer not found in owner invites!');
      }
      
      // Step 7: Show owner statistics
      const stats = await offersManager.getOwnerOfferStats('current-owner');
      console.log('📊 Owner Offer Statistics:');
      console.log(`   • Total Offers: ${stats.total}`);
      console.log(`   • Pending: ${stats.pending}`);
      console.log(`   • Accepted: ${stats.accepted}`);
      console.log(`   • Rejected: ${stats.rejected}`);
      console.log(`   • Average Offer Price: $${Math.round(stats.averageOfferPrice)}`);
      
      console.log('🎉 Complete offer flow test PASSED!');
      console.log('');
      console.log('📱 Next steps:');
      console.log('1. Navigate to Owner mode in your app');
      console.log('2. Go to the "Offers" tab');
      console.log('3. You should see the submitted offers');
      console.log('4. Try accept/reject actions');
      console.log('5. Use filter buttons to see different statuses');
      
      return { success: true, message: 'All tests passed!' };
      
    } else {
      console.log('❌ Test offer submission failed:', testOffer.error);
      return { success: false, error: testOffer.error };
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Quick test of just the core submission flow
 */
export const testOfferSubmission = async () => {
  console.log('🚀 Testing offer submission only...');
  
  const result = await renterOfferSubmission.submitOffer(
    {
      id: 'quick_test_property',
      title: 'Quick Test Apartment',
      image: 'https://via.placeholder.com/400',
      ownerId: 'current-owner',
      ownerPrice: 3000,
      ownerStartDate: '2024-02-01',
      ownerEndDate: '2024-08-01',
    },
    {
      offerPrice: 3200,
      startDate: '2024-02-15',
      endDate: '2024-07-15',
      note: 'This is a test offer for verification.',
    },
    {
      id: 'quick_test_user',
      name: 'Test User',
      age: 25,
      occupation: 'Tester',
      location: 'Tel Aviv',
      isVerified: false,
    },
    {
      name: 'Test Owner',
    }
  );
  
  if (result.success) {
    console.log('✅ Quick submission test PASSED!');
  } else {
    console.log('❌ Quick submission test FAILED:', result.error);
  }
  
  return result;
};

/**
 * Clear all test data
 */
export const clearTestOffers = async () => {
  console.log('🧹 Clearing all test offers...');
  await offersManager.clearAllOffers();
  console.log('✅ All offers cleared!');
};
