
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';

function Hero() {
  const { websiteData, loading } = useWebsite();

  const hero = websiteData?.hero;

 if (loading || !hero) return null;
  const buttonUrl = hero.button_url || '/shop';

  return (
    <section className="overflow-hidden bg-[#f4e8e1]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {hero.subtitle && (
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#a36e69]">
              <Sparkles size={15} />
              {hero.subtitle}
            </p>
          )}

          <h1 className="max-w-xl font-serif text-5xl leading-tight md:text-7xl">
            {hero.heading}

            {hero.highlighted_text && (
              <span className="block italic text-[#b77979]">
                {hero.highlighted_text}
              </span>
            )}
          </h1>

          {hero.description && (
            <p className="mt-6 max-w-md leading-7 text-[#806d63]">
              {hero.description}
            </p>
          )}

          {hero.button_text && (
            <Link
              to={buttonUrl}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#754b43] px-8 py-4 text-sm text-white transition hover:bg-[#9c6963]"
            >
              {hero.button_text}
              <ArrowRight size={17} />
            </Link>
          )}
        </motion.div>

        {hero.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src={hero.image}
              alt={hero.heading}
              className="h-[340px] w-full max-w-lg rounded-t-[48%] rounded-b-3xl object-cover shadow-xl md:h-[470px]"
            />
          </motion.div>
        )}

      </div>
    </section>
  );
}

export default Hero;
