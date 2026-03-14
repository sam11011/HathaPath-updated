import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, ArrowLeft, Plus, Minus } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_hatha-path/artifacts/7j1ruiak_Untitled_Artwork-4.png";

// Social Icons
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Slide Menu (same as landing page)
const SlideMenu = ({ isOpen, onClose }) => {
  const [practicesOpen, setPracticesOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/', type: 'link' },
    { name: 'About Us', href: '/#about', type: 'link' },
    { name: 'Workshops', href: '/workshops', type: 'link' },
    { name: 'Practices', href: '/#practices', type: 'submenu' },
    { name: 'FAQ', href: '/#faq', type: 'link' },
    { name: 'Contact Us', href: '/#contact', type: 'link' },
  ];

  const practicesList = [
    { name: 'Surya Kriya', href: '/#surya-kriya' },
    { name: 'Yogasanas', href: '/#yogasanas' },
    { name: 'Angamardana', href: '/#angamardana' },
    { name: 'Bhuta Shuddhi', href: '/#bhuta-shuddhi' },
    { name: 'Wellness Modules', href: '/#wellness' },
    { name: 'Corporate / Private Sessions', href: '/#contact' },
    { name: 'Yoga for Children', href: '/#contact' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-[#4A5D52] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
        >
          <X size={28} strokeWidth={1} />
        </button>

        <nav className="pt-24 px-8">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.type === 'submenu' ? (
                <div>
                  <button
                    onClick={() => setPracticesOpen(!practicesOpen)}
                    className="w-full flex items-center justify-between py-4 text-white/90 hover:text-white font-display text-2xl italic transition-colors"
                  >
                    {item.name}
                    {practicesOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  {practicesOpen && (
                    <div className="pl-4 pb-4 space-y-3">
                      {practicesList.map((practice) => (
                        <Link
                          key={practice.name}
                          to={practice.href}
                          onClick={onClose}
                          className="block text-white/70 hover:text-white text-lg transition-colors"
                        >
                          {practice.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="block py-4 text-white/90 hover:text-white font-display text-2xl italic transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 left-8 flex gap-4">
          <a 
            href="https://wa.me/919876543210" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
          </a>
          <a 
            href="https://instagram.com/hatha_path" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <InstagramIcon className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </>
  );
};

// Header
const Header = ({ settings }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-sand-100 border-b border-sand-200" data-testid="workshops-header">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-24">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-charcoal"
              data-testid="hamburger-btn"
            >
              <Menu size={32} strokeWidth={1.5} />
            </button>

            <Link to="/" className="flex items-center">
              <img 
                src={LOGO_URL} 
                alt="Hatha Path" 
                className="h-28 md:h-36 w-auto object-contain"
                style={{ filter: 'brightness(0)' }}
              />
            </Link>

            <div className="flex items-center gap-3">
              <a 
                href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500 text-white rounded-full flex items-center justify-center"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a 
                href={`https://instagram.com/${settings?.instagram || 'hatha_path'}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-pink-500 text-white rounded-full flex items-center justify-center"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

// Workshops Page
const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopsRes, settingsRes] = await Promise.all([
          axios.get(`${API}/workshops`),
          axios.get(`${API}/settings`),
        ]);
        setWorkshops(workshopsRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Default workshops if none from API
  const defaultWorkshops = [
    {
      id: '1',
      title: 'SURYA KRIYA WORKSHOP',
      dates: 'Coming Soon!',
      image: 'https://images.unsplash.com/photo-1660171470455-44b319313750?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: '2',
      title: 'YOGASANAS WORKSHOP',
      dates: 'Coming Soon!',
      image: 'https://images.unsplash.com/photo-1758274529488-de77fa2e7773?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: '3',
      title: 'ANGAMARDANA WORKSHOP',
      dates: 'Coming Soon!',
      image: 'https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: '4',
      title: 'BHUTA SHUDDHI',
      dates: 'Coming Soon!',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
  ];

  const displayWorkshops = workshops.length > 0 ? workshops : defaultWorkshops;

  return (
    <div className="min-h-screen bg-sand-100" data-testid="workshops-page">
      <Header settings={settings} />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Title */}
      <div className="text-center py-16">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal italic" data-testid="workshops-title">
          Upcoming Classical Hatha Yoga Workshops
        </h1>
      </div>

      {/* Workshops Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {isLoading ? (
          <div className="text-center text-charcoal/60">Loading workshops...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-[#D4D4C4] rounded-lg overflow-hidden"
                data-testid={`workshop-card-${workshop.id}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg text-charcoal font-medium mb-2">
                    {workshop.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm">
                    {workshop.dates || workshop.date || 'Coming Soon!'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-charcoal/60 mb-4">Want to register or learn more?</p>
          <a
            href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
            data-testid="workshop-contact-btn"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Contact on WhatsApp
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sand-200 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <Link to="/">
            <img 
              src={LOGO_URL} 
              alt="Hatha Path" 
              className="h-20 w-auto mx-auto object-contain mb-4"
              style={{ filter: 'brightness(0.3)' }}
            />
          </Link>
          <p className="text-charcoal/50 text-sm">
            © {new Date().getFullYear()} Hatha Path
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WorkshopsPage;
