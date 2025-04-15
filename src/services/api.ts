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
  phoneNumber: string;
  claimedBy?: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'shelter' | 'restaurant';
    phoneNumber: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
    };
  };
  token: string;
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No auth token found in localStorage');
    return {};
  }
  return { 
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorData = data as { error: string };
    console.error('API Error:', errorData);
    
    if (response.status === 401) {
      switch (errorData.error) {
        case 'Token expired':
          localStorage.removeItem('token');
          throw new Error('Your session has expired. Please log in again.');
        case 'Invalid token':
          localStorage.removeItem('token');
          throw new Error('Invalid session. Please log in again.');
        case 'No token provided':
        case 'No authorization header found':
          throw new Error('Please log in to continue.');
        case 'User not found':
          localStorage.removeItem('token');
          throw new Error('Account not found. Please log in again.');
        default:
          throw new Error(errorData.error || 'Authentication failed');
      }
    }
    
    throw new Error(errorData.error || 'An error occurred');
  }
  
  return data;
};

export const api = {
  // Get all donations
  getDonations: async (): Promise<Donation[]> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_BASE_URL}/donations`, { headers });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Create a new donation
  createDonation: async (donation: Omit<Donation, 'id'>): Promise<Donation> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(donation),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Claim a donation
  claimDonation: async (id: string): Promise<Donation> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_BASE_URL}/donations/${id}/claim`, {
        method: 'PATCH',
        headers,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error claiming donation:', error);
      throw error;
    }
  },

  // Mark donation as picked up
  pickupDonation: async (id: string): Promise<Donation> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_BASE_URL}/donations/${id}/pickup`, {
        method: 'PATCH',
        headers,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },

  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Register
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'shelter' | 'restaurant';
  }): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
}; 