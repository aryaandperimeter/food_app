const API_BASE_URL = 'http://localhost:5000/api';

export interface Donation {
  _id?: string;
  id?: string;
  foodName: string;
  description: string;
  quantity: string;
  expiration: string;
  pickupTime: string;
  notes?: string;
  status: 'Available' | 'Claimed' | 'Picked Up';
  restaurantName: string;
  claimedBy?: string;
}

const handleResponse = async (response: Response) => {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error handling response:', error);
    throw error;
  }
};

export const api = {
  // Get all donations
  getDonations: async (): Promise<Donation[]> => {
    try {
      console.log('Fetching donations from:', `${API_BASE_URL}/donations`);
      const response = await fetch(`${API_BASE_URL}/donations`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Create a new donation
  createDonation: async (donation: Omit<Donation, 'id'>): Promise<Donation> => {
    try {
      console.log('Creating donation:', donation);
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donation),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Claim a donation
  claimDonation: async (id: string, shelterName: string): Promise<Donation> => {
    try {
      console.log('Claiming donation:', id, 'by shelter:', shelterName);
      const response = await fetch(`${API_BASE_URL}/donations/${id}/claim`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shelterName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim donation');
      }

      return handleResponse(response);
    } catch (error: any) {
      console.error('Error claiming donation:', error);
      throw new Error(error.message || 'Failed to claim donation');
    }
  },

  // Mark donation as picked up
  pickupDonation: async (id: string): Promise<Donation> => {
    try {
      console.log('Marking donation as picked up:', id);
      const response = await fetch(`${API_BASE_URL}/donations/${id}/pickup`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },
}; 