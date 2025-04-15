import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api, Donation } from '../services/api';

const RestaurantDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch donations on component mount
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

  const onSubmit = async (data: any) => {
    try {
      console.log('Submitting donation data:', data);
      const newDonation = await api.createDonation({
        ...data,
        status: 'Available',
        restaurantName: 'Test Restaurant', // In a real app, this would come from user authentication
      });
      console.log('Successfully created donation:', newDonation);
      setDonations(prevDonations => [...prevDonations, newDonation]);
      reset();
      setError(null);
    } catch (err: any) {
      console.error('Error creating donation:', err);
      setError(err.message || 'Failed to create donation');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Donation Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add Food Donation</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              <input
                type="text"
                {...register('restaurantName')}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="input-field"
                placeholder="(123) 456-7890"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Item Name</label>
              <input
                type="text"
                {...register('foodName')}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                className="input-field"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="text"
                {...register('quantity')}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiration/Best By</label>
              <input
                type="datetime-local"
                {...register('expiration')}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
              <input
                type="datetime-local"
                {...register('pickupTime')}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                className="input-field"
                rows={2}
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              Add Donation
            </button>
          </form>
        </div>

        {/* Donations List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Donations</h2>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{donation.foodName}</h3>
                    <p className="text-gray-600">{donation.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Quantity: {donation.quantity}</p>
                      <p>Expiration: {new Date(donation.expiration).toLocaleString()}</p>
                      <p>Pickup Time: {new Date(donation.pickupTime).toLocaleString()}</p>
                      {donation.notes && <p>Notes: {donation.notes}</p>}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    donation.status === 'Available' ? 'bg-green-100 text-green-800' :
                    donation.status === 'Claimed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {donation.status}
                  </span>
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <p className="text-gray-500 text-center">No donations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard; 