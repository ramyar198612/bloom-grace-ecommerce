
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useWebsite } from '../context/WebsiteContext';

function ProductSection({
  products = [],
  loading,
  error,
  search,
  onSearchChange,
  onAddToCart,
}) {
  const { websiteData, loading: websiteLoading } = useWebsite();

  const section = websiteData?.home_sections?.find(
    (item) => item.section_type === 'FEATURED_PRODUCTS'
  );

  if (websiteLoading || !section) {
    return null;
  }

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 pb-24">

      {section.image && (
        <img
          src={section.image}
          alt={section.title}
          className="mb-8 h-56 w-full rounded-2xl object-cover"
        />
      )}

      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          {section.subtitle && (
            <p className="text-xs tracking-[0.3em] text-[#b77979]">
              {section.subtitle}
            </p>
          )}

          <h2 className="mt-2 font-serif text-4xl">
            {section.title}
          </h2>

          {section.description && (
            <p className="mt-2 text-sm text-[#806d63]">
              {section.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#eadbd2] bg-white px-4 py-3">
          <Search size={18} className="text-[#a17e70]" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none md:w-52"
          />
        </div>
      </div>

      {loading && (
        <p className="py-12 text-center text-[#9b8175]">
          Loading beautiful products...
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="py-12 text-center text-[#9b8175]">
          No products found. Try another search.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {section.button_text && section.button_url && (
        <div className="mt-10 text-center">
          <Link
            to={section.button_url}
            className="inline-block rounded-full bg-[#754b43] px-8 py-3 text-sm text-white transition hover:bg-[#5d3933]"
          >
            {section.button_text}
          </Link>
        </div>
      )}

    </section>
  );
}

export default ProductSection;
