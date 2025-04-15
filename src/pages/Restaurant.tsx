import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Donation {
  id: string;
  restaurantName: string;
  foodItems: string;
  quantity: number;
  expiryTime: string;
  status: 'available' | 'claimed' | 'picked-up';
  createdAt: string;
}

export default function Restaurant() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [newDonation, setNewDonation] = useState({
    restaurantName: '',
    foodItems: '',
    quantity: 1,
    expiryTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donation: Donation = {
      id: Date.now().toString(),
      ...newDonation,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    setDonations([donation, ...donations]);
    setNewDonation({
      restaurantName: '',
      foodItems: '',
      quantity: 1,
      expiryTime: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Donation Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  value={newDonation.restaurantName}
                  onChange={(e) => setNewDonation({ ...newDonation, restaurantName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="foodItems" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Items
                </label>
                <textarea
                  id="foodItems"
                  value={newDonation.foodItems}
                  onChange={(e) => setNewDonation({ ...newDonation, foodItems: e.target.value })}
                  className="input-field"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (portions)
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={newDonation.quantity}
                  onChange={(e) => setNewDonation({ ...newDonation, quantity: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiryTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Time
                </label>
                <input
                  type="datetime-local"
                  id="expiryTime"
                  value={newDonation.expiryTime}
                  onChange={(e) => setNewDonation({ ...newDonation, expiryTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Donation
              </button>
            </form>
          </div>

          {/* Donations List */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Donations</h2>
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No donations yet. Create your first donation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{donation.restaurantName}</h3>
                      <span className={`status-badge status-${donation.status}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{donation.foodItems}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{donation.quantity} portions</span>
                      <span>Expires: {new Date(donation.expiryTime).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 