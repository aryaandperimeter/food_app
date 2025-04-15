import { useState, useEffect } from 'react';
import { api, Donation } from '../services/api';

const ShelterDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const shelterName = 'Test Shelter'; // In a real app, this would come from user authentication

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await api.getDonations();
      setDonations(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to fetch donations');
    }
  };

  const handleClaim = async (id: string) => {
    try {
      if (!id) {
        console.error('No donation ID provided');
        setError('Invalid donation ID');
        return;
      }
      console.log('Claiming donation with ID:', id);
      const updatedDonation = await api.claimDonation(id, shelterName);
      
      // Update the donations list with the updated donation
      setDonations(prevDonations => 
        prevDonations.map(donation => {
          const donationId = donation._id || donation.id;
          if (!donationId) return donation;
          return donationId === id ? updatedDonation : donation;
        })
      );
      
      setError(null);
    } catch (err: any) {
      console.error('Error in handleClaim:', err);
      setError(err.message || 'Failed to claim donation');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Shelter Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Available Donations</h2>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{donation.foodName}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        donation.status === 'Available' ? 'bg-green-100 text-green-800' :
                        donation.status === 'Claimed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{donation.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Restaurant: {donation.restaurantName}</p>
                      <p>Contact: {donation.phoneNumber}</p>
                      <p>Quantity: {donation.quantity}</p>
                      <p>Expiration: {new Date(donation.expiration).toLocaleString()}</p>
                      <p>Pickup Time: {new Date(donation.pickupTime).toLocaleString()}</p>
                      {donation.notes && <p>Notes: {donation.notes}</p>}
                    </div>
                  </div>
                  
                  {donation.status === 'Available' && (
                    <button
                      onClick={() => {
                        console.log('Donation to claim:', donation);
                        handleClaim(donation._id || donation.id);
                      }}
                      className="btn-primary ml-4"
                    >
                      Claim Donation
                    </button>
                  )}
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <p className="text-gray-500 text-center">No available donations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard; 