import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Menu, X, MapPin, Instagram, MessageCircle, Download, ArrowRight, Phone, Mail } from 'lucide-react';
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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Assets
const LOGO_URL = "https://customer-assets.emergentagent.com/job_hatha-path/artifacts/7j1ruiak_Untitled_Artwork-4.png";
const VIDEO_URL = "https://customer-assets.emergentagent.com/job_hatha-path/artifacts/of2tnp3r_1-.mp4";

// Typewriter Hook
const useTypewriter = (text, speed = 50) => {
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

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Practice', href: '#practices' },
    { name: 'Teacher', href: '#intention' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-sand-100/95 backdrop-blur-md shadow-sm' : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Enlarged for visibility */}
          <a href="/" className="flex items-center" data-testid="logo">
            <img 
              src={LOGO_URL} 
              alt="Hatha Path" 
              className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
              style={{ filter: isScrolled ? 'brightness(0)' : 'brightness(0) invert(1)' }}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link text-sm font-body ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta-400 transition-colors`}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              data-testid="nav-explore-btn"
            >
              Explore
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-charcoal' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu absolute top-20 left-0 right-0 border-t border-sand-200" data-testid="mobile-menu">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-charcoal hover:text-terracotta-500 py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-terracotta-500 text-white text-center py-3 rounded-full font-medium mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  const quote = "Yoga is a technology to go beyond all compulsions, and access the divinity present in every human being.";
  const { displayText, isComplete } = useTypewriter(quote, 80); // Slower typing speed

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
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content - Text only, no logo */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 animate-fade-in drop-shadow-lg" data-testid="hero-title">
          Hatha Path
        </h1>
        
        <p className="font-display text-lg md:text-xl text-white/90 italic mb-10 delay-200 animate-fade-in" data-testid="hero-subtitle">
          Classical Hatha Yoga in its authentic form
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center delay-400 animate-fade-in">
          <a
            href="#practices"
            className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 btn-animate"
            data-testid="hero-cta-explore"
          >
            Explore Practices
          </a>
          <a
            href="#about"
            className="bg-transparent border border-white text-white hover:bg-white hover:text-charcoal px-8 py-3.5 rounded-full font-medium transition-all duration-300"
            data-testid="hero-cta-learn"
          >
            Learn More
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
          <div className="md:col-span-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIweW9nYSUyMG5hdHVyZSUyMHNlcmVuZSUyMGF0bW9zcGhlcmV8ZW58MHx8fHwxNzczNDIyMjAzfDA&ixlib=rb-4.1.0&q=85"
                alt="Yoga practice in nature"
                className="rounded-2xl shadow-2xl image-tilt"
                style={{ transform: 'rotate(2deg)' }}
                data-testid="about-image"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sage-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-7">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6" data-testid="about-title">
              The Path of Hatha Yoga
            </h2>
            <p className="text-charcoal/70 text-base md:text-lg leading-relaxed mb-6" data-testid="about-description">
              Hatha Yoga is the science of using the body to prepare the system for
              higher dimensions of energy. It is not just exercise; it is a profound
              process of aligning the inner human system with the cosmic geometry.
            </p>
            <p className="text-charcoal/70 text-base md:text-lg leading-relaxed mb-8">
              Through authentic practices, we focus on establishing a deep balance
              between body, mind, and energy, allowing life to happen with effortless
              ease and joy.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              <div data-testid="stat-authentic">
                <p className="font-display text-3xl md:text-4xl text-terracotta-500 mb-1">100%</p>
                <p className="text-sm uppercase tracking-widest text-charcoal/60 font-medium">Authentic Lineage</p>
              </div>
              <div data-testid="stat-holistic">
                <p className="font-display text-3xl md:text-4xl text-sage-500 mb-1">Holistic</p>
                <p className="text-sm uppercase tracking-widest text-charcoal/60 font-medium">System Alignment</p>
              </div>
            </div>
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
      id: 'yogasanas',
      title: 'Yogasanas',
      description: 'A set of 36 powerful postures to align the system and recalibrate energy towards a higher state of consciousness.',
      image: 'https://images.unsplash.com/photo-1758274529488-de77fa2e7773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxtZWRpdGF0aW9uJTIweW9nYSUyMG5hdHVyZSUyMHNlcmVuZSUyMGF0bW9zcGhlcmV8ZW58MHx8fHwxNzczNDIyMjAzfDA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: 'surya-kriya',
      title: 'Surya Kriya',
      description: 'A potent 21-step process that connects you with the source of energy within the sun, balancing physical and mental states.',
      image: 'https://images.unsplash.com/photo-1660171470455-44b319313750?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcG9zZXMlMjBoYXRoYSUyMHlvZ2ElMjBzdXJ5YSUyMGtyaXlhJTIwYW5nYW1hcmRhbmF8ZW58MHx8fHwxNzczNDIyMjAyfDA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: 'angamardana',
      title: 'Angamardana',
      description: 'Mastery over the limbs. A series of 31 processes to invigorate the body and reach a peak of physical fitness and mental clarity.',
      image: 'https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHx5b2dhJTIwcG9zZXMlMjBoYXRoYSUyMHlvZ2ElMjBzdXJ5YSUyMGtyaXlhJTIwYW5nYW1hcmRhbmF8ZW58MHx8fHwxNzczNDIyMjAyfDA&ixlib=rb-4.1.0&q=85',
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
            Sacred tools for transformation, taught precisely as they have been for thousands of years.
          </p>
        </div>

        {/* Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practices.map((practice, index) => (
            <div
              key={practice.id}
              className="practice-card bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`practice-card-${practice.id}`}
            >
              <div className="practice-image-container">
                <img
                  src={practice.image}
                  alt={practice.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-charcoal mb-3">{practice.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{practice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Intention Section
const IntentionSection = ({ settings, programs }) => {
  return (
    <section id="intention" className="py-24 md:py-32 bg-sand-100" data-testid="intention-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Teacher Image */}
          <div className="md:col-span-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1762950887957-78d2cc56d88c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB5b2dhJTIwdGVhY2hlciUyMHBvcnRyYWl0JTIwc2VyZW5lJTIwc3Bpcml0dWFsfGVufDB8fHx8MTc3MzQyMjIwMnww&ixlib=rb-4.1.0&q=85"
                alt="Yoga Teacher"
                className="teacher-portrait w-full grayscale hover:grayscale-0 transition-all duration-500"
                data-testid="teacher-image"
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6" data-testid="intention-title">
              The Intention
            </h2>
            <blockquote className="text-charcoal/80 text-base md:text-lg leading-relaxed mb-8 italic border-l-4 border-terracotta-500 pl-6">
              "My endeavor is to bring the purity of classical yoga to those seeking a deeper transformation
              beyond physical stretching. The goal is to offer these tools in their absolute pristine form."
            </blockquote>

            {/* Location Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3" data-testid="location-current">
                <MapPin className="w-5 h-5 text-terracotta-500" />
                <span className="text-charcoal/70">Currently teaching in <strong>{settings?.location || 'Pune'}</strong>, Maharashtra.</span>
              </div>
              {programs && programs.length > 0 && (
                <div className="flex items-center gap-3" data-testid="upcoming-programs">
                  <ArrowRight className="w-5 h-5 text-sage-500" />
                  <span className="text-charcoal/70">
                    Upcoming sessions in <strong>{programs[0]?.location}</strong>. {programs[0]?.date}
                  </span>
                </div>
              )}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300"
              data-testid="register-btn"
            >
              Register for a Session
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
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
      // Simulate download - in production, this would be a real PDF URL
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'HathaPath-Brochure.pdf';
      // For demo purposes, we'll just show a success message
      setBrochureOpen(false);
      setBrochureName('');
      setBrochureEmail('');
    } catch (error) {
      toast.error('Failed to process download. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4" data-testid="contact-title">
            Learn or Get in Touch
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg">
            We would love to hear from you. Start your journey today.
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

          {/* Quick Contact & Brochure */}
          <div className="space-y-6">
            <div className="contact-card rounded-2xl p-6">
              <h3 className="font-display text-xl text-charcoal mb-4" data-testid="quick-contact-title">Quick Contact</h3>
              <p className="text-charcoal/60 text-sm mb-6">
                Prefer direct communication? Reach via WhatsApp or follow our journey on Instagram for daily inspiration.
              </p>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl mb-3 transition-colors group"
                data-testid="whatsapp-link"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700">Message on WhatsApp</p>
                    <p className="text-xs text-green-600">Get a response in 24 hours</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Instagram */}
              <a
                href={`https://instagram.com/${settings?.instagram || 'hatha_path'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-pink-50 hover:bg-pink-100 rounded-xl mb-3 transition-colors group"
                data-testid="instagram-link"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium text-pink-700">Follow on Instagram</p>
                    <p className="text-xs text-pink-600">@{settings?.instagram || 'hatha_path'}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-600 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Location */}
              <div className="flex items-start gap-3 p-4 bg-sand-50 rounded-xl" data-testid="location-info">
                <MapPin className="w-5 h-5 text-charcoal/60 mt-0.5" />
                <div>
                  <p className="font-medium text-charcoal">Location</p>
                  <p className="text-sm text-charcoal/60">{settings?.location || 'Pune, Maharashtra, India'}</p>
                  <p className="text-sm text-charcoal/60">{settings?.location_detail || 'Isha Yoga Center'}</p>
                </div>
              </div>
            </div>

            {/* Brochure Download */}
            <div className="contact-card rounded-2xl p-6">
              <h3 className="font-display text-xl text-charcoal mb-3">Download Brochure</h3>
              <p className="text-charcoal/60 text-sm mb-4">
                Get detailed information about our programs, schedules, and pricing.
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
        <DialogContent className="sm:max-w-md" data-testid="brochure-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Download Brochure</DialogTitle>
            <DialogDescription>
              Enter your name to download our detailed program brochure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Your Name"
              value={brochureName}
              onChange={(e) => setBrochureName(e.target.value)}
              className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
              data-testid="brochure-name-input"
            />
            <Input
              type="email"
              placeholder="Email (Optional)"
              value={brochureEmail}
              onChange={(e) => setBrochureEmail(e.target.value)}
              className="bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
              data-testid="brochure-email-input"
            />
            <Button
              onClick={handleBrochureDownload}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
              data-testid="brochure-submit-btn"
            >
              <Download className="w-4 h-4" />
              Download Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer-gradient py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo - Enlarged for visibility */}
          <div className="flex items-center">
            <img 
              src={LOGO_URL} 
              alt="Hatha Path" 
              className="h-14 md:h-16 w-auto object-contain"
              style={{ filter: 'brightness(0.3)' }}
              data-testid="footer-logo"
            />
          </div>

          {/* Tagline */}
          <p className="text-charcoal/60 text-sm italic">
            Classical Hatha Yoga in its authentic form
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="https://instagram.com/hatha_path" target="_blank" rel="noopener noreferrer" className="text-charcoal/60 hover:text-terracotta-500 transition-colors" data-testid="footer-instagram">
              Instagram
            </a>
            <a href="https://youtube.com/@hathapath" target="_blank" rel="noopener noreferrer" className="text-charcoal/60 hover:text-terracotta-500 transition-colors" data-testid="footer-youtube">
              YouTube
            </a>
            <a href="#" className="text-charcoal/60 hover:text-terracotta-500 transition-colors" data-testid="footer-privacy">
              Privacy
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-sand-200 text-center">
          <p className="text-charcoal/50 text-sm">
            © {new Date().getFullYear()} Hatha Path. Made with dedication to the path.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [settings, setSettings] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, programsRes] = await Promise.all([
          axios.get(`${API}/settings`),
          axios.get(`${API}/programs/active`),
        ]);
        setSettings(settingsRes.data);
        setPrograms(programsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-sand-100" data-testid="landing-page">
      <Header />
      <HeroSection />
      <AboutSection />
      <PracticesSection />
      <IntentionSection settings={settings} programs={programs} />
      <ContactSection settings={settings} />
      <Footer />
    </div>
  );
};

export default LandingPage;
