
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Trash2,
} from 'lucide-react';

import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const data = await reviewService.getReviews(id);
      setReviews(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Review loading error:', err);
      setReviewError('Unable to load customer reviews.');
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        setQuantity(1);

        const [productResponse, productsResponse] = await Promise.all([
          api.get(`/products/${id}/`),
          api.get('/products/'),
        ]);

        const currentProduct = productResponse.data;
        const allProducts = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : productsResponse.data.results || [];

        setProduct(currentProduct);

        setRelatedProducts(
          allProducts
            .filter((item) => {
              const itemCategory =
                typeof item.category === 'object'
                  ? item.category?.id
                  : item.category;

              const currentCategory =
                typeof currentProduct.category === 'object'
                  ? currentProduct.category?.id
                  : currentProduct.category;

              return (
                item.id !== currentProduct.id &&
                String(itemCategory) === String(currentCategory)
              );
            })
            .slice(0, 4)
        );
      } catch (err) {
        console.error('Product details error:', err);
        setError('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setReviews([]);
    setReviewError('');
    setReviewMessage('');
    setReviewTitle('');
    setReviewComment('');
    setRating(5);
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (Number(product.stock) <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product, quantity);
    navigate('/cart');
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      : 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewMessage('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError('Please enter both review title and comment.');
      return;
    }

    try {
      setSubmittingReview(true);

      await reviewService.addReview(id, {
        rating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
      });

      setReviewTitle('');
      setReviewComment('');
      setRating(5);
      setReviewMessage('Thank you! Your review has been submitted.');

      await fetchReviews();
    } catch (err) {
      const data = err.response?.data;

      setReviewError(
        data?.detail ||
        data?.non_field_errors?.[0] ||
        'Unable to submit review. Please try again.'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      setReviews((previous) =>
        previous.filter((review) => review.id !== reviewId)
      );
      setReviewMessage('Your review has been deleted.');
    } catch (err) {
      setReviewError(
        err.response?.data?.detail || 'Unable to delete review.'
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf7] py-24 text-center text-[#806b63]">
        Loading product details...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#fffaf7] px-6 py-24 text-center">
        <p className="text-lg text-red-600">
          {error || 'Product not found.'}
        </p>
        <Link to="/shop" className="mt-6 inline-block text-[#a66b65] underline">
          Back to Shop
        </Link>
      </main>
    );
  }

  const stock = Number(product.stock || 0);
  const originalPrice = Number(product.original_price || 0);
  const price = Number(product.price || 0);

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#806b63] hover:text-[#a66b65]"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-[#f7efeb]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[650px] min-h-[350px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center text-[#b89b90]">
                <ShoppingBag size={70} strokeWidth={1.2} />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] text-[#a66b65]">
              BLOOM & GRACE COLLECTION
            </p>

            <h1 className="mt-4 font-serif text-3xl text-[#49352f] md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <div className="flex text-[#d69b36]">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={18}
                    fill={value <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>

              <span className="text-sm text-[#806b63]">
                {reviews.length > 0
                  ? `${averageRating.toFixed(1)} / 5 (${reviews.length} reviews)`
                  : 'No reviews yet'}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-2xl font-semibold text-[#49352f]">
                ₹{price.toFixed(2)}
              </span>

              {originalPrice > price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-[#f5e9e5] px-3 py-1 text-xs text-[#a66b65]">
                    Special Price
                  </span>
                </>
              )}
            </div>

            <div className="my-7 border-t border-[#eadbd5]" />

            <h2 className="font-serif text-xl text-[#49352f]">
              Product Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#806b63]">
              {product.description || 'A beautiful addition to your special moments.'}
            </p>

            <p className={`mt-6 text-sm ${stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {stock > 0 ? `${stock} items available` : 'Currently out of stock'}
            </p>

            {stock > 0 && (
              <>
                <div className="mt-7 flex items-center gap-5">
                  <span className="text-sm text-[#49352f]">Quantity</span>

                  <div className="flex items-center gap-4 rounded-full border border-[#eadbd5] bg-white px-4 py-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="text-[#806b63] disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-5 text-center text-sm">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      disabled={quantity >= stock}
                      className="text-[#806b63] disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#a66b65] px-7 py-4 text-sm text-white transition hover:bg-[#87534e] sm:w-72"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="rounded-2xl border border-[#f0e5df] bg-white p-6 md:p-10">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-[#a66b65]">
              CUSTOMER FEEDBACK
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#49352f]">
              Reviews & Ratings
            </h2>

            <p className="mt-3 text-sm text-[#806b63]">
              {reviews.length > 0
                ? `Rated ${averageRating.toFixed(1)} out of 5 by ${reviews.length} customer(s)`
                : 'Be the first customer to review this product.'}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-5 font-serif text-xl text-[#49352f]">
                Customer Reviews
              </h3>

              {reviewLoading ? (
                <p className="text-sm text-[#806b63]">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="rounded-xl bg-[#fffaf7] p-5 text-sm text-[#806b63]">
                  No customer reviews yet. Share your experience!
                </p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl bg-[#fffaf7] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex text-[#d69b36]">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                size={16}
                                fill={value <= review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>

                          <h4 className="mt-2 font-semibold text-[#49352f]">
                            {review.title}
                          </h4>

                          <p className="mt-1 text-xs text-[#a17e70]">
                            By {review.username}
                          </p>
                        </div>

                        {user && Number(user.id) === Number(review.user) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete your review"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#806b63]">
                        {review.comment}
                      </p>

                      <p className="mt-3 text-xs text-[#a17e70]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-5 font-serif text-xl text-[#49352f]">
                Write a Review
              </h3>

              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-[#49352f]">
                      Your Rating
                    </label>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          aria-label={`Rate ${value} stars`}
                          className="text-[#d69b36]"
                        >
                          <Star
                            size={29}
                            fill={value <= rating ? 'currentColor' : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#49352f]">
                      Review Title
                    </label>

                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      maxLength={200}
                      placeholder="Summarize your experience"
                      className="w-full rounded-xl border border-[#eadbd5] bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#49352f]">
                      Your Review
                    </label>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={5}
                      placeholder="Tell us about this product..."
                      className="w-full rounded-xl border border-[#eadbd5] bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                      required
                    />
                  </div>

                  {reviewError && (
                    <p className="text-sm text-red-600">{reviewError}</p>
                  )}

                  {reviewMessage && (
                    <p className="text-sm text-green-700">{reviewMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="rounded-full bg-[#a66b65] px-7 py-3 text-sm text-white transition hover:bg-[#87534e] disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="rounded-xl bg-[#fffaf7] p-6">
                  <p className="text-sm text-[#806b63]">
                    Please login to share your product review and rating.
                  </p>

                  <Link
                    to="/login"
                    className="mt-4 inline-block rounded-full bg-[#a66b65] px-6 py-3 text-sm text-white hover:bg-[#87534e]"
                  >
                    Login to Review
                  </Link>
                </div>
              )}

              {(reviewError || reviewMessage) && !user && (
                <p className="mt-3 text-sm text-[#806b63]">
                  {reviewError || reviewMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.3em] text-[#a66b65]">
              YOU MAY ALSO LIKE
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#49352f]">
              Related Products
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="group overflow-hidden rounded-xl border border-[#f0e5df] bg-white"
              >
                <div className="aspect-square overflow-hidden bg-[#f7efeb]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#b89b90]">
                      <ShoppingBag size={35} />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-base text-[#49352f]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[#a66b65]">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductDetails;
