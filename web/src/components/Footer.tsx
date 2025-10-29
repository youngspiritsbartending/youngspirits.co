import { Sparkles, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useColors } from '../hooks/useColors';
import { useOrganicTransition } from '../hooks/useOrganicTransition';

export default function Footer() {
  const { isFireflyMode } = useTheme();
  const colors = useColors();
  const { getTransitionClass } = useOrganicTransition('footer');

  return (
    <footer className={`py-16 border-t border-[#d4af37]/30 ${getTransitionClass(0)}`} style={{ backgroundColor: isFireflyMode ? '#0f1230' : '#3d3226', color: colors.text.primary }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#d4af37]" />
              <h3 className={`text-2xl font-light ${getTransitionClass(1)}`} style={{ color: colors.text.primary }}>Young Spirits</h3>
            </div>
            <p className={`mb-6 leading-relaxed text-sm ${getTransitionClass(2)}`} style={{ color: colors.text.secondary }}>
              Los Angeles' premier mobile bartending service, bringing craft cocktails and refined service to your celebrations.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#d4af37]/30 hover:bg-[#d4af37] hover:border-[#d4af37] flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#d4af37]/30 hover:bg-[#d4af37] hover:border-[#d4af37] flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-light mb-6 tracking-wider ${getTransitionClass(3)}`} style={{ color: colors.text.primary }}>Contact</h4>
            <div className="space-y-4">
              <a
                href="mailto:hello@youngspirits.co"
                className={`flex items-center gap-3 hover:text-[#d4af37] transition-colors text-sm ${getTransitionClass(4)}`}
                style={{ color: colors.text.secondary }}
              >
                <Mail className="w-4 h-4" />
                hello@youngspirits.co
              </a>
              <a
                href="tel:+15551234567"
                className={`flex items-center gap-3 hover:text-[#d4af37] transition-colors text-sm ${getTransitionClass(4)}`}
                style={{ color: colors.text.secondary }}
              >
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </a>
              <div className={`flex items-center gap-3 text-sm ${getTransitionClass(7)}`} style={{ color: colors.text.secondary }}>
                <MapPin className="w-4 h-4" />
                Los Angeles, CA
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-light mb-6 tracking-wider ${getTransitionClass(8)}`} style={{ color: colors.text.primary }}>Hours</h4>
            <div className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
              <p>Monday – Friday</p>
              <p className="mb-3">9:00 AM – 6:00 PM</p>
              <p>Saturday – Sunday</p>
              <p className="mb-3">10:00 AM – 4:00 PM</p>
              <p className="text-[#d4af37] mt-4 italic">Events: Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d4af37]/30 pt-8 text-center">
          <p className={`text-xs tracking-wider ${getTransitionClass(9)}`} style={{ color: colors.text.secondary }}>
            &copy; {new Date().getFullYear()} YOUNG SPIRITS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
