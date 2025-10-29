import { ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { useOrganicTransition, getOrganicTransitionClass } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

export default function CartSummary() {
  const { selectedPackage, selectedAddons, removeAddon, getTotal, isCartExpanded, toggleCart, setIsCartExpanded, isCartCollapsed, setIsCartCollapsed } = useCart();
  const { isFireflyMode } = useTheme();
  const colors = useColors();
  const [hasPassedYourEvent, setHasPassedYourEvent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { getTransitionClass } = useOrganicTransition('cart-summary');

  const hasItems = selectedPackage || selectedAddons.length > 0;

  useEffect(() => {
    if (!hasItems) {
      setIsCartExpanded(false);
    }
  }, [hasItems, setIsCartExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      const yourEventSection = document.getElementById('your-event');
      if (yourEventSection) {
        const rect = yourEventSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setHasPassedYourEvent(true);
          setIsVisible(false);
        } else {
          setHasPassedYourEvent(false);
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasItems]);

  if (!hasItems) {
    return null;
  }

  if (isCartExpanded) {
    return null;
  }

  const itemCount = (selectedPackage ? 1 : 0) + selectedAddons.length;
  const hasNoPackage = !selectedPackage && selectedAddons.length > 0;

  const handleChevronClick = () => {
    setIsCartCollapsed(!isCartCollapsed);
  };

  return (
    <div className={`fixed bottom-8 right-8 border-2 border-[#d4af37] shadow-2xl max-w-sm w-full mx-4 z-50 transition-all ${getTransitionClass(0)} ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`} style={{ backgroundColor: colors.backgrounds.card }}>
      {hasNoPackage && !isCartCollapsed && (
        <div className="bg-amber-50 border-b-2 border-amber-200 px-6 py-3 animate-fade-in">
          <p className="text-xs text-amber-800 font-medium text-center">
            ⚠️ No base package selected - enhancements only
          </p>
        </div>
      )}
      <button
        onClick={handleChevronClick}
        className="w-full px-6 py-4 flex items-center justify-between transition-colors hover:opacity-90"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
            <div className="absolute -top-2 -right-2 bg-[#d4af37] text-[#2c2416] text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {itemCount}
            </div>
          </div>
          <span className={`text-lg font-light tracking-wider ${getTransitionClass(1)}`} style={{ color: colors.text.primary }}>YOUR CART</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-light ${getTransitionClass(2)}`} style={{ color: colors.text.primary }}>${getTotal().toLocaleString()}</span>
          {isCartCollapsed ? (
            <ChevronUp className={`w-5 h-5 ${getTransitionClass(3)}`} style={{ color: colors.text.secondary }} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${getTransitionClass(3)}`} style={{ color: colors.text.secondary }} />
          )}
        </div>
      </button>

      {!isCartCollapsed && (
      <div className="px-6 pb-6">
        <div className={`border-t-2 pt-4 mb-4 ${getTransitionClass(4)}`} style={{ borderColor: colors.borders.secondary }}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedPackage && (
              <>
                <div className="text-xs tracking-wider text-[#d4af37] uppercase mb-2 font-medium">Base Package</div>
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 p-3 border-l-4 border-[#d4af37] mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-sm font-medium ${getTransitionClass(5)}`} style={{ color: colors.text.primary }}>{selectedPackage.name}</div>
                      <div className={`text-xs capitalize mt-1 ${getTransitionClass(6)}`} style={{ color: colors.text.secondary }}>{selectedPackage.tier} Package</div>
                    </div>
                    <div className={`text-sm font-light ${getTransitionClass(7)}`} style={{ color: colors.text.primary }}>${selectedPackage.price.toLocaleString()}</div>
                  </div>
                </div>
              </>
            )}

            {selectedAddons.length > 0 && (
              <>
                <div className={`text-xs tracking-wider uppercase mb-2 font-medium ${getTransitionClass(8)}`} style={{ color: colors.text.secondary }}>Enhancements</div>
                {selectedAddons.map((addon, idx) => {
                  return (
                  <div key={addon.id} className={`p-3 border-l-2 ${getOrganicTransitionClass(`cart-addon-${addon.id}`, 0)}`} style={{ backgroundColor: colors.backgrounds.cardAlt, borderColor: colors.borders.secondary }}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className={`text-sm ${getOrganicTransitionClass(`cart-addon-${addon.id}`, 1)}`} style={{ color: colors.text.primary }}>{addon.name}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-sm font-light ${getOrganicTransitionClass(`cart-addon-${addon.id}`, 2)}`} style={{ color: colors.text.primary }}>${addon.price}</div>
                        <button
                          onClick={() => removeAddon(addon.id)}
                          className="hover:text-[#d4af37] transition-colors"
                          style={{ color: colors.text.secondary }}
                          aria-label="Remove addon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );})}
              </>
            )}
          </div>
        </div>

        <button
          onClick={toggleCart}
          className="block w-full bg-[#d4af37] text-[#2c2416] text-center py-3 text-sm tracking-wider font-medium hover:bg-[#c4a037] transition-all duration-300 mb-2"
        >
          VIEW FULL CART
        </button>
        <p className={`text-xs text-center italic ${getTransitionClass(9)}`} style={{ color: colors.text.secondary }}>
          Click to expand or scroll to cart section
        </p>
      </div>
      )}
    </div>
  );
}
