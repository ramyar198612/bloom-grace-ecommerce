
import { motion } from 'framer-motion';
import { Flower2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';

function CategorySection({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  const { websiteData, loading } = useWebsite();

  const section = websiteData?.home_sections?.find(
    (item) => item.section_type === 'CATEGORIES'
  );

  if (loading || !section) return null;

  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendUrl}${image}`;
  };

  return (
    <section
      id="categories"
      className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">

        <div className="mb-5 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e5df] text-[#a36e69]">
            <Flower2 size={23} />
          </span>
        </div>

        {section.subtitle && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a36e69]">
            {section.subtitle}
          </p>
        )}

        <h2 className="font-serif text-3xl leading-tight text-[#49352f] md:text-5xl">
          {section.title}
        </h2>

        {section.description && (
          <p className="mt-5 text-sm leading-8 text-[#806d63] md:text-base">
            {section.description}
          </p>
        )}

        <div className="mx-auto mt-7 h-px w-20 bg-[#c99b8e]" />
      </div>

      {section.image && (
        <div className="mb-12 overflow-hidden rounded-[2rem]">
          <img
            src={getImageUrl(section.image)}
            alt={section.title}
            className="h-48 w-full object-cover transition duration-700 hover:scale-105 md:h-72"
          />
        </div>
      )}

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onSelectCategory('all')}
          className={`rounded-full border px-7 py-3 text-sm font-medium transition duration-300 ${
            selectedCategory === 'all'
              ? 'border-[#754b43] bg-[#754b43] text-white shadow-md'
              : 'border-[#e8d8cf] bg-white text-[#754b43] hover:border-[#b77979]'
          }`}
        >
          {section.button_text || 'All Collections'}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(String(category.id))}
            className={`rounded-full border px-7 py-3 text-sm font-medium transition duration-300 ${
              selectedCategory === String(category.id)
                ? 'border-[#754b43] bg-[#754b43] text-white shadow-md'
                : 'border-[#e8d8cf] bg-white text-[#754b43] hover:border-[#b77979]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {categories.map((category, index) => {
          const imageUrl = getImageUrl(category.image);

          return (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(String(category.id))}
              whileHover={{ y: -7 }}
              className="group text-left"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-[1.5rem] ${
                  selectedCategory === String(category.id)
                    ? 'ring-2 ring-[#a36e69] ring-offset-4'
                    : ''
                } bg-[#f3e8e2]`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Flower2
                      size={58}
                      strokeWidth={1}
                      className="text-[#c49a8d]"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#38251f]/65 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-lg text-white md:text-2xl">
                    {category.name}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-xs text-white/90">
                    Explore Collection
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}

      </div>

      {section.button_url && (
        <div className="mt-12 text-center">
          <Link
            to={section.button_url}
            className="inline-flex items-center gap-3 rounded-full border border-[#754b43] px-8 py-3 text-sm font-medium text-[#754b43] transition hover:bg-[#754b43] hover:text-white"
          >
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}

export default CategorySection;
