
import { motion } from 'framer-motion';
import { Heart, Flower2 } from 'lucide-react';

function ProductCard({ product, onAddToCart }) {
  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${backendUrl}${product.image}`
    : '';

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
    >
      <div className="relative h-72 overflow-hidden bg-[#f3ebe5]">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Flower2 size={60} className="text-[#c8a6a0]" />
          </div>
        )}

        {product.original_price && (
          <span className="absolute left-4 top-4 rounded-full bg-[#754b43] px-3 py-1 text-xs text-white">
            Special Price
          </span>
        )}

        <button
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 rounded-full bg-white p-3 text-[#a36e69] shadow"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-5">
        <p className="text-xs tracking-wider text-[#b77979]">
          {product.category_name || 'SPECIAL COLLECTION'}
        </p>

        <h3 className="mt-2 font-serif text-xl">
          {product.name}
        </h3>

        <p className="mt-3 text-lg font-semibold text-[#754b43]">
          ₹{Number(product.price).toLocaleString('en-IN')}

          {product.original_price && (
            <span className="ml-2 text-sm font-normal text-gray-400 line-through">
              ₹{Number(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
        </p>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className="mt-5 w-full rounded-full bg-[#f1e5df] py-3 text-sm font-medium transition hover:bg-[#754b43] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
