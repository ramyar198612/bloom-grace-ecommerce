
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flower2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isWishlisted, wishlistItems } =
    useWishlist();

  const [savingWishlist, setSavingWishlist] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${backendUrl}${product.image}`
    : '';

  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.price);

  const outOfStock = Number(product.stock) <= 0;
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location.pathname },
      });
      return;
    }

    if (savingWishlist) return;

    setSavingWishlist(true);

    try {
      if (wishlisted) {
        const wishlistItem = wishlistItems.find(
          (item) => Number(item.product) === Number(product.id)
        );

        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Wishlist update failed:', error);
      alert(
        error.response?.data?.detail ||
        'Unable to update Wishlist. Please try again.'
      );
    } finally {
      setSavingWishlist(false);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-[1.5rem] border border-[#f0e4dd] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#754b43]/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f5ece7]">

        <Link to={`/products/${product.id}`} className="block h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Flower2
                size={65}
                strokeWidth={1}
                className="text-[#c49a8d]"
              />
            </div>
          )}
        </Link>

        {hasDiscount && (
          <span className="absolute left-4 top-4 rounded-full bg-[#754b43] px-4 py-2 text-xs font-medium text-white shadow-md">
            Special Price
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          disabled={savingWishlist}
          title={
            wishlisted
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
          }
          aria-label={
            wishlisted
              ? `Remove ${product.name} from Wishlist`
              : `Add ${product.name} to Wishlist`
          }
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#a36e69] shadow-md transition hover:scale-110 disabled:opacity-50"
        >
          <Heart
            size={19}
            strokeWidth={1.7}
            fill={wishlisted ? '#a36e69' : 'none'}
            className={wishlisted ? 'text-[#a36e69]' : ''}
          />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#49352f]/45">
            <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#754b43]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">

        {product.category_name && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b77979]">
            {product.category_name}
          </p>
        )}

        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-12 font-serif text-lg text-[#49352f] transition-colors hover:text-[#a36e69] sm:text-xl">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#927e73]">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span className="font-serif text-xl font-semibold text-[#754b43]">
            ₹{Number(product.price).toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-[#b5a49a] line-through">
              ₹{Number(product.original_price).toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#754b43] px-4 py-3 text-xs font-medium text-white transition duration-300 hover:bg-[#9c6963] disabled:cursor-not-allowed disabled:bg-[#b9aaa3]"
          >
            <ShoppingBag size={16} />
            {outOfStock ? 'Unavailable' : 'Add to Cart'}
          </button>

          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8d8cf] text-[#754b43] transition hover:border-[#754b43] hover:bg-[#f8eee9]"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </motion.article>
  );
}

export default ProductCard;
