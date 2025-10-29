import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase, ServicePackage } from '../lib/supabase';
import PackageCard from './PackageCard';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import TimePicker from './TimePicker';
import CustomCalendar from './CustomCalendar';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';
import { useThemeColors } from '../hooks/useThemeColors';

export default function Packages() {
  const { isFireflyMode, toggleFireflyMode, tokens } = useTheme();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { serviceConfig, setServiceConfig } = useCart();
  const { getTransitionClass } = useOrganicTransition('packages', { baseDelay: 0.1, staggerDelay: 0.08 });
  const colors = useColors();
  const { cardBgClass, cardBorderClass } = useThemeColors();

  useEffect(() => {
    async function fetchPackages() {
      const { data, error } = await supabase
        .from('service_packages')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        setPackages(data || []);
      }
      setLoading(false);
    }

    fetchPackages();
  }, []);


  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center ${getTransitionClass(0)}`} style={{ color: colors.text.secondary }}>Loading packages...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20">
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
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(1)}`} style={{ color: colors.text.primary }}>Our Services</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(2)}`} style={{ color: colors.text.secondary }}>
            Carefully curated experiences for every celebration
          </p>
        </div>

        <div
          className={`relative z-50 border-2 p-8 mb-12 transition-colors frosted-glass ${tokens.transitions.colorChange} ${cardBgClass} ${cardBorderClass}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CustomCalendar
              id="event-date"
              label="Event Date"
              value={serviceConfig.eventDate}
              onChange={(date) => setServiceConfig({ ...serviceConfig, eventDate: date })}
            />

            <div>
              <label htmlFor="guest-count" className="block text-xs tracking-wider mb-2 uppercase font-medium" style={{ color: colors.text.secondary }}>
                Guest Count
              </label>
              <select
                id="guest-count"
                value={serviceConfig.guestCount}
                onChange={(e) => setServiceConfig({ ...serviceConfig, guestCount: e.target.value })}
                className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] text-sm transition-colors ${tokens.transitions.colorChange}`}
                style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
              >
                <option value="">Select range</option>
                <option value="1-25">1-25 guests</option>
                <option value="25-75">25-75 guests</option>
                <option value="75-150">75-150 guests</option>
                <option value="150-300">150-300 guests</option>
                <option value="300-500">300-500 guests</option>
                <option value="500+">500+ guests</option>
              </select>
            </div>

            <TimePicker
              id="start-time"
              label="Start Time"
              value={serviceConfig.startTime}
              onChange={(time) => setServiceConfig({ ...serviceConfig, startTime: time })}
            />

            <TimePicker
              id="end-time"
              label="End Time"
              value={serviceConfig.endTime}
              onChange={(time) => setServiceConfig({ ...serviceConfig, endTime: time })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
