import { CartProvider } from './contexts/CartContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Hero from './components/Hero';
import ParallaxBackground from './components/ParallaxBackground';
import FireflyParticles from './components/FireflyParticles';
import GrassLayers from './components/GrassLayers';
import ServicesShowcase from './components/ServicesShowcase';
import Reviews from './components/Reviews';
import Packages from './components/Packages';
import Addons from './components/Addons';
import Testimonials from './components/Testimonials';
import ExpandedCart from './components/ExpandedCart';
import YourEvent from './components/YourEvent';
import ContactForm from './components/ContactForm';
import CartSummary from './components/CartSummary';
import Footer from './components/Footer';

function AppContent() {
  const { isFireflyMode } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={isFireflyMode ? 'firefly-mode' : 'light-mode'}>
      <ParallaxBackground />
      <GrassLayers />
      <FireflyParticles />
      <div className="relative z-10">
        <Hero
          onBookNow={() => scrollToSection('packages')}
          onRatingClick={() => scrollToSection('reviews')}
        />
        <ServicesShowcase />
        <Reviews />
        <Packages />
        <Addons />
        <Testimonials />
        <ExpandedCart />
        <YourEvent />
        <ContactForm />
        <Footer />
        <CartSummary />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
