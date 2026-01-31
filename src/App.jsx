import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaWifi, FaParking, FaSwimmingPool, FaBath, FaTv, FaSnowflake,
  FaShieldAlt, FaConciergeBell, FaStar, FaQuoteLeft, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaArrowUp, FaArrowRight, FaArrowLeft,
  FaCheck, FaCalendarAlt, FaUser, FaUsers, FaBed, FaClock,
  FaSmokingBan, FaPaw, FaGlassCheers, FaChild, FaKey, FaVideo,
  FaFireExtinguisher, FaWheelchair, FaLanguage,
  FaUtensils, FaCouch, FaTree, FaMountain, FaHome, FaTimes,
  FaBars, FaExpand, FaFacebookF, FaInstagram, FaWhatsapp,
  FaHeart, FaShower, FaDoorOpen, FaLock, FaThermometerHalf,
  FaInfoCircle, FaChevronRight
} from 'react-icons/fa';
import {
  MdBalcony, MdOutlineKitchen, MdOutlineBathtub, MdSpa,
  MdLocalLaundryService, MdOutlineIron, MdOutlineSecurity,
  MdAccessible, MdSmokeFree
} from 'react-icons/md';
import { BiSolidWasher } from 'react-icons/bi';
import './App.css';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'Q6PV8a3X535BHEswR';
const EMAILJS_SERVICE_ID = 'service_lvrn73e';
const EMAILJS_TEMPLATE_COMPANY = 'template_hy8gdgh';
const EMAILJS_TEMPLATE_CUSTOMER = 'template_io94mzl';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Data
const amenities = [
  { icon: <FaWifi />, title: 'Free WiFi', description: 'High-speed internet available throughout the property' },
  { icon: <FaParking />, title: 'Free Parking', description: 'Secure on-site private parking at no extra cost' },
  { icon: <FaSnowflake />, title: 'Air Conditioning', description: 'Climate control for your comfort in all rooms' },
  { icon: <MdBalcony />, title: 'Private Balcony', description: 'Enjoy scenic views from your private balcony' },
  { icon: <MdSpa />, title: 'Spa Bath', description: 'Luxurious spa bath for ultimate relaxation' },
  { icon: <FaTv />, title: 'Smart TV', description: 'Flat-screen TV with streaming services like Netflix' },
  { icon: <MdOutlineKitchen />, title: 'Full Kitchen', description: 'Fully equipped kitchen with modern appliances' },
  { icon: <FaShieldAlt />, title: '24/7 Security', description: 'Round-the-clock security with CCTV monitoring' },
];

const facilities = {
  bathroom: {
    title: 'Bathroom',
    icon: <FaBath />,
    items: ['Private bathroom', 'Bathtub', 'Shower', 'Spa tub', 'Bidet', 'Hairdryer', 'Free toiletries', 'Bathrobe', 'Slippers', 'Toilet paper']
  },
  kitchen: {
    title: 'Kitchen',
    icon: <MdOutlineKitchen />,
    items: ['Full kitchen', 'Kitchenette', 'Washing machine', 'Refrigerator', 'Microwave', 'Cooking basics']
  },
  media: {
    title: 'Media & Tech',
    icon: <FaTv />,
    items: ['Flat-screen TV', 'Streaming service (Netflix)', 'Smartphone', 'Free WiFi']
  },
  bedroom: {
    title: 'Room Amenities',
    icon: <FaBed />,
    items: ['Air conditioning', 'Heating', 'Soundproof rooms', 'Sofa bed', 'Wardrobe']
  },
  outdoor: {
    title: 'Outdoor & View',
    icon: <FaTree />,
    items: ['Balcony', 'Terrace', 'Garden', 'Scenic view']
  },
  accessibility: {
    title: 'Accessibility',
    icon: <FaWheelchair />,
    items: ['Wheelchair accessible', 'Elevator', 'Lowered sink', 'Raised toilet', 'Toilet with grab rails', 'Visual aids (Braille)', 'Auditory guidance']
  },
  safety: {
    title: 'Safety & Security',
    icon: <FaShieldAlt />,
    items: ['Fire extinguishers', 'CCTV', 'Smoke alarms', 'Security alarm', 'Key card access', '24-hour security', 'Safe']
  }
};

