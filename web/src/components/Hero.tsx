import { Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

interface HeroProps {
  onBookNow: () => void;
  onRatingClick: () => void;
}

export default function Hero({ onBookNow, onRatingClick }: HeroProps) {
  const { isFireflyMode, toggleFireflyMode } = useTheme();
  const { getTransitionClass } = useOrganicTransition('hero');
  const colors = useColors();
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-bartender-pouring-a-cocktail-4257-large.mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <button
              onClick={toggleFireflyMode}
              className="cursor-pointer transition-transform hover:scale-110 duration-300"
              aria-label="Toggle firefly mode"
            >
              <Sparkles className="w-8 h-8 text-[#d4af37] mx-4" />
            </button>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h1 className={`text-7xl md:text-9xl font-light tracking-wide mb-8 ${getTransitionClass(1)}`} style={{ color: colors.text.primary }}>
            Young Spirits
          </h1>
          <div className="flex items-center justify-center mt-10">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <span className={`text-sm tracking-[0.3em] mx-6 font-light ${getTransitionClass(2)}`} style={{ color: colors.text.secondary }}>PRIVATE BARTENDING</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
        </div>

        <p className={`text-2xl md:text-3xl mb-3 font-light italic animate-fade-in-delay-1 ${getTransitionClass(3)}`} style={{ color: colors.text.tertiary }}>
          Los Angeles
        </p>

        <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2 ${getTransitionClass(4)}`} style={{ color: colors.text.secondary }}>
          Elevate your celebration with craft cocktails, refined service, and unforgettable moments
        </p>

        <button
          onClick={onBookNow}
          className={`group relative px-12 py-4 text-base font-medium tracking-wider bg-transparent border-2 transition-all duration-500 transform hover:scale-105 animate-fade-in-delay-3 ${getTransitionClass(5)}`}
          style={{ color: colors.text.primary, borderColor: colors.accents.gold }}
        >
          <span className="relative z-10">LET'S PARTY</span>
        </button>

        <div className="mt-20 flex justify-center gap-16 animate-fade-in-delay-4">
          <div className="text-center">
            <div className="text-2xl font-light text-[#d4af37] mb-1">$1M</div>
            <div className={`text-xs tracking-wider uppercase ${getTransitionClass(6)}`} style={{ color: colors.text.secondary }}>Insured</div>
          </div>
          <button
            onClick={onRatingClick}
            className="text-center hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="text-3xl font-light text-[#d4af37] mb-1 group-hover:text-[#c4a037]">5.0</div>
            <div className={`text-xs tracking-wider uppercase ${getTransitionClass(7)}`} style={{ color: colors.text.secondary }}>Rating</div>
          </button>
          <div className="text-center">
            <div className="text-2xl font-light text-[#d4af37] mb-1">10+</div>
            <div className={`text-xs tracking-wider uppercase ${getTransitionClass(8)}`} style={{ color: colors.text.secondary }}>Years</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <div className="w-5 h-8 border border-[#d4af37]/50 rounded-full flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-[#d4af37]/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
