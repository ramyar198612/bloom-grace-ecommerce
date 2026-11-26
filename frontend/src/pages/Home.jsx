
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWebsite } from '../context/WebsiteContext';

import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

function Home() {
  const { websiteData } = useWebsite();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load products and categories
  useEffect(() => {
    async function loadStore() {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          api.get('/products/'),
          api.get('/categories/'),
        ]);

        const productData = productResponse.data;
        const categoryData = categoryResponse.data;

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.results || []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.results || []
        );
      } catch (err) {
        setError(
          'Unable to load products. Please check whether the backend server is running.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        String(product.category) === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  // Get active homepage sections in admin-defined order
  const homeSections = useMemo(() => {
    return [...(websiteData?.home_sections || [])].sort(
      (a, b) => a.order - b.order
    );
  }, [websiteData]);

  // Add product to cart (temporary local state)
  function handleAddToCart(product) {
    setCart((previousCart) => [...previousCart, product]);
    alert(`${product.name} added to cart!`);
  }

  return (
    <main className="min-h-screen bg-[#fffaf6] text-[#49352f]">

      {/* Hero Section */}
      <Hero />

      {homeSections.map((section) => {

        // Categories Section
        if (section.section_type === 'CATEGORIES') {
          return (
            <CategorySection
              key={section.id}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          );
        }

        // Featured Products Section
        if (section.section_type === 'FEATURED_PRODUCTS') {
          return (
            <ProductSection
              key={section.id}
              products={filteredProducts}
              loading={loading}
              error={error}
              search={search}
              onSearchChange={setSearch}
              onAddToCart={handleAddToCart}
            />
          );
        }

        // Promotional Banner Section
        if (section.section_type === 'PROMOTIONAL_BANNER') {
          return (
            <section
              key={section.id}
              className="mx-auto max-w-7xl px-6 py-16"
            >
              <div className="grid overflow-hidden rounded-3xl bg-[#f4e8e1] md:grid-cols-2">

                <div className="flex flex-col items-start justify-center p-8 md:p-14">

                  {section.subtitle && (
                    <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#a36e69]">
                      {section.subtitle}
                    </p>
                  )}

                  <h2 className="font-serif text-3xl leading-tight md:text-5xl">
                    {section.title}
                  </h2>

                  {section.description && (
                    <p className="mt-5 max-w-lg leading-7 text-[#806d63]">
                      {section.description}
                    </p>
                  )}

                  {section.button_text && (
                    <Link
                      to={section.button_url || '/shop'}
                      className="mt-8 inline-flex items-center rounded-full bg-[#754b43] px-8 py-4 text-sm text-white transition hover:bg-[#9c6963]"
                    >
                      {section.button_text}
                    </Link>
                  )}

                </div>

                {section.image && (
                  <div className="min-h-[280px]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="h-full min-h-[280px] w-full object-cover"
                    />
                  </div>
                )}

              </div>
            </section>
          );
        }

        // Testimonials Section
        if (section.section_type === 'TESTIMONIALS') {
          return (
            <section
              key={section.id}
              className="bg-[#fffaf6] px-6 py-16"
            >
              <div className="mx-auto max-w-7xl">

                <div className="mb-12 text-center">

                  {section.subtitle && (
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#a36e69]">
                      {section.subtitle}
                    </p>
                  )}

                  <h2 className="font-serif text-3xl md:text-4xl">
                    {section.title}
                  </h2>

                  {section.description && (
                    <p className="mt-4 text-[#806d63]">
                      {section.description}
                    </p>
                  )}

                </div>

                <div className="grid gap-8 md:grid-cols-3">

                  {(websiteData?.testimonials || []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#eee2d9] bg-white p-7 text-center shadow-sm"
                    >

                      {item.customer_image ? (
                        <img
                          src={item.customer_image}
                          alt={item.customer_name}
                          className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f4e8e1] font-serif text-2xl text-[#a36e69]">
                          {item.customer_name?.charAt(0)}
                        </div>
                      )}

                      <p className="mb-3 text-lg text-[#b77979]">
                        {'★'.repeat(Number(item.rating) || 0)}
                      </p>

                      <p className="leading-7 text-[#806d63]">
                        "{item.message}"
                      </p>

                      <h3 className="mt-5 font-semibold text-[#49352f]">
                        {item.customer_name}
                      </h3>

                    </div>
                  ))}

                </div>

                {(!websiteData?.testimonials ||
                  websiteData.testimonials.length === 0) && (
                  <p className="text-center text-[#806d63]">
                    No testimonials available yet.
                  </p>
                )}

              </div>
            </section>
          );
        }

        return null;
      })}

    </main>
  );
}

export default Home;
