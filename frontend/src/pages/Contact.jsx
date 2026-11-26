
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';

function Contact() {
  const { websiteData, loading } = useWebsite();
  const contact = websiteData?.contact;

  if (loading) {
    return (
      <main className="min-h-screen py-20 text-center text-[#806b60]">
        Loading...
      </main>
    );
  }

  if (!contact) {
    return (
      <main className="min-h-screen px-5 py-20 text-center">
        <h1 className="font-serif text-4xl text-[#49352f]">
          Contact information is not available.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf6] px-5 py-20">
      <section className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#49352f] md:text-5xl">
            {contact.heading}
          </h1>

          {contact.description && (
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#806b60]">
              {contact.description}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">

          {contact.email && (
            <div className="flex items-start gap-4 rounded-2xl bg-white p-7 shadow-sm">
              <Mail className="mt-1 text-[#b77979]" size={24} />
              <div>
                <h2 className="font-serif text-xl text-[#49352f]">Email</h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 block text-sm text-[#806b60] hover:text-[#b77979]"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-start gap-4 rounded-2xl bg-white p-7 shadow-sm">
              <Phone className="mt-1 text-[#b77979]" size={24} />
              <div>
                <h2 className="font-serif text-xl text-[#49352f]">Phone</h2>
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-2 block text-sm text-[#806b60] hover:text-[#b77979]"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.address && (
            <div className="flex items-start gap-4 rounded-2xl bg-white p-7 shadow-sm">
              <MapPin className="mt-1 text-[#b77979]" size={24} />
              <div>
                <h2 className="font-serif text-xl text-[#49352f]">Address</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#806b60]">
                  {contact.address}
                </p>
              </div>
            </div>
          )}

          {contact.business_hours && (
            <div className="flex items-start gap-4 rounded-2xl bg-white p-7 shadow-sm">
              <Clock className="mt-1 text-[#b77979]" size={24} />
              <div>
                <h2 className="font-serif text-xl text-[#49352f]">Business Hours</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#806b60]">
                  {contact.business_hours}
                </p>
              </div>
            </div>
          )}

        </div>

        {contact.map_url && (
          <div className="mt-10 text-center">
            <a
              href={contact.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#754b43] px-8 py-3 text-sm text-white transition hover:bg-[#5d3933]"
            >
              View Location <ExternalLink size={16} />
            </a>
          </div>
        )}

      </section>
    </main>
  );
}

export default Contact;
