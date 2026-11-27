
import api from './api';

const reviewService = {
  getReviews: async (productId) => {
    const response = await api.get(`/reviews/products/${productId}/`);
    return response.data;
  },

  addReview: async (productId, reviewData) => {
    const response = await api.post(
      `/reviews/products/${productId}/`,
      reviewData
    );
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.patch(
      `/reviews/${reviewId}/`,
      reviewData
    );
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}/`);
    return response.data;
  },
};

export default reviewService;