const reviews = [
  {
    name: 'Ahmed Khan',
    location: 'Lahore, Pakistan',
    rating: 5,
    text: 'Absolutely stunning apartment! The view from the balcony was breathtaking, and the amenities exceeded our expectations. The staff was incredibly helpful and made our stay memorable. Will definitely return!',
    date: 'December 2025'
  },
  {
    name: 'Sarah Williams',
    location: 'London, UK',
    rating: 5,
    text: 'What a gem in Islamabad! The apartment was spotlessly clean, modern, and had everything we needed. The location is perfect for exploring the city. Highly recommend Royal Apartments to any traveler!',
    date: 'November 2025'
  },
  {
    name: 'Fatima Zahra',
    location: 'Karachi, Pakistan',
    rating: 5,
    text: 'Perfect family getaway! The kids loved the spacious rooms and the garden area. The kitchen was well-equipped for cooking home meals. The security made us feel safe throughout our stay.',
    date: 'January 2026'
  },
  {
    name: 'Michael Chen',
    location: 'Singapore',
    rating: 5,
    text: 'Business trip turned into a luxury experience! Fast WiFi, comfortable workspace, and the spa bath was perfect after long meetings. The location near the airport was very convenient.',
    date: 'October 2025'
  },
  {
    name: 'Aisha Malik',
    location: 'Islamabad, Pakistan',
    rating: 5,
    text: 'Booked for my parents visiting from abroad and they absolutely loved it! The elevator access was perfect for them, and the 24/7 security gave us peace of mind. Exceptional service!',
    date: 'December 2025'
  },
  {
    name: 'James Rodriguez',
    location: 'New York, USA',
    rating: 5,
    text: 'Exceeded all expectations! The apartment felt like a 5-star hotel but with the comfort of home. The streaming services, modern kitchen, and stunning views made our Pakistan trip unforgettable.',
    date: 'November 2025'
  }
];

const houseRules = [
  { icon: <FaClock />, title: 'Check-in', description: 'Available 24 hours', note: 'Please let us know your arrival time in advance' },
  { icon: <FaDoorOpen />, title: 'Check-out', description: 'Available 24 hours', note: 'Flexible checkout times' },
  { icon: <FaChild />, title: 'Children & Beds', description: 'Children of all ages are welcome', subrules: ['Children 18+ charged as adults', 'Cribs and extra beds not available'] },
  { icon: <FaUser />, title: 'Age Restriction', description: 'No age requirement for check-in', note: '' },
  { icon: <FaSmokingBan />, title: 'Smoking', description: 'Smoking is not allowed', note: 'Designated smoking area available outside' },
  { icon: <FaGlassCheers />, title: 'Parties', description: 'Parties/events are not allowed', note: 'Quiet hours must be respected' },
  { icon: <FaPaw />, title: 'Pets', description: 'Pets are not allowed', note: 'Service animals may be permitted' }
];

const nearbyPlaces = [
  { name: 'Islamabad International Airport', distance: '5.6 mi' },
  { name: 'Shah Faisal Mosque', distance: '16 mi' },
  { name: 'Taxila Museum', distance: '12 mi' },
  { name: 'Ayūb National Park', distance: '14 mi' },
  { name: 'Golra Sharif Railway Museum', distance: '9.3 mi' },
  { name: 'Fatima Jinnah Park', distance: '13 mi' }
];

