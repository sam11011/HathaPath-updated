import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Menu, X, MapPin, Download, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Assets
const LOGO_URL = "https://customer-assets.emergentagent.com/job_hatha-path/artifacts/7j1ruiak_Untitled_Artwork-4.png";
const VIDEO_URL = "https://customer-assets.emergentagent.com/job_hatha-path/artifacts/of2tnp3r_1-.mp4";
const SADHGURU_IMAGE = "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80";

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

// Typewriter Hook - Very Slow
const useTypewriter = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Track page visit
const trackVisit = async () => {
  try {
    await axios.post(`${API}/analytics/visit`);
  } catch (e) {
    // Silent fail
  }
};

// Slide-out Menu Component
const SlideMenu = ({ isOpen, onClose }) => {
  const [practicesOpen, setPracticesOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/', type: 'link' },
    { name: 'About Us', href: '#about', type: 'anchor' },
    { name: 'Workshops', href: '/workshops', type: 'link' },
    { name: 'Practices', href: '#practices', type: 'submenu' },
    { name: 'FAQ', href: '#faq', type: 'anchor' },
    { name: 'Contact Us', href: '#contact', type: 'anchor' },
  ];

  const practicesList = [
    { name: 'Surya Kriya', href: '#surya-kriya' },
    { name: 'Yogasanas', href: '#yogasanas' },
    { name: 'Angamardana', href: '#angamardana' },
    { name: 'Bhuta Shuddhi', href: '#bhuta-shuddhi' },
    { name: 'Wellness Modules', href: '#wellness' },
    { name: 'Corporate / Private Sessions', href: '#contact' },
    { name: 'Yoga for Children', href: '#contact' },
  ];

  const handleClick = (item) => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Slide Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-[#4A5D52] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="slide-menu"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
          data-testid="close-menu-btn"
        >
          <X size={28} strokeWidth={1} />
        </button>

        {/* Menu Items */}
        <nav className="pt-24 px-8">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.type === 'submenu' ? (
                <div>
                  <button
                    onClick={() => setPracticesOpen(!practicesOpen)}
                    className="w-full flex items-center justify-between py-4 text-white/90 hover:text-white font-display text-2xl italic transition-colors"
                    data-testid="practices-menu-btn"
                  >
                    {item.name}
                    {practicesOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  {practicesOpen && (
                    <div className="pl-4 pb-4 space-y-3">
                      {practicesList.map((practice) => (
                        <a
                          key={practice.name}
                          href={practice.href}
                          onClick={() => handleClick(practice)}
                          className="block text-white/70 hover:text-white text-lg transition-colors"
                        >
                          {practice.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.type === 'link' ? (
                <Link
                  to={item.href}
                  onClick={() => handleClick(item)}
                  className="block py-4 text-white/90 hover:text-white font-display text-2xl italic transition-colors"
                  data-testid={`menu-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => handleClick(item)}
                  className="block py-4 text-white/90 hover:text-white font-display text-2xl italic transition-colors"
                  data-testid={`menu-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Social Icons at bottom */}
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

// Header Component
const Header = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        data-testid="header"
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-sand-100/95 backdrop-blur-md shadow-sm' : 'bg-black/20 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`p-2 transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'}`}
              data-testid="hamburger-btn"
            >
              <Menu size={32} strokeWidth={1.5} />
            </button>

            {/* Logo - Extra Large */}
            <a href="/" className="flex items-center" data-testid="logo">
              <img 
                src={LOGO_URL} 
                alt="Hatha Path" 
                className="h-28 md:h-36 w-auto object-contain"
                style={{ filter: isScrolled ? 'brightness(0)' : 'brightness(0) invert(1)' }}
              />
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isScrolled ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                data-testid="header-whatsapp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a 
                href={`https://instagram.com/${settings?.instagram || 'hatha_path'}`}
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isScrolled ? 'bg-pink-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                data-testid="header-instagram"
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

// Hero Section
const HeroSection = () => {
  const quote = "Yoga is a technology to go beyond all compulsions, and access the divinity present in every human being.";
  const { displayText, isComplete } = useTypewriter(quote, 100);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="hero-video"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-3 animate-fade-in drop-shadow-lg" data-testid="hero-title">
          Hatha Path
        </h1>
        
        <p className="font-body text-lg md:text-xl text-white/90 mb-12 animate-fade-in" data-testid="hero-subtitle">
          Classical Yoga for Peak Physical Fitness & Mental Wellbeing
        </p>

        {/* Typewriter Quote */}
        <div className="min-h-[120px] md:min-h-[100px] mb-10">
          <p className="font-display text-base md:text-lg lg:text-xl text-white/95 italic leading-relaxed" data-testid="hero-quote">
            "{displayText}
            <span className={`typewriter-cursor ${isComplete ? 'opacity-0' : ''}`}>|</span>"
          </p>
          {isComplete && (
            <p className="text-terracotta-400 font-medium mt-3 animate-fade-in" data-testid="quote-author">
              - Sadhguru
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link
            to="/workshops"
            className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300"
            data-testid="hero-cta-workshops"
          >
            View Workshops
          </Link>
          <a
            href="#practices"
            className="bg-transparent border border-white text-white hover:bg-white hover:text-charcoal px-8 py-3.5 rounded-full font-medium transition-all duration-300"
            data-testid="hero-cta-practices"
          >
            Explore Practices
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-sand-100" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Image */}
          <div className="md:col-span-4">
            <img
              src={SADHGURU_IMAGE}
              alt="Meditation"
              className="rounded-lg shadow-xl w-full"
              data-testid="about-image"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6 leading-tight" data-testid="about-title">
              Learn Classical Hatha Yoga from teachers certified by Sadhguru Gurukulam
            </h2>
            
            <div className="w-16 h-0.5 bg-terracotta-500 mb-6"></div>
            
            <p className="text-charcoal/70 text-base md:text-lg leading-relaxed mb-6 font-display italic">
              Surya Kriya, Yogasanas, Pranayama, Bhuta Shuddhi, Bhastrika, Meditations & more
            </p>

            <p className="font-display text-xl md:text-2xl text-sage-600 mb-6 italic">
              Suitable for Beginners | Age group 14+
            </p>

            <a
              href="#contact"
              className="inline-block bg-[#9A8B7A] hover:bg-[#8A7B6A] text-white px-8 py-3 rounded font-medium transition-all duration-300"
              data-testid="kids-batch-btn"
            >
              Separate batches for Kids.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Practices Section
const PracticesSection = () => {
  const practices = [
    {
      id: 'surya-kriya',
      title: 'Surya Kriya',
      description: 'A potent 21-step yogic practice that activates the solar plexus, bringing tremendous physical and mental wellbeing.',
      image: 'https://images.unsplash.com/photo-1660171470455-44b319313750?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: 'yogasanas',
      title: 'Yogasanas',
      description: 'A set of powerful postures to elevate consciousness and stabilize the mind, emotions and energy system.',
      image: 'https://images.unsplash.com/photo-1758274529488-de77fa2e7773?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: 'angamardana',
      title: 'Angamardana',
      description: 'A series of 31 processes to invigorate the body, reaching peak physical fitness and strength.',
      image: 'https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: 'bhuta-shuddhi',
      title: 'Bhuta Shuddhi',
      description: 'The process of cleansing the five elements within the system, bringing harmony to body and mind.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
    {
      id: 'wellness',
      title: 'Wellness Modules',
      description: 'Specialized programs for managing Diabetes, Obesity, and other lifestyle conditions through yoga.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
    },
  ];

  return (
    <section id="practices" className="py-24 md:py-32 bg-white" data-testid="practices-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4" data-testid="practices-title">
            Our Practices
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg max-w-2xl mx-auto">
            Classical Hatha Yoga practices designed by Sadhguru, taught in their authentic form.
          </p>
        </div>

        {/* Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((practice) => (
            <div
              key={practice.id}
              id={practice.id}
              className="group bg-sand-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              data-testid={`practice-card-${practice.id}`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={practice.image}
                  alt={practice.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-charcoal mb-2">{practice.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{practice.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate & Children - Link to Contact */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="#contact"
            className="block p-6 bg-sage-500/10 rounded-lg border border-sage-500/20 hover:bg-sage-500/20 transition-colors"
            data-testid="corporate-link"
          >
            <h3 className="font-display text-xl text-charcoal mb-2">Corporate / Private Sessions</h3>
            <p className="text-charcoal/60 text-sm">Customized yoga programs for corporate wellness and private groups. Contact us for details.</p>
          </a>
          <a 
            href="#contact"
            className="block p-6 bg-terracotta-500/10 rounded-lg border border-terracotta-500/20 hover:bg-terracotta-500/20 transition-colors"
            data-testid="children-link"
          >
            <h3 className="font-display text-xl text-charcoal mb-2">Yoga for Children</h3>
            <p className="text-charcoal/60 text-sm">Age-appropriate yoga practices for children. Contact us for batch timings.</p>
          </a>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      question: "I am a beginner. Can I learn these practices?",
      answer: "Yes. You do not require any previous experience in Yoga. We have classes and workshops for all levels."
    },
    {
      question: "What is the difference between workshops and everyday sessions?",
      answer: "We teach the practices with the tiniest details in a workshop. Once you've learned them, you do them daily, refining your postures and receiving individual corrections and modifications in guided classes in the presence of a teacher."
    },
    {
      question: "Why Classical Hatha Yoga?",
      answer: "Classical Hatha Yoga sets itself apart with its authentic lineage and meticulous teaching in a focused environment, emphasizing quality practices. It upholds classical traditions, adheres to punctuality, and avoids distractions, maintaining a dedicated space for transformative, detail-oriented learning. Its uniqueness lies in a structured sequence tailored to individual needs, ensuring a profound and purposeful yogic experience. Rooted in the profound wisdom of Sadhguru, the founder of Isha Foundation, it goes beyond physical postures, addressing the inner dimensions of one's being."
    },
    {
      question: "Is Inner Engineering mandatory to learn Hatha Yoga?",
      answer: "No. You can start with any of the Classical Hatha Yoga practices — Upa Yoga, Surya Kriya, Angamardana, Yogasanas, Surya Shakti, Bhuta Shuddhi, or Mantra Yoga."
    }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-sand-100" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg border border-sand-200 px-6"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left font-display text-lg text-charcoal py-5 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-charcoal/70 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = ({ settings }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [brochureName, setBrochureName] = useState('');
  const [brochureEmail, setBrochureEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully!');
      setFormData({ first_name: '', last_name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleBrochureDownload = async () => {
    if (!brochureName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    try {
      await axios.post(`${API}/brochure/download`, { name: brochureName, email: brochureEmail });
      toast.success('Thank you! Your brochure is downloading...');
      
      const link = document.createElement('a');
      link.href = `${API}/brochure/file`;
      link.download = 'HathaPath-Brochure.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setBrochureOpen(false);
      setBrochureName('');
      setBrochureEmail('');
    } catch (error) {
      toast.error('Brochure not available yet. Please try again later.');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            Contact Us
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg">
            Start your journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
                  required
                  data-testid="input-first-name"
                />
                <Input
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
                  required
                  data-testid="input-last-name"
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
                required
                data-testid="input-email"
              />
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg min-h-[120px]"
                required
                data-testid="input-message"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 rounded-full font-medium"
                data-testid="submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Quick Contact */}
          <div className="space-y-6">
            <div className="bg-sand-50 rounded-2xl p-6 border border-sand-200">
              <h3 className="font-display text-xl text-charcoal mb-6">Quick Contact</h3>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl mb-3 transition-colors"
                data-testid="whatsapp-link"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-700">WhatsApp</p>
                  <p className="text-sm text-green-600">{settings?.whatsapp || '+91 98765 43210'}</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={`https://instagram.com/${settings?.instagram || 'hatha_path'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl mb-3 transition-colors"
                data-testid="instagram-link"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                  <InstagramIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-pink-700">Instagram</p>
                  <p className="text-sm text-pink-600">@{settings?.instagram || 'hatha_path'}</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 bg-sand-100 rounded-xl">
                <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">Location</p>
                  <p className="text-sm text-charcoal/60">{settings?.location || 'Pune, Maharashtra, India'}</p>
                </div>
              </div>
            </div>

            {/* Brochure */}
            <div className="bg-sand-50 rounded-2xl p-6 border border-sand-200">
              <h3 className="font-display text-xl text-charcoal mb-3">Download Brochure</h3>
              <p className="text-charcoal/60 text-sm mb-4">
                Get detailed information about our programs.
              </p>
              <Button
                onClick={() => setBrochureOpen(true)}
                className="w-full bg-sage-500 hover:bg-sage-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
                data-testid="download-brochure-btn"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brochure Dialog */}
      <Dialog open={brochureOpen} onOpenChange={setBrochureOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Download Brochure</DialogTitle>
            <DialogDescription>
              Enter your name to download our program brochure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Your Name"
              value={brochureName}
              onChange={(e) => setBrochureName(e.target.value)}
              className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
            />
            <Input
              type="email"
              placeholder="Email (Optional)"
              value={brochureEmail}
              onChange={(e) => setBrochureEmail(e.target.value)}
              className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
            />
            <Button
              onClick={handleBrochureDownload}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 rounded-full font-medium"
            >
              Download Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Footer
const Footer = ({ settings }) => {
  return (
    <footer className="bg-sand-200 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <img 
            src={LOGO_URL} 
            alt="Hatha Path" 
            className="h-28 md:h-32 w-auto object-contain"
            style={{ filter: 'brightness(0.3)' }}
          />

          {/* Tagline */}
          <p className="text-charcoal/60 text-sm italic font-display text-center">
            Classical Yoga for Peak Physical Fitness & Mental Wellbeing
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
            >
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </a>
            <a 
              href={`https://instagram.com/${settings?.instagram || 'hatha_path'}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 rounded-full flex items-center justify-center transition-opacity"
            >
              <InstagramIcon className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sand-300 text-center">
          <p className="text-charcoal/50 text-sm">
            © {new Date().getFullYear()} Hatha Path. Made with dedication to the path.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page
const LandingPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    trackVisit();
    const fetchData = async () => {
      try {
        const settingsRes = await axios.get(`${API}/settings`);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-sand-100" data-testid="landing-page">
      <Header settings={settings} />
      <HeroSection />
      <AboutSection />
      <PracticesSection />
      <FAQSection />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </div>
  );
};

export default LandingPage;
