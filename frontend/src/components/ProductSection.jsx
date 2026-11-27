
import { Search, ArrowRight, Sparkles } from 'lucide-react';
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

  if (websiteLoading || !section) return null;

  return (
    <section
      id="products"
      className="bg-[#fffaf7] px-5 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">

        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">
            {section.subtitle && (
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#a36e69]">
                <Sparkles size={15} />
                {section.subtitle}
              </p>
            )}

            <h2 className="font-serif text-3xl leading-tight text-[#49352f] md:text-5xl">
              {section.title}
            </h2>

            {section.description && (
              <p className="mt-5 max-w-xl text-sm leading-8 text-[#806d63] md:text-base">
                {section.description}
              </p>
            )}

            <div className="mt-6 h-px w-20 bg-[#c99b8e]" />
          </div>

          <div className="flex w-full items-center gap-3 rounded-full border border-[#eadbd2] bg-white px-5 py-4 shadow-sm transition focus-within:border-[#b77979] lg:max-w-sm">
            <Search size={19} className="shrink-0 text-[#a17e70]" />

            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Find your favourite flowers..."
              aria-label="Search products"
              className="w-full bg-transparent text-sm text-[#49352f] outline-none placeholder:text-[#b39c91]"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs font-medium text-[#a36e69] hover:text-[#754b43]"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {loading && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto mb-4 animate-pulse text-[#b77979]" size={30} />
            <p className="text-sm text-[#9b8175]">
              Preparing beautiful collections...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl bg-[#f8eee9] px-5 py-16 text-center">
            <Sparkles className="mx-auto mb-4 text-[#b77979]" size={30} />
            <h3 className="font-serif text-2xl text-[#754b43]">
              No Products Found
            </h3>
            <p className="mt-3 text-sm text-[#806d63]">
              Try another search or select a different category.
            </p>
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="mt-6 rounded-full bg-[#754b43] px-7 py-3 text-sm text-white transition hover:bg-[#9c6963]"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="mt-14 text-center">
            <Link
              to={section.button_url}
              className="group inline-flex items-center gap-3 rounded-full border border-[#754b43] px-9 py-4 text-sm font-medium text-[#754b43] transition duration-300 hover:bg-[#754b43] hover:text-white"
            >
              {section.button_text}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

export default ProductSection;
