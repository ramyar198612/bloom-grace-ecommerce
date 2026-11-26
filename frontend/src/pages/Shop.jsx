
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function Shop() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse] = await Promise.all([
          api.get('/products/'),
          api.get('/categories/'),
        ]);

        setProducts(
          Array.isArray(productResponse.data)
            ? productResponse.data
            : productResponse.data.results || []
        );

        setCategories(
          Array.isArray(categoryResponse.data)
            ? categoryResponse.data
            : categoryResponse.data.results || []
        );
      } catch (err) {
        console.error('Shop loading error:', err);
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        String(product.category) === String(selectedCategory);

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'low-high') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, search, sortBy]);

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product, 1);

    // Automatically open Cart page
    navigate('/cart');
  };

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <section className="bg-[#f5e9e5] px-6 py-16 text-center">
        <p className="mb-3 text-xs tracking-[0.35em] text-[#a66b65]">
          BLOOM & GRACE COLLECTION
        </p>
        <h1 className="font-serif text-4xl text-[#49352f] md:text-5xl">
          Shop Our Collection
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806b63]">
          Discover beautiful artificial flowers and elegant hair accessories
          for your special moments.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#49352f]">
              Our Products
            </h2>
            <p className="mt-1 text-sm text-[#927d73]">
              {filteredProducts.length} products available
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-[#eadbd5] bg-white px-4 py-3 sm:w-64">
              <Search size={17} className="text-[#a88b80]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#eadbd5] bg-white px-4 py-3">
              <SlidersHorizontal size={17} className="text-[#a88b80]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="default">Sort: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-5 py-2.5 text-sm transition ${
              selectedCategory === 'all'
                ? 'bg-[#a66b65] text-white'
                : 'border border-[#eadbd5] bg-white text-[#725d55] hover:bg-[#f5e9e5]'
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                String(selectedCategory) === String(category.id)
                  ? 'bg-[#a66b65] text-white'
                  : 'border border-[#eadbd5] bg-white text-[#725d55] hover:bg-[#f5e9e5]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-20 text-center text-[#806b63]">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-red-600">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#49352f]">
              No products found
            </p>
            <p className="mt-2 text-sm text-[#927d73]">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#f0e5df] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  to={`/products/${product.id}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-[#f7efeb]"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#b89b90]">
                      <ShoppingBag size={42} />
                    </div>
                  )}
                </Link>

                <div className="p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-[#a66b65]">
                    {product.category_name || 'Bloom & Grace'}
                  </p>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-serif text-lg text-[#49352f] hover:text-[#a66b65]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-lg font-semibold text-[#49352f]">
                      ₹{Number(product.price).toFixed(2)}
                    </span>

                    {product.original_price &&
                      Number(product.original_price) > Number(product.price) && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{Number(product.original_price).toFixed(2)}
                        </span>
                      )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.stock) <= 0}
                    className="mt-5 w-full rounded-full bg-[#a66b65] px-4 py-3 text-sm text-white transition hover:bg-[#87534e] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {Number(product.stock) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Shop;