// Gallery Images (placeholder URLs - replace with actual images)
const galleryImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', title: 'Living Room', category: 'Interior' },
  { id: 2, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', title: 'Modern Kitchen', category: 'Kitchen' },
  { id: 3, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', title: 'Spa Bathroom', category: 'Bathroom' },
  { id: 4, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', title: 'Master Bedroom', category: 'Bedroom' },
  { id: 5, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', title: 'Balcony View', category: 'Outdoor' },
  { id: 6, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', title: 'Garden Area', category: 'Outdoor' }
];

// Components
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="navbar-logo" onClick={() => scrollToSection('hero')}>
          <div className="navbar-logo-icon">R</div>
          <div className="navbar-logo-text">Royal <span>Apartments</span></div>
        </a>
        
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#about" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
          <a href="#amenities" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}>Amenities</a>
          <a href="#gallery" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a>
          <a href="#reviews" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a>
          <a href="#rules" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('rules'); }}>House Rules</a>
          <a href="#location" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>Location</a>
          <button className="btn btn-primary navbar-cta" onClick={() => scrollToSection('booking')}>
            Book Now
          </button>
        </div>
        
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10
  }));

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920" 
          alt="Luxury Apartment" 
          className="hero-bg-image"
        />
        <div className="hero-bg-overlay"></div>
      </div>
      
      <div className="hero-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="hero-particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="container">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="hero-badge" variants={fadeInUp}>
            <span className="hero-badge-dot"></span>
            <span className="hero-badge-text">Premium Accommodation</span>
          </motion.div>
          
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Experience <span className="highlight">Luxury Living</span> in Islamabad
          </motion.h1>
          
          <motion.p className="hero-description" variants={fadeInUp}>
            Discover the perfect blend of comfort and elegance at Royal Apartments. 
            Modern amenities, stunning views, and exceptional service await you.
          </motion.p>
          
          <motion.div className="hero-buttons" variants={fadeInUp}>
            <button className="btn btn-primary" onClick={scrollToBooking}>
              <FaCalendarAlt /> Book Your Stay
            </button>
            <button className="btn btn-secondary" onClick={scrollToAbout}>
              Explore More <FaArrowRight />
            </button>
          </motion.div>
          
          <motion.div className="hero-stats" variants={fadeInUp}>
            <div className="hero-stat">
              <div className="hero-stat-number">4.9</div>
              <div className="hero-stat-label">Guest Rating</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">500+</div>
              <div className="hero-stat-label">Happy Guests</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">24/7</div>
              <div className="hero-stat-label">Support</div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800" 
              alt="Royal Apartments Interior" 
              className="hero-image"
            />
            <div className="hero-image-overlay"></div>
          </div>
          
          <motion.div 
            className="hero-floating-card rating"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="floating-card-icon"><FaStar /></div>
            <div className="floating-card-content">
              <h4>Exceptional</h4>
              <div className="floating-card-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-floating-card location"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="floating-card-icon"><FaMapMarkerAlt /></div>
            <div className="floating-card-content">
              <h4>Faisal Town</h4>
              <p>Islamabad, Pakistan</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <motion.div 
          className="about-images"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="about-image main">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" alt="Apartment Exterior" />
          </div>
          <div className="about-image secondary">
            <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" alt="Modern Kitchen" />
          </div>
          <div className="about-experience-badge">
            <h3>5★</h3>
            <p>Luxury Living</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="about-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="about-subtitle" variants={fadeInUp}>Welcome to Royal Apartments</motion.span>
          <motion.h2 className="about-title" variants={fadeInUp}>
            Comfortable Living in the Heart of Islamabad
          </motion.h2>
          <motion.p className="about-text" variants={fadeInUp}>
            Royal Apartments-One Bed Apartments in Islamabad offers a garden and terrace with free WiFi. 
            The property features an elevator, family rooms, and full-day security. Free on-site private 
            parking is available for all our guests.
          </motion.p>
          <motion.p className="about-text" variants={fadeInUp}>
            Each apartment includes air-conditioning, a kitchenette, balcony, bathrobes, streaming services, 
            spa bath, washing machine, private bathroom, kitchen, sauna, bidet, hairdryer, sofa bed, smartphone, 
            free toiletries, shower, slippers, and TV. Experience modern luxury with all the comforts of home.
          </motion.p>
          
          <motion.div className="about-features" variants={fadeInUp}>
            <div className="about-feature">
              <div className="about-feature-icon"><FaMapMarkerAlt /></div>
              <div>
                <h4>Prime Location</h4>
                <p>5.6 mi from Airport</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon"><FaShieldAlt /></div>
              <div>
                <h4>24/7 Security</h4>
                <p>CCTV & Key Access</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon"><FaWifi /></div>
              <div>
                <h4>Free WiFi</h4>
                <p>High-Speed Internet</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon"><FaParking /></div>
              <div>
                <h4>Free Parking</h4>
                <p>On-site Available</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Amenities() {
  return (
    <section className="amenities section" id="amenities">
      <div className="container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-subtitle">What We Offer</span>
          <h2 className="section-title">Premium Amenities</h2>
          <p className="section-description">
            Experience the finest amenities designed for your comfort and convenience. 
            Every detail has been carefully curated for an exceptional stay.
          </p>
        </motion.div>
        
        <motion.div 
          className="amenities-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {amenities.map((amenity, index) => (
            <motion.div 
              key={index} 
              className="amenity-card"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="amenity-icon">{amenity.icon}</div>
              <h3>{amenity.title}</h3>
              <p>{amenity.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="facilities-section">
          <div className="facilities-header">
            <h3>Complete Facilities</h3>
            <p>Everything you need for a perfect stay</p>
          </div>
          
          <motion.div 
            className="facilities-categories"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {Object.entries(facilities).map(([key, category]) => (
              <motion.div 
                key={key} 
                className="facility-category"
                variants={fadeInUp}
              >
                <h4>{category.icon} {category.title}</h4>
                <div className="facility-list">
                  {category.items.map((item, idx) => (
                    <span key={idx} className="facility-item">
                      <FaCheck /> {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedImage(galleryImages[index]);
  };

  const closeModal = () => setSelectedImage(null);

  const navigate = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = galleryImages.length - 1;
    if (newIndex >= galleryImages.length) newIndex = 0;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-subtitle">Photo Gallery</span>
          <h2 className="section-title">Explore Our Spaces</h2>
          <p className="section-description">
            Take a virtual tour of our beautifully designed apartments and facilities.
          </p>
        </motion.div>
        
        <motion.div 
          className="gallery-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {galleryImages.map((image, index) => (
            <motion.div 
              key={image.id} 
              className="gallery-item"
              variants={scaleIn}
              onClick={() => openModal(index)}
            >
              <img src={image.url} alt={image.title} loading="lazy" />
              <div className="gallery-item-overlay">
                <div className="gallery-item-content">
                  <h4>{image.title}</h4>
                  <p>{image.category}</p>
                </div>
              </div>
              <div className="gallery-view-icon"><FaExpand /></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="gallery-modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="gallery-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
              <button 
                className="gallery-modal-nav prev" 
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </button>
              <img src={selectedImage.url} alt={selectedImage.title} />
              <button 
                className="gallery-modal-nav next" 
                onClick={() => navigate(1)}
              >
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Reviews() {
  return (
    <section className="reviews section" id="reviews">
      <div className="container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-description">
            Read authentic reviews from guests who have experienced Royal Apartments.
          </p>
        </motion.div>
        
        <motion.div 
          className="reviews-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index} 
              className="review-card"
              variants={fadeInUp}
            >
              <div className="review-header">
                <div className="review-avatar">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="review-info">
                  <h4>{review.name}</h4>
                  <p>{review.location}</p>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
              <p className="review-date">{review.date}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HouseRules() {
  return (
    <section className="house-rules section" id="rules">
      <div className="container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-subtitle">Policies</span>
          <h2 className="section-title">House Rules</h2>
          <p className="section-description">
            Please review our house rules to ensure a pleasant stay for everyone.
          </p>
        </motion.div>
        
        <motion.div 
          className="rules-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="rules-header">
            <div>
              <h3><FaHome /> Royal Apartments</h3>
              <p>One Bed Apartments takes special requests – add in the next step!</p>
            </div>
          </div>
          
          <div className="rules-content">
            {houseRules.map((rule, index) => (
              <div key={index} className="rule-item">
                <div className="rule-icon">{rule.icon}</div>
                <div className="rule-content">
                  <h4>{rule.title}</h4>
                  <p>{rule.description}</p>
                  {rule.note && <p style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginTop: '5px' }}>{rule.note}</p>}
                  {rule.subrules && (
                    <ul className="sub-rules">
                      {rule.subrules.map((sub, idx) => (
                        <li key={idx}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="map-section" id="location">
      <div className="map-container">
        <motion.div 
          className="map-info"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3>Our Location</h3>
          
          <div className="map-info-item">
            <div className="map-info-icon"><FaMapMarkerAlt /></div>
            <div className="map-info-content">
              <h4>Address</h4>
              <p>Ginza Tower, C-Block, Main Commercial Area,<br />Phase-I Faisal Town, Islamabad, 44000, Pakistan</p>
            </div>
          </div>
          
          <div className="map-info-item">
            <div className="map-info-icon"><FaPhone /></div>
            <div className="map-info-content">
              <h4>Phone</h4>
              <p><a href="tel:+923215009470">+92-321-5009470</a></p>
            </div>
          </div>
          
          <div className="map-info-item">
            <div className="map-info-icon"><FaEnvelope /></div>
            <div className="map-info-content">
              <h4>Email</h4>
              <p><a href="mailto:royal.apartments.faisal.town@gmail.com">royal.apartments.faisal.town@gmail.com</a></p>
            </div>
          </div>
          
          <div className="map-info-item">
            <div className="map-info-icon"><FaLanguage /></div>
            <div className="map-info-content">
              <h4>Languages Spoken</h4>
              <p>English, Urdu, and Other Local Languages</p>
            </div>
          </div>
          
          <div className="nearby-places">
            <h4>Nearby Attractions</h4>
            <ul>
              {nearbyPlaces.map((place, index) => (
                <li key={index}>
                  {place.name}
                  <span>{place.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        <div className="map-embed">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d830.7156050298894!2d72.879475!3d33.608874!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df992d2f5f5499%3A0x1416d4273d75cd22!2sRoyal%20Apartment!5e0!3m2!1sen!2sis!4v1769800551337!5m2!1sen!2sis" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Apartments Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

function BookingForm() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    // Format dates for better readability
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Prepare template parameters
    const templateParams = {
      from_name: `${data.firstName} ${data.lastName}`,
      from_email: data.email,
      phone: data.phone,
      check_in: formatDate(data.checkIn),
      check_out: formatDate(data.checkOut),
      guests: data.guests,
      room_type: data.roomType.charAt(0).toUpperCase() + data.roomType.slice(1) + ' Apartment',
      special_requests: data.specialRequests || 'None',
    };

    try {
      // Send email to company (booking notification)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_COMPANY,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Send confirmation email to customer
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CUSTOMER,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      showToast('success', 'Booking request submitted successfully! Please check your email for confirmation.');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      showToast('error', 'Failed to submit booking. Please try again or contact us directly at +92-321-5009470');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="booking section" id="booking">
      <div className="container">
        <div className="booking-container">
          <motion.div 
            className="booking-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">Reservations</span>
            <h3>Book Your Perfect Stay</h3>
            <p>
              Experience luxury and comfort at Royal Apartments. Fill out the booking form 
              and we'll get back to you within 24 hours to confirm your reservation.
            </p>
            
            <div className="booking-benefits">
              <div className="booking-benefit">
                <div className="booking-benefit-icon"><FaCheck /></div>
                <span>Best Price Guarantee</span>
              </div>
              <div className="booking-benefit">
                <div className="booking-benefit-icon"><FaShieldAlt /></div>
                <span>Secure Booking</span>
              </div>
              <div className="booking-benefit">
                <div className="booking-benefit-icon"><FaClock /></div>
                <span>24/7 Support</span>
              </div>
              <div className="booking-benefit">
                <div className="booking-benefit-icon"><FaHeart /></div>
                <span>Flexible Cancellation</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="booking-form-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="booking-form-header">
              <h4>Make a Reservation</h4>
              <p>Fill in your details below</p>
            </div>
            
            <form ref={formRef} className="booking-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label><FaUser /> First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="John" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><FaUser /> Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Doe" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="+92 300 1234567" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><FaCalendarAlt /> Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    min={today} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><FaCalendarAlt /> Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    min={today} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><FaUsers /> Number of Guests</label>
                  <select name="guests" required>
                    <option value="">Select guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5+ Guests</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><FaBed /> Room Type</label>
                  <select name="roomType" required>
                    <option value="">Select room</option>
                    <option value="standard">Standard Apartment</option>
                    <option value="deluxe">Deluxe Apartment</option>
                    <option value="premium">Premium Suite</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label><FaInfoCircle /> Special Requests</label>
                <textarea 
                  name="specialRequests" 
                  placeholder="Any special requests or requirements? (e.g., early check-in, dietary needs, accessibility requirements)"
                  rows="4"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary form-submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
              
              <p className="form-note">
                <FaLock /> Your information is secure and will never be shared.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`toast ${toast.type} show`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
            </div>
            <span className="toast-message">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">R</div>
              <div className="footer-logo-text">Royal <span>Apartments</span></div>
            </div>
            <p>
              Experience luxury living at Royal Apartments in Faisal Town, Islamabad. 
              Modern amenities, prime location, and exceptional service for an unforgettable stay.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://wa.me/923215009470" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}><FaChevronRight /> About Us</a></li>
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> Amenities</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}><FaChevronRight /> Gallery</a></li>
              <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}><FaChevronRight /> Reviews</a></li>
              <li><a href="#booking" onClick={(e) => { e.preventDefault(); scrollToSection('booking'); }}><FaChevronRight /> Book Now</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Facilities</h4>
            <ul className="footer-links">
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> Free WiFi</a></li>
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> Free Parking</a></li>
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> 24/7 Security</a></li>
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> Spa & Wellness</a></li>
              <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollToSection('amenities'); }}><FaChevronRight /> Family Rooms</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><FaMapMarkerAlt /></div>
              <p>Ginza Tower, C-Block,<br />Faisal Town, Islamabad</p>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><FaPhone /></div>
              <p><a href="tel:+923215009470">+92-321-5009470</a></p>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><FaEnvelope /></div>
              <p><a href="mailto:royal.apartments.faisal.town@gmail.com">royal.apartments.faisal.town@gmail.com</a></p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Royal Apartments. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </motion.button>
  );
}

function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-content">
        <div className="loading-logo">R</div>
        <div className="loading-spinner"></div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <>
      <AnimatePresence>
        <LoadingScreen />
      </AnimatePresence>
      
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <Navbar />
      
      <main id="main-content">
        <Hero />
        <About />
        <Amenities />
        <Gallery />
        <Reviews />
        <HouseRules />
        <MapSection />
        <BookingForm />
      </main>
      
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
