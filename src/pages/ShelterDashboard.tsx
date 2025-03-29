import { useState } from 'react';

interface Donation {
  id: string;
  foodName: string;
  description: string;
  quantity: string;
  expiration: string;
  pickupTime: string;
  notes: string;
  status: 'Available' | 'Claimed' | 'Picked Up';
  restaurantName: string;
}

// Mock data for demonstration
const mockDonations: Donation[] = [
  {
    id: '1',
    foodName: 'Fresh Pasta',
    description: 'Homemade pasta with sauce',
    quantity: '10 servings',
    expiration: '2024-03-30T20:00:00',
    pickupTime: '2024-03-30T18:00:00',
    notes: 'Please bring containers',
    status: 'Available',
    restaurantName: 'Italian Delight',
  },
  {
    id: '2',
    foodName: 'Sandwich Platter',
    description: 'Assorted sandwiches',
    quantity: '15 pieces',
    expiration: '2024-03-30T21:00:00',
    pickupTime: '2024-03-30T19:00:00',
    notes: 'Vegetarian options included',
    status: 'Available',
    restaurantName: 'Fresh Bites',
  },
];

const ShelterDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);

  const handleClaim = (id: string) => {
    setDonations(donations.map(donation => 
      donation.id === id 
        ? { ...donation, status: 'Claimed' as const }
        : donation
    ));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Shelter Dashboard</h1>
        
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
                      <p>Quantity: {donation.quantity}</p>
                      <p>Expiration: {new Date(donation.expiration).toLocaleString()}</p>
                      <p>Pickup Time: {new Date(donation.pickupTime).toLocaleString()}</p>
                      {donation.notes && <p>Notes: {donation.notes}</p>}
                    </div>
                  </div>
                  {donation.status === 'Available' && (
                    <button
                      onClick={() => handleClaim(donation.id)}
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