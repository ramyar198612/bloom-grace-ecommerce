
import api from './api';

const authService = {
  // Customer Registration
  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  // Customer Login
  login: async (credentials) => {
    const response = await api.post('/accounts/login/', credentials);

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('customer_user', JSON.stringify(response.data.user));

    return response.data;
  },

  // Get Customer Profile
  getProfile: async () => {
    const token = localStorage.getItem('access_token');

    const response = await api.get('/accounts/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Update Customer Profile
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('access_token');

    const response = await api.put('/accounts/profile/', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Customer Logout
  logout: async () => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');

    try {
      if (access && refresh) {
        await api.post(
          '/accounts/logout/',
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('customer_user');
    }
  },

  // Check Login Status
  isLoggedIn: () => {
    return Boolean(localStorage.getItem('access_token'));
  },
};

export default authService;
