
import { Flower2, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function Footer() {
  const { websiteData, loading } = useWebsite();

  if (loading) return null;

  const settings = websiteData?.settings;
  const footerLinks = websiteData?.footer_links || [];

  const quickLinks = footerLinks.filter(
    (item) => item.link_type === 'QUICK_LINK'
  );

  const supportLinks = footerLinks.filter(
    (item) => item.link_type === 'SUPPORT'
  );

  return (
    <footer className="bg-[#49352f] text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings.site_name || 'Logo'}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <Flower2 size={30} className="text-[#d5a4a0]" />
            )}

            <h2 className="font-serif text-2xl font-bold">
              {settings?.site_name}
            </h2>
          </div>

          {settings?.tagline && (
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              {settings.tagline}
            </p>
          )}
        </div>

       {/* Quick Links */}
{quickLinks.length > 0 && (
  <div>
    <h3 className="mb-5 font-serif text-xl">
      {settings?.footer_quick_links_heading || 'Quick Links'}
    </h3>

    <ul className="space-y-3 text-sm text-white/65">
      {quickLinks.map((item) => (
        <li key={item.id}>
          <Link to={item.url} className="transition hover:text-white">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}
        {/* Customer Support */}
        {supportLinks.length > 0 && (
          <div>
           <h3 className="mb-5 font-serif text-xl">
  {settings?.footer_support_heading || 'Customer Support'}
</h3>

            <ul className="space-y-3 text-sm text-white/65">
              {supportLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="transition hover:text-white"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-serif text-xl">
  {settings?.footer_contact_heading || 'Contact Us'}
</h3>
          <ul className="space-y-4 text-sm text-white/65">

            {settings?.contact_email && (
              <li className="flex items-center gap-3">
                <Mail size={17} />
                <a href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email}
                </a>
              </li>
            )}

            {settings?.contact_phone && (
              <li className="flex items-center gap-3">
                <Phone size={17} />
                <a href={`tel:${settings.contact_phone}`}>
                  {settings.contact_phone}
                </a>
              </li>
            )}

            {settings?.address && (
              <li className="flex items-center gap-3">
                <MapPin size={17} />
                <span>{settings.address}</span>
              </li>
            )}

            {settings?.instagram_url && (
              <li className="flex items-center gap-3">
                <InstagramIcon />
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              </li>
            )}

            {settings?.facebook_url && (
              <li>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            )}

            {settings?.pinterest_url && (
              <li>
                <a href={settings.pinterest_url} target="_blank" rel="noopener noreferrer">
                  Pinterest
                </a>
              </li>
            )}

          </ul>
        </div>

      </div>

      {/* Copyright */}
      {settings?.copyright_text && (
        <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-white/50">
          {settings.copyright_text}
        </div>
      )}

    </footer>
  );
}

export default Footer;
