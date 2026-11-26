
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
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

  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20">

      {section.image && (
        <img
          src={section.image}
          alt={section.title}
          className="mb-8 h-56 w-full rounded-2xl object-cover"
        />
      )}

      <div className="mb-10 text-center">
        <h2 className="mt-3 font-serif text-4xl">
          {section.title}
        </h2>

        {section.subtitle && (
          <p className="mt-3 text-sm text-[#806d63]">
            {section.subtitle}
          </p>
        )}

        {section.description && (
          <p className="mt-3 text-sm text-[#806d63]">
            {section.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">

        {section.button_text && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition ${
              selectedCategory === 'all'
                ? 'border-[#754b43] bg-[#754b43] text-white'
                : 'border-[#e8d8cf] bg-white hover:border-[#b77979]'
            }`}
          >
            <Flower2 size={16} />
            {section.button_text}
          </motion.button>
        )}

        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectCategory(String(category.id))}
            className={`rounded-full border px-6 py-3 text-sm transition ${
              selectedCategory === String(category.id)
                ? 'border-[#754b43] bg-[#754b43] text-white'
                : 'border-[#e8d8cf] bg-white hover:border-[#b77979]'
            }`}
          >
            {category.name}
          </motion.button>
        ))}

      </div>

      {section.button_text && section.button_url && (
        <div className="mt-8 text-center">
          <Link
            to={section.button_url}
            className="inline-flex rounded-full bg-[#754b43] px-7 py-3 text-sm text-white transition hover:bg-[#9c6963]"
          >
            {section.button_text}
          </Link>
        </div>
      )}

    </section>
  );
}

export default CategorySection;
