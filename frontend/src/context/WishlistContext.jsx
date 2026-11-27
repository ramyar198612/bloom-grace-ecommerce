
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);

    try {
      const data = await wishlistService.getWishlist();
      setWishlistItems(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Wishlist loading failed:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      refreshWishlist();
    }
  }, [authLoading, refreshWishlist]);

  const addToWishlist = async (productId) => {
    const item = await wishlistService.addToWishlist(productId);
    await refreshWishlist();
    return item;
  };

  const removeFromWishlist = async (wishlistId) => {
    await wishlistService.removeFromWishlist(wishlistId);
    setWishlistItems((previous) =>
      previous.filter((item) => item.id !== wishlistId)
    );
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(
      (item) => Number(item.product) === Number(productId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }

  return context;
}
