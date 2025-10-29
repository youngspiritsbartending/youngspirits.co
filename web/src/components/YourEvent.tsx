import { Calendar, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

export default function YourEvent() {
  const { isFireflyMode } = useTheme();
  const colors = useColors();
  const { selectedPackage, selectedAddons, getTotal } = useCart();
  const { getTransitionClass } = useOrganicTransition('your-event');

  const hasItems = selectedPackage || selectedAddons.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <section id="your-event" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <Calendar className="w-6 h-6 text-[#d4af37] mx-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>Your Event</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            Complete details of your customized celebration package
          </p>
        </div>

        <div className={`border-2 overflow-hidden ${getTransitionClass(2)}`} style={{ backgroundColor: colors.backgrounds.primary, borderColor: colors.borders.secondary }}>
          <div className="bg-gradient-to-r from-[#d4af37] to-[#c4a037] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[#2c2416]" />
                <h3 className="text-2xl font-light text-[#2c2416] tracking-wide">EVENT SUMMARY</h3>
              </div>
              <div className="text-sm text-[#2c2416] tracking-wider">
                DRAFT ESTIMATE
              </div>
            </div>
          </div>

          <div className="p-8">
            {selectedPackage && (
              <div className="mb-8">
                <div className="flex items-start justify-between pb-4 border-b-2 border-[#e5dcc5] mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span className="text-xs tracking-wider uppercase" style={{ color: colors.text.secondary }}>Service Package</span>
                    </div>
                    <h4 className="text-2xl font-light mb-2" style={{ color: colors.text.primary }}>{selectedPackage.name}</h4>
                    <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>{selectedPackage.description}</p>
                    {selectedPackage.features && selectedPackage.features.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs tracking-wider uppercase mb-2" style={{ color: colors.text.secondary }}>Includes:</p>
                        <ul className="space-y-1">
                          {selectedPackage.features.map((feature, index) => (
                            <li key={index} className="text-sm pl-4 border-l-2 border-[#d4af37]/30" style={{ color: colors.text.tertiary }}>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-8">
                    <div className="text-xs mb-1" style={{ color: colors.text.secondary }}>STARTING AT</div>
                    <div className="text-2xl font-light" style={{ color: colors.text.primary }}>${selectedPackage.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedAddons.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-[#e5dcc5]"></div>
                  <span className="text-xs tracking-wider uppercase" style={{ color: colors.text.secondary }}>Enhancements</span>
                  <div className="h-px flex-1 bg-[#e5dcc5]"></div>
                </div>
                <div className="space-y-4">
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} className="flex items-start justify-between py-3 border-b border-[#e5dcc5] last:border-b-0">
                      <div className="flex-1">
                        <h5 className="text-lg font-medium mb-1" style={{ color: colors.text.primary }}>{addon.name}</h5>
                        {addon.description && (
                          <p className="text-sm" style={{ color: colors.text.secondary }}>{addon.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-8">
                        <div className="text-lg font-light" style={{ color: colors.text.primary }}>${addon.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t-4 border-[#d4af37] pt-6 mt-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs mb-2 italic" style={{ color: colors.text.secondary }}>
                    * Final pricing subject to event details, location, and availability
                  </p>
                  <p className="text-xs" style={{ color: colors.text.secondary }}>
                    This is an estimate based on your current selections
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm tracking-wider mb-2 uppercase" style={{ color: colors.text.secondary }}>Estimated Total</div>
                  <div className="text-5xl font-light" style={{ color: colors.text.primary }}>
                    ${getTotal().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-t-2" style={{ backgroundColor: colors.backgrounds.secondary, borderColor: colors.borders.secondary }}>
            <p className="text-center text-sm" style={{ color: colors.text.secondary }}>
              Ready to make it official? Complete the form below to request your formal quote and reserve your date.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
