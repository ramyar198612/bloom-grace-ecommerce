
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2,
  Search,
  ShoppingBag,
  Menu,
  X,
  UserRound,
} from 'lucide-react';

import { useWebsite } from '../context/WebsiteContext';

function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { websiteData, loading } = useWebsite();

  const closeMenu = () => setMenuOpen(false);

  const settings = websiteData?.settings;
  const navigation = websiteData?.navigation || [];

  const announcement =
    settings?.announcement_text ||
    settings?.free_shipping_message;

  const logoUrl = settings?.logo;

  return (
    <>
      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-[#754b43] py-2 text-center text-xs tracking-widest text-white">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-[#eee2d9] bg-[#fffaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          {/* Dynamic Logo and Brand */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">

            {logoUrl ? (
              <img
                src={logoUrl}
                alt={settings?.site_name || 'Website Logo'}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <Flower2 size={30} className="text-[#b77979]" />
            )}

            <div>
              <h1 className="font-serif text-2xl font-bold">
                {settings?.site_name || 'Bloom & Grace'}
              </h1>

              {settings?.tagline && (
                <p className="text-[9px] tracking-[0.3em] text-[#a17e70]">
                  {settings.tagline}
                </p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {!loading && navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="hover:text-[#b77979]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">

            <button type="button" aria-label="Search products">
              <Search size={21} />
            </button>

            <Link to="/my-orders" aria-label="My Orders">
              <UserRound size={21} />
            </Link>

            <Link to="/cart" className="relative" aria-label="Shopping Cart">
              <ShoppingBag size={22} />

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#b77979] text-xs text-white">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-[#eee2d9] bg-[#fffaf6] px-6 py-5 text-sm md:hidden">

            {!loading && navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}

            <Link to="/my-orders" onClick={closeMenu}>
              My Orders
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}

export default Navbar;
