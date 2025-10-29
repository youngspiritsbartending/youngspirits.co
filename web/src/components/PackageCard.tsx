import { useState } from 'react';
import { Star, Info, X } from 'lucide-react';
import { ServicePackage } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useThemeColors } from '../hooks/useThemeColors';
import { useColors } from '../hooks/useColors';

interface PackageCardProps {
  package: ServicePackage;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const { selectedPackage, setSelectedPackage } = useCart();
  const { isFireflyMode, tokens } = useTheme();
  const { cardBgClass, cardBorderClass } = useThemeColors();
  const colors = useColors();
  const isSelected = selectedPackage?.id === pkg.id;
  const [showInfo, setShowInfo] = useState(false);
  const { getTransitionClass } = useOrganicTransition(`package-${pkg.id}`, { baseDelay: 0.3, staggerDelay: 0.06 });

  const packageImages: { [key: string]: string } = {
    'essential': 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800',
    'signature': 'https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=800',
    'premium': 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
    'luxury': 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=800'
  };

  const imageUrl = packageImages[pkg.tier] || packageImages['signature'];

  return (
    <>
      <div
        className={`relative border-2 overflow-hidden group transition-colors frosted-glass ${tokens.transitions.colorChange} ${cardBgClass} ${
          isSelected ? 'border-[#d4af37] shadow-2xl' : `${cardBorderClass} hover:border-[#d4af37]/50`
        } ${pkg.popular ? 'ring-2 ring-[#d4af37]/30' : ''}`}
      >
        {pkg.popular && (
          <div className="absolute top-4 right-4 bg-[#d4af37] text-[#2c2416] px-3 py-1 text-xs tracking-wider font-medium flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-current" />
            POPULAR
          </div>
        )}

        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2c2416]/90 via-[#2c2416]/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-4xl font-light text-white mb-2">{pkg.name}</h3>
            <div className="text-2xl font-light text-[#d4af37]">
              ${pkg.price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-2 mb-6">
            {pkg.features.slice(0, 3).map((feature, index) => (
              <li key={index} className={`text-sm leading-relaxed border-l-2 border-[#d4af37]/30 pl-3 ${getTransitionClass(index)}`} style={{ color: colors.text.tertiary }}>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowInfo(true)}
            className={`flex items-center gap-2 text-sm hover:text-[#d4af37] mb-6 ${getTransitionClass(4)}`}
            style={{ color: colors.text.secondary }}
          >
            <Info className="w-4 h-4" />
            View all included services
          </button>

          <button
            onClick={() => setSelectedPackage(isSelected ? null : pkg)}
            className={`w-full py-3 text-sm tracking-wider font-medium transition-all duration-300 ${
              isSelected
                ? 'bg-[#d4af37] text-[#2c2416]'
                : isFireflyMode
                ? 'bg-[#3a3a3a] text-[#f5f3ed] border-2 border-[#d4af37] hover:bg-[#d4af37] hover:text-[#2c2416]'
                : 'bg-transparent text-[#2c2416] border-2 border-[#d4af37] hover:bg-[#d4af37]'
            }`}
          >
            {isSelected ? 'SELECTED' : 'SELECT PACKAGE'}
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
          <div className={`border-2 border-[#d4af37] max-w-2xl w-full overflow-y-auto transition-colors frosted-glass ${tokens.transitions.colorChange} ${cardBgClass}`} style={{ maxHeight: 'min(85vh, fit-content)' }} onClick={(e) => e.stopPropagation()}>
            <div className={`sticky top-0 border-b-2 p-6 flex justify-between items-start z-10 transition-colors ${tokens.transitions.colorChange} ${cardBgClass} ${cardBorderClass}`}>
              <div>
                <h3 className={`text-3xl font-light mb-2 ${getTransitionClass(5)}`} style={{ color: colors.text.primary }}>{pkg.name}</h3>
                <p className={getTransitionClass(6)} style={{ color: colors.text.secondary }}>{pkg.description}</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className={`hover:text-[#d4af37] ${getTransitionClass(7)}`}
                style={{ color: colors.text.secondary }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h4 className={`text-lg tracking-wider mb-4 uppercase ${getTransitionClass(8)}`} style={{ color: colors.text.secondary }}>Included Services</h4>
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className={`leading-relaxed border-l-2 border-[#d4af37]/30 pl-4 ${getTransitionClass(9 + index)}`} style={{ color: colors.text.tertiary }}>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className={`mt-8 pt-6 border-t-2 text-center ${getTransitionClass(20)}`} style={{ borderColor: colors.borders.secondary }}>
                <div className={`text-sm mb-2 tracking-wider ${getTransitionClass(21)}`} style={{ color: colors.text.secondary }}>STARTING AT</div>
                <div className={`text-4xl font-light mb-6 ${getTransitionClass(22)}`} style={{ color: colors.text.primary }}>
                  ${pkg.price.toLocaleString()}
                </div>
                <button
                  onClick={() => {
                    setSelectedPackage(isSelected ? null : pkg);
                    setShowInfo(false);
                  }}
                  className={`px-12 py-3 text-sm tracking-wider font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#2c2416]'
                      : isFireflyMode
                      ? 'bg-[#3a3a3a] text-[#f5f3ed] border-2 border-[#d4af37] hover:bg-[#d4af37] hover:text-[#2c2416]'
                      : 'bg-transparent text-[#2c2416] border-2 border-[#d4af37] hover:bg-[#d4af37]'
                  }`}
                >
                  {isSelected ? 'SELECTED' : 'SELECT PACKAGE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
