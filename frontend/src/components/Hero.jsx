
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
    <section className="relative overflow-hidden bg-[#f8eee9]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#efd6d0]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#e7d8c5]/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1"
        >
          {hero.subtitle && (
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a36e69]">
              <Sparkles size={16} />
              {hero.subtitle}
            </p>
          )}

          <h1 className="max-w-2xl font-serif text-5xl leading-[1.12] tracking-tight text-[#49352f] sm:text-6xl md:text-6xl lg:text-7xl">
            {hero.heading}

            {hero.highlighted_text && (
              <span className="mt-2 block font-serif italic text-[#b77979]">
                {hero.highlighted_text}
              </span>
            )}
          </h1>

          {hero.description && (
            <p className="mt-7 max-w-lg text-sm leading-8 text-[#806d63] md:text-base">
              {hero.description}
            </p>
          )}

          {hero.button_text && (
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to={buttonUrl}
                className="group inline-flex items-center gap-4 rounded-full bg-[#754b43] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#754b43]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#9c6963]"
              >
                {hero.button_text}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/categories"
                className="text-sm font-medium text-[#754b43] underline decoration-[#d9b9ae] underline-offset-8 transition hover:text-[#b77979]"
              >
                Explore Collection
              </Link>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-8 border-t border-[#e6d4cc] pt-7">
            <div>
              <p className="font-serif text-2xl text-[#754b43]">Beautiful</p>
              <p className="mt-1 text-xs tracking-wide text-[#94786d]">
                Floral Collections
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#754b43]">Elegant</p>
              <p className="mt-1 text-xs tracking-wide text-[#94786d]">
                Everyday Accessories
              </p>
            </div>
          </div>
        </motion.div>

        {hero.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative order-1 mx-auto w-full max-w-xl md:order-2"
          >
            <div className="absolute -inset-3 rounded-t-[48%] rounded-b-[2rem] border border-[#d9b9ae] md:-inset-5" />

            <div className="relative overflow-hidden rounded-t-[48%] rounded-b-[2rem] bg-[#eadbd2] shadow-2xl shadow-[#754b43]/15">
              <img
                src={hero.image}
                alt={hero.heading}
                className="h-[340px] w-full object-cover sm:h-[430px] md:h-[520px]"
              />
            </div>

            <div className="absolute -bottom-5 -left-2 rounded-2xl border border-[#eee0d8] bg-white/95 px-5 py-4 shadow-xl backdrop-blur sm:-left-8">
              <p className="font-serif text-lg text-[#754b43]">
                Bloom with Grace
              </p>
              <p className="mt-1 text-xs text-[#94786d]">
                Beauty in every little detail
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

export default Hero;
