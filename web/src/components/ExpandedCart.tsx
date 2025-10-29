import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition, getOrganicTransitionClass } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

export default function ExpandedCart() {
  const { selectedPackage, selectedAddons, removeAddon, getTotal, isCartExpanded } = useCart();
  const { isFireflyMode } = useTheme();
  const colors = useColors();
  const { getTransitionClass } = useOrganicTransition('expanded-cart');

  if (!isCartExpanded) {
    return null;
  }

  return (
    <section id="cart" className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <ShoppingCart className="w-6 h-6 text-[#d4af37] mx-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>Your Selection</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            Review your customized package and add-ons
          </p>
        </div>

        <div className={`border-2 p-10 ${getTransitionClass(2)}`} style={{ backgroundColor: colors.backgrounds.primary, borderColor: colors.borders.secondary }}>
          {selectedPackage || selectedAddons.length > 0 ? (
            <>
              <div className="space-y-4 mb-10">
                {selectedPackage && (
                  <div className={`p-6 border-l-4 border-[#d4af37] ${getTransitionClass(3)}`} style={{ backgroundColor: colors.backgrounds.cardAlt }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`text-2xl font-light mb-2 ${getTransitionClass(4)}`} style={{ color: colors.text.primary }}>{selectedPackage.name}</div>
                        <div className={`text-sm capitalize mb-3 ${getTransitionClass(5)}`} style={{ color: colors.text.secondary }}>{selectedPackage.tier} Package</div>
                        {selectedPackage.description && (
                          <p className={`text-sm max-w-2xl ${getTransitionClass(6)}`} style={{ color: colors.text.secondary }}>{selectedPackage.description}</p>
                        )}
                      </div>
                      <div className={`text-2xl font-light ${getTransitionClass(7)}`} style={{ color: colors.text.primary }}>${selectedPackage.price.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {selectedAddons.length > 0 && (
                  <div className={`pt-6 border-t-2 ${getTransitionClass(8)}`} style={{ borderColor: colors.borders.secondary }}>
                    <h3 className={`text-lg tracking-wider mb-4 uppercase ${getTransitionClass(9)}`} style={{ color: colors.text.secondary }}>Add-ons</h3>
                    <div className="space-y-3">
                      {selectedAddons.map((addon, idx) => {
                        return (
                        <div key={addon.id} className={`p-5 ${getOrganicTransitionClass(`expanded-addon-${addon.id}`, 0)}`} style={{ backgroundColor: colors.backgrounds.cardAlt }}>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className={`text-lg mb-1 ${getOrganicTransitionClass(`expanded-addon-${addon.id}`, 1)}`} style={{ color: colors.text.primary }}>{addon.name}</div>
                              {addon.description && (
                                <p className={`text-sm ${getOrganicTransitionClass(`expanded-addon-${addon.id}`, 2)}`} style={{ color: colors.text.secondary }}>{addon.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className={`text-lg font-light ${getOrganicTransitionClass(`expanded-addon-${addon.id}`, 3)}`} style={{ color: colors.text.primary }}>${addon.price}</div>
                              <button
                                onClick={() => removeAddon(addon.id)}
                                className="hover:text-[#d4af37] transition-colors p-2"
                                style={{ color: colors.text.secondary }}
                                aria-label="Remove addon"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );})}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-[#d4af37] pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className={`text-sm tracking-wider mb-1 uppercase ${getTransitionClass(10)}`} style={{ color: colors.text.secondary }}>
                      Estimated Total
                    </div>
                    <div className={`text-5xl font-light ${getTransitionClass(11)}`} style={{ color: colors.text.primary }}>
                      ${getTotal().toLocaleString()}
                    </div>
                    <p className={`text-xs mt-2 italic ${getTransitionClass(12)}`} style={{ color: colors.text.secondary }}>
                      Final pricing subject to event details and availability
                    </p>
                  </div>
                  <div>
                    <a
                      href="#contact"
                      className="inline-block px-10 py-4 text-sm tracking-wider font-medium border-2 border-[#d4af37] hover:bg-[#d4af37] hover:text-[#2c2416] transition-all duration-300"
                      style={{ color: colors.text.primary }}
                    >
                      REQUEST QUOTE
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-[#d4af37] mx-auto mb-4 opacity-50" />
              <p className={`text-xl font-light ${getTransitionClass(13)}`} style={{ color: colors.text.secondary }}>Your cart is empty</p>
              <p className={`text-sm mt-2 ${getTransitionClass(14)}`} style={{ color: colors.text.secondary }}>Start by selecting a package or add-ons above</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
