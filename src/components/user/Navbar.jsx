import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaBuilding, FaMapMarkerAlt, FaNewspaper, FaPhone, FaFileAlt } from 'react-icons/fa';
import './scrollbar-hide.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuTimeout = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false); // tutup menu mobile jika perlu
    }
  };

  const menuItems = [
    { title: 'Beranda', id: 'beranda' },
    { title: 'Fasilitas', id: 'destinasi' },
    { title: 'Galeri', id: 'galeri' },
    { title: 'Ulasan', id: 'ulasan' },
    { title: 'Tentang', id: 'tentang' },
    { title: 'Lainnya', path: '/lainnya' },
  ];

  const submenuItems = [
    { title: 'Destinasi', scrollId: 'tentang' },
    { title: 'Lokasi', scrollId: 'tentang' },
    { title: 'Artikel', scrollId: 'artikel' },
    { title: 'Kontak', scrollId: 'footer' },
    { title: 'Kebijakan & Ketentuan', scrollId: 'footer' },
  ];

  return (
    <nav className="bg-black/30 backdrop-blur-sm text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg sm:text-xl font-raleway font-semibold text-white">
              Wisata Dayeuhmanggung
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-end space-x-4">
            {menuItems.map((item) =>
              item.title !== 'Lainnya' ? (
                <button
                  key={item.title}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-raleway font-medium bg-transparent border-none outline-none cursor-pointer"
                  style={{ background: 'none' }}
                  type="button"
                >
                  {item.title}
                </button>
              ) : (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => {
                    clearTimeout(submenuTimeout.current);
                    setSubmenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    submenuTimeout.current = setTimeout(() => setSubmenuOpen(false), 250);
                  }}
                >
                  <button
                    className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-raleway font-medium flex items-center bg-transparent border-none outline-none cursor-pointer"
                    type="button"
                  >
                    {item.title}
                  </button>
                  {submenuOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-auto min-w-[12rem] bg-white/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ease-out animate-fade-slide-down">
                      {submenuItems.map((sub) =>
                        <button
                          key={sub.title}
                          onClick={() => {
                            scrollToSection(sub.scrollId);
                            setSubmenuOpen(false);
                            setTimeout(() => {
                              setIsOpen(false);
                            }, 300);
                          }}
                          className="block px-5 py-3 text-gray-800 hover:bg-gray-100 hover:text-primary font-raleway rounded-lg transition-colors duration-200 w-full text-left bg-transparent border-none outline-none cursor-pointer"
                          type="button"
                        >
                          {sub.title}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          {/* Login Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="bg-white border border-gray-700 text-black px-4 py-2 rounded-xl text-base font-raleway font-medium shadow-md hover:bg-gray-100 transition ml-4"
            >
              Login admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) =>
              item.title !== 'Lainnya' ? (
                <button
                  key={item.title}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-gray-300 block px-4 py-3 rounded-md text-base font-raleway font-medium w-full text-left bg-transparent border-none outline-none cursor-pointer"
                  type="button"
                >
                  {item.title}
                </button>
              ) : (
                <div key={item.title}>
                  <button
                    className="text-white hover:text-gray-300 block px-4 py-3 rounded-md text-base font-raleway font-medium w-full text-left bg-transparent border-none outline-none cursor-pointer"
                    onClick={() => setSubmenuOpen((prev) => !prev)}
                    type="button"
                  >
                    {item.title}
                  </button>
                  {submenuOpen && (
                    <div className="w-full mt-2 animate-fade-slide-down bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {submenuItems.map((sub) =>
                        <button
                          key={sub.title}
                          onClick={() => {
                            scrollToSection(sub.scrollId);
                            setSubmenuOpen(false);
                            setTimeout(() => {
                              setIsOpen(false);
                            }, 300);
                          }}
                          className="block px-5 py-3 text-gray-800 hover:bg-gray-100 hover:text-primary font-raleway transition-colors duration-200 text-base w-full text-left bg-transparent border-none outline-none cursor-pointer border-b last:border-b-0 border-gray-100"
                          type="button"
                        >
                          {sub.title}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
            {/* Tombol login admin di mobile disembunyikan */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
