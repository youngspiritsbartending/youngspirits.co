import { useEffect, useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { supabase, Addon } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition, getOrganicTransitionClass } from '../hooks/useOrganicTransition';
import { useThemeColors } from '../hooks/useThemeColors';
import { useColors } from '../hooks/useColors';

export default function Addons() {
  const { isFireflyMode, toggleFireflyMode, tokens } = useTheme();
  const { cardBgClass, cardBorderClass } = useThemeColors();
  const colors = useColors();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedAddons, addAddon, removeAddon } = useCart();
  const { getTransitionClass } = useOrganicTransition('addons', { baseDelay: 0.1, staggerDelay: 0.08 });

  useEffect(() => {
    async function fetchAddons() {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching addons:', error);
      } else {
        setAddons(data || []);
      }
      setLoading(false);
    }

    fetchAddons();
  }, []);

  if (loading) {
    return null;
  }

  const isSelected = (addonId: string) => selectedAddons.some(a => a.id === addonId);

  const handleToggle = (addon: Addon) => {
    if (isSelected(addon.id)) {
      removeAddon(addon.id);
    } else {
      addAddon(addon);
    }
  };

  return (
    <section id="addons" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <button
              onClick={toggleFireflyMode}
              className="cursor-pointer transition-transform hover:scale-110 duration-300"
              aria-label="Toggle firefly mode"
            >
              <Sparkles className="w-6 h-6 text-[#d4af37] mx-4" />
            </button>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>Enhancements</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            Elevate your experience with our curated selection of premium add-ons
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {addons.map((addon, idx) => {
            const selected = isSelected(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => handleToggle(addon)}
                className={`relative p-6 border-2 transition-all frosted-glass ${tokens.transitions.colorChange} text-left group ${
                  selected
                    ? 'border-[#d4af37] shadow-lg'
                    : `${cardBgClass} ${cardBorderClass} hover:border-[#d4af37]/50 hover:shadow-md`
                }`}
                style={selected ? { backgroundColor: 'rgba(212, 175, 55, 0.15)' } : undefined}
              >
                <div className="absolute top-3 right-3">
                  <div className={`w-6 h-6 flex items-center justify-center border-2 transition-all duration-300 ${
                    selected
                      ? 'border-[#d4af37] bg-[#d4af37] text-[#2c2416]'
                      : 'border-[#d4af37] text-[#d4af37]'
                  }`}>
                    {selected ? (
                      <span className="text-sm font-bold">✓</span>
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </div>
                </div>

                <div className="pr-8">
                  <h3 className={`text-base font-medium mb-2 leading-tight ${getOrganicTransitionClass('addons', idx * 2)}`} style={{ color: colors.text.primary }}>{addon.name}</h3>
                  <p className={`text-xs mb-3 line-clamp-2 ${getOrganicTransitionClass('addons', idx * 2 + 1)}`} style={{ color: colors.text.secondary }}>{addon.description}</p>
                  <div className="text-lg font-light text-[#d4af37]">
                    ${addon.price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
