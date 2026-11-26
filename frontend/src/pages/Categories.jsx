
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import api from '../services/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setCategories(data);
      } catch (err) {
        console.error('Category loading error:', err);
        setError('Unable to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <section className="bg-[#f5e9e5] px-6 py-16 text-center">
        <p className="mb-3 text-xs tracking-[0.35em] text-[#a66b65]">
          EXPLORE OUR WORLD
        </p>
        <h1 className="font-serif text-4xl text-[#49352f] md:text-5xl">
          Shop by Category
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806b63]">
          Find something beautiful for every special moment.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {loading ? (
          <p className="py-20 text-center text-[#806b63]">
            Loading categories...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-red-600">{error}</p>
        ) : categories.length === 0 ? (
          <p className="py-20 text-center text-[#806b63]">
            No categories available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="group overflow-hidden rounded-2xl border border-[#f0e5df] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#f7efeb]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#b89b90]">
                      <Flower2 size={55} strokeWidth={1.2} />
                    </div>
                  )}
                </div>

                <div className="p-6 text-center">
                  <h2 className="font-serif text-2xl text-[#49352f]">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-3 text-sm leading-6 text-[#806b63]">
                      {category.description}
                    </p>
                  )}

                  <Link
                    to={`/shop?category=${category.id}`}
                    className="mt-6 inline-block rounded-full border border-[#a66b65] px-7 py-3 text-sm text-[#a66b65] transition hover:bg-[#a66b65] hover:text-white"
                  >
                    Explore Collection
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Categories;
