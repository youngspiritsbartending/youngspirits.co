import { useState, useEffect } from 'react';
import { Sparkles, Calculator } from 'lucide-react';

interface CustomPackageBuilderProps {
  onCalculatorChange?: (data: {
    guestCount: string;
    hours: string;
    bartenders: string;
    customCocktails: string;
    premiumSpirits: boolean;
    barSetup: string;
    calculatedQuote: number;
  }) => void;
}

export default function CustomPackageBuilder({ onCalculatorChange }: CustomPackageBuilderProps) {
  const [formData, setFormData] = useState({
    guestCount: 50,
    hours: 4,
    bartenders: 1,
    customCocktails: 0,
    premiumSpirits: false,
    barSetup: 'standard',
  });

  const [hasInteracted, setHasInteracted] = useState(false);

  const calculateBartenders = (guests: number) => {
    return Math.max(1, Math.ceil(guests / 75));
  };

  const calculateQuote = () => {
    const guests = formData.guestCount || 0;
    const hours = formData.hours || 0;
    const bartenders = formData.bartenders || 1;
    const cocktails = formData.customCocktails || 0;

    let basePrice = 0;

    if (guests <= 50) basePrice = 400;
    else if (guests <= 100) basePrice = 800;
    else if (guests <= 150) basePrice = 1200;
    else basePrice = 1600;

    const hourlyRate = bartenders * 75;
    const timeCost = hours * hourlyRate;

    const cocktailCost = cocktails * 50;

    const spiritsCost = formData.premiumSpirits ? 300 : 0;

    let setupCost = 0;
    if (formData.barSetup === 'premium') setupCost = 200;
    else if (formData.barSetup === 'luxury') setupCost = 400;

    const total = basePrice + timeCost + cocktailCost + spiritsCost + setupCost;

    return total > 0 ? total : 0;
  };

  const quote = calculateQuote();

  useEffect(() => {
    if (hasInteracted) {
      const requiredBartenders = calculateBartenders(formData.guestCount);
      if (formData.bartenders < requiredBartenders) {
        setFormData(prev => ({ ...prev, bartenders: requiredBartenders }));
      }
    }
  }, [formData.guestCount, hasInteracted]);

  useEffect(() => {
    if (hasInteracted && onCalculatorChange) {
      onCalculatorChange({
        guestCount: formData.guestCount.toString(),
        hours: formData.hours.toString(),
        bartenders: formData.bartenders.toString(),
        customCocktails: formData.customCocktails.toString(),
        premiumSpirits: formData.premiumSpirits,
        barSetup: formData.barSetup,
        calculatedQuote: quote,
      });
    }
  }, [formData, quote, hasInteracted, onCalculatorChange]);

  return (
    <section className="py-24 bg-[#f5f3ed]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <Calculator className="w-6 h-6 text-[#d4af37] mx-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h2 className="text-6xl font-light text-[#2c2416] mb-4">Build Your Package</h2>
          <p className="text-lg text-[#8b7355] max-w-2xl mx-auto leading-relaxed">
            Create a custom experience tailored to your unique celebration
          </p>
        </div>

        <div className="bg-[#fdfcf8] border-2 border-[#e5dcc5] p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-sm tracking-wider text-[#8b7355] mb-3 uppercase flex justify-between">
                <span>Number of Guests</span>
                <span className="font-light">{formData.guestCount}</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={formData.guestCount}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, guestCount: parseInt(e.target.value) });
                }}
                className="w-full h-2 bg-[#e5dcc5] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-[#8b7355] mt-1">
                <span>10</span>
                <span>300</span>
              </div>
            </div>

            <div>
              <label className="block text-sm tracking-wider text-[#8b7355] mb-3 uppercase flex justify-between">
                <span>Hours of Service</span>
                <span className="font-light">{formData.hours}</span>
              </label>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={formData.hours}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, hours: parseInt(e.target.value) });
                }}
                className="w-full h-2 bg-[#e5dcc5] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-[#8b7355] mt-1">
                <span>2</span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="block text-sm tracking-wider text-[#8b7355] mb-3 uppercase flex justify-between">
                <span>Number of Bartenders</span>
                <span className="font-light">{formData.bartenders}</span>
              </label>
              <input
                type="range"
                min={calculateBartenders(formData.guestCount)}
                max="8"
                step="1"
                value={formData.bartenders}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, bartenders: parseInt(e.target.value) });
                }}
                className="w-full h-2 bg-[#e5dcc5] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-[#8b7355] mt-1">
                <span>Min: {calculateBartenders(formData.guestCount)}</span>
                <span>8</span>
              </div>
              <p className="text-xs text-[#8b7355] mt-2 italic">
                Max 75 guests per bartender
              </p>
            </div>

            <div>
              <label className="block text-sm tracking-wider text-[#8b7355] mb-3 uppercase flex justify-between">
                <span>Custom Cocktails</span>
                <span className="font-light">{formData.customCocktails}</span>
              </label>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={formData.customCocktails}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, customCocktails: parseInt(e.target.value) });
                }}
                className="w-full h-2 bg-[#e5dcc5] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-[#8b7355] mt-1">
                <span>None</span>
                <span>8</span>
              </div>
            </div>

            <div>
              <label className="block text-sm tracking-wider text-[#8b7355] mb-3 uppercase">
                Bar Setup
              </label>
              <select
                value={formData.barSetup}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, barSetup: e.target.value });
                }}
                className="w-full px-4 py-3 border border-[#e5dcc5] bg-[#fdfcf8] text-[#2c2416] focus:outline-none focus:border-[#d4af37] transition-colors"
              >
                <option value="standard">Standard Setup</option>
                <option value="premium">Premium Setup (+$200)</option>
                <option value="luxury">Luxury Setup (+$400)</option>
              </select>
            </div>

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="premiumSpirits"
                checked={formData.premiumSpirits}
                onChange={(e) => {
                  setHasInteracted(true);
                  setFormData({ ...formData, premiumSpirits: e.target.checked });
                }}
                className="w-5 h-5 border-2 border-[#d4af37] text-[#d4af37] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="premiumSpirits" className="ml-3 text-[#5a4a3a]">
                Premium Spirits Upgrade <span className="text-[#8b7355]">(+$300)</span>
              </label>
            </div>
          </div>

          <div className="border-t-2 border-[#e5dcc5] pt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm tracking-wider text-[#8b7355] mb-1 uppercase">
                  Estimated Total
                </div>
                <div className="text-5xl font-light text-[#2c2416]">
                  ${quote.toLocaleString()}
                </div>
                <p className="text-xs text-[#8b7355] mt-2 italic">
                  Final pricing may vary based on your specific requirements
                </p>
              </div>
              <div>
                <a
                  href="#contact"
                  className="inline-block px-10 py-4 text-sm tracking-wider font-medium text-[#2c2416] border-2 border-[#d4af37] hover:bg-[#d4af37] transition-all duration-300"
                >
                  REQUEST QUOTE
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#8b7355] italic">
            Not sure what you need? Our packages above provide curated options for every occasion.
          </p>
        </div>
      </div>
    </section>
  );
}
