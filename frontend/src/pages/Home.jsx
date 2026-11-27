
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import { useCart } from '../context/CartContext';

import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

function Home() {
  const { websiteData } = useWebsite();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategory =
        typeof product.category === 'object'
          ? String(product.category?.id)
          : String(product.category);

      const matchesCategory =
        selectedCategory === 'all' ||
        productCategory === selectedCategory;

      const matchesSearch = (product.name || '')
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const homeSections = useMemo(() => {
    return [...(websiteData?.home_sections || [])].sort(
      (a, b) => a.order - b.order
    );
  }, [websiteData]);

  function handleAddToCart(product) {
    if (Number(product.stock) <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] text-[#49352f]">

      <Hero />

      {homeSections.map((section) => {
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

        if (section.section_type === 'PROMOTIONAL_BANNER') {
          return (
            <section
              key={section.id}
              className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
            >
              <div className="grid overflow-hidden rounded-[2rem] bg-[#f3e5df] shadow-sm md:grid-cols-2">

                <div className="flex flex-col items-start justify-center p-8 md:p-14 lg:p-16">

                  {section.subtitle && (
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#a36e69]">
                      {section.subtitle}
                    </p>
                  )}

                  <h2 className="max-w-xl font-serif text-3xl leading-tight text-[#49352f] md:text-5xl">
                    {section.title}
                  </h2>

                  {section.description && (
                    <p className="mt-6 max-w-lg text-sm leading-8 text-[#806d63] md:text-base">
                      {section.description}
                    </p>
                  )}

                  {section.button_text && (
                    <Link
                      to={section.button_url || '/shop'}
                      className="mt-8 inline-flex items-center rounded-full bg-[#754b43] px-8 py-4 text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#9c6963]"
                    >
                      {section.button_text}
                    </Link>
                  )}

                </div>

                {section.image && (
                  <div className="min-h-[300px] overflow-hidden md:min-h-[450px]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="h-full min-h-[300px] w-full object-cover transition duration-700 hover:scale-105 md:min-h-[450px]"
                    />
                  </div>
                )}

              </div>
            </section>
          );
        }

        if (section.section_type === 'TESTIMONIALS') {
          return (
            <section
              key={section.id}
              className="bg-[#faf1ec] px-5 py-20 md:px-8 md:py-24"
            >
              <div className="mx-auto max-w-7xl">

                <div className="mx-auto mb-14 max-w-2xl text-center">

                  {section.subtitle && (
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a36e69]">
                      {section.subtitle}
                    </p>
                  )}

                  <h2 className="font-serif text-3xl text-[#49352f] md:text-5xl">
                    {section.title}
                  </h2>

                  {section.description && (
                    <p className="mt-5 text-sm leading-8 text-[#806d63] md:text-base">
                      {section.description}
                    </p>
                  )}

                </div>

                <div className="grid gap-6 md:grid-cols-3">

                  {(websiteData?.testimonials || []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-[#eee0d8] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                    >

                      {item.customer_image ? (
                        <img
                          src={item.customer_image}
                          alt={item.customer_name}
                          className="mx-auto mb-5 h-20 w-20 rounded-full object-cover ring-4 ring-[#f8eee9]"
                        />
                      ) : (
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e5df] font-serif text-2xl text-[#a36e69]">
                          {item.customer_name?.charAt(0)}
                        </div>
                      )}

                      <p className="mb-4 text-xl tracking-widest text-[#c18b7c]">
                        {'★'.repeat(Number(item.rating) || 0)}
                      </p>

                      <p className="text-sm leading-8 text-[#806d63]">
                        "{item.message}"
                      </p>

                      <h3 className="mt-6 font-semibold text-[#49352f]">
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
