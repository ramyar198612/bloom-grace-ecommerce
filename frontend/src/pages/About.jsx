
import { useWebsite } from '../context/WebsiteContext';

function About() {
  const { websiteData, loading } = useWebsite();
  const about = websiteData?.about;

  if (loading) {
    return (
      <main className="min-h-screen py-20 text-center text-[#806b60]">
        Loading...
      </main>
    );
  }

  if (!about) {
    return (
      <main className="min-h-screen px-5 py-20 text-center">
        <h1 className="font-serif text-4xl text-[#49352f]">
          About information is not available.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf6]">
      <section className="mx-auto max-w-7xl px-5 py-20">

        <div className="mx-auto mb-14 max-w-3xl text-center">
          {about.subtitle && (
            <p className="text-xs tracking-[0.3em] text-[#b77979]">
              {about.subtitle}
            </p>
          )}

          <h1 className="mt-3 font-serif text-4xl font-bold text-[#49352f] md:text-5xl">
            {about.heading}
          </h1>

          <p className="mt-6 whitespace-pre-line leading-8 text-[#806b60]">
            {about.description}
          </p>
        </div>

        {(about.image_one || about.image_two) && (
          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {about.image_one && (
              <img
                src={about.image_one}
                alt={about.heading}
                className="h-80 w-full rounded-2xl object-cover"
              />
            )}

            {about.image_two && (
              <img
                src={about.image_two}
                alt={about.heading}
                className="h-80 w-full rounded-2xl object-cover"
              />
            )}
          </div>
        )}

        {(about.mission || about.vision) && (
          <div className="grid gap-8 md:grid-cols-2">

            {about.mission && (
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="mb-4 font-serif text-2xl text-[#49352f]">
                  Our Mission
                </h2>
                <p className="whitespace-pre-line leading-8 text-[#806b60]">
                  {about.mission}
                </p>
              </div>
            )}

            {about.vision && (
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="mb-4 font-serif text-2xl text-[#49352f]">
                  Our Vision
                </h2>
                <p className="whitespace-pre-line leading-8 text-[#806b60]">
                  {about.vision}
                </p>
              </div>
            )}

          </div>
        )}

      </section>
    </main>
  );
}

export default About;
