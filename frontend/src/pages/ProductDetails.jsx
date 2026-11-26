
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            .filter(
              (item) =>
                item.id !== currentProduct.id &&
                String(item.category) === String(currentProduct.category)
            )
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

  const handleAddToCart = () => {
    if (Number(product.stock) <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product, quantity);

    // Automatically open Cart page
    navigate('/cart');
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
