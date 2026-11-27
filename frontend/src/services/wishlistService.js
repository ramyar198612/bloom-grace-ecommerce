
import api from './api';

const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist/');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist/', {
      product: productId,
    });
    return response.data;
  },

  removeFromWishlist: async (wishlistId) => {
    const response = await api.delete(`/wishlist/${wishlistId}/`);
    return response.data;
  },
};

export default wishlistService;
