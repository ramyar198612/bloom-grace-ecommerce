
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const {
    wishlistItems,
    loading,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
    } catch (error) {
      console.error('Wishlist removal failed:', error);
      alert('Unable to remove this product. Please try again.');
    }
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      alert('This product is currently out of stock.');
      return;
    }

    addToCart(product);
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <p className="font-serif text-xl text-[#754b43]">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf6] px-4 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#b77979]">
            YOUR FAVOURITES
          </p>

          <h1 className="font-serif text-4xl text-[#49352f] sm:text-5xl">
            My Wishlist
          </h1>

          <p className="mt-3 text-sm text-[#927e73]">
            Your favourite blooms, saved in one beautiful place.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-[2rem] border border-[#f0e4dd] bg-white px-6 py-16 text-center shadow-sm">
            <Heart
              size={52}
              strokeWidth={1}
              className="mx-auto text-[#c49a8d]"
            />

            <h2 className="mt-5 font-serif text-2xl text-[#49352f]">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-sm text-[#927e73]">
              Save the products you love and find them here anytime.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#754b43] px-7 py-3 text-sm text-white transition hover:bg-[#9c6963]"
            >
              Explore Collection
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#927e73]">
              {wishlistItems.length} saved product(s)
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => {
                const product = item.product_details;

                if (!product) return null;

                const imageUrl = product.image
                  ? product.image.startsWith('http')
                    ? product.image
                    : `${backendUrl}${product.image}`
                  : '';

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.5rem] border border-[#f0e4dd] bg-white shadow-sm"
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="block aspect-[4/5] overflow-hidden bg-[#f5ece7]"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#c49a8d]">
                          <Heart size={55} strokeWidth={1} />
                        </div>
                      )}
                    </Link>

                    <div className="p-5">
                      <Link to={`/products/${product.id}`}>
                        <h2 className="font-serif text-xl text-[#49352f] hover:text-[#a36e69]">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-3 font-serif text-xl font-semibold text-[#754b43]">
                        ₹{Number(product.price).toFixed(2)}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={Number(product.stock) <= 0}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#754b43] px-3 py-3 text-xs text-white hover:bg-[#9c6963] disabled:cursor-not-allowed disabled:bg-[#b9aaa3]"
                        >
                          <ShoppingBag size={15} />
                          {Number(product.stock) <= 0 ? 'Unavailable' : 'Add to Cart'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          title="Remove from Wishlist"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8d8cf] text-[#a36e69] hover:bg-[#f8eee9]"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
