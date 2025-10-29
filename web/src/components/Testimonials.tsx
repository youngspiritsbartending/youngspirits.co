import { Star, Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition, getOrganicTransitionClass } from '../hooks/useOrganicTransition';
import { useThemeColors } from '../hooks/useThemeColors';
import { useColors } from '../hooks/useColors';

export default function Testimonials() {
  const { isFireflyMode, toggleFireflyMode, tokens } = useTheme();
  const { cardBgClass, cardBorderClass } = useThemeColors();
  const colors = useColors();
  const { getTransitionClass } = useOrganicTransition('testimonials', { baseDelay: 0.1, staggerDelay: 0.08 });
  const testimonials = [
    {
      name: 'Sarah Martinez',
      event: 'Wedding Reception',
      rating: 5,
      date: 'October 2024',
      text: 'Young Spirits transformed our wedding reception into an unforgettable celebration. The custom cocktails were absolutely divine, and our guests are still raving about the espresso martinis! The bartenders were professional, engaging, and made everyone feel special. Worth every penny.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Michael Chen',
      event: 'Corporate Event',
      rating: 5,
      date: 'September 2024',
      text: 'We hired Young Spirits for our annual company celebration and they exceeded all expectations. The setup was elegant, the service was impeccable, and they handled our 150+ guests with ease. Several clients asked for their contact information. Highly recommend!',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Rodriguez',
      event: '30th Birthday Party',
      rating: 5,
      date: 'August 2024',
      text: 'From the initial consultation to the final toast, everything was perfect. They created a custom cocktail menu that matched my party theme beautifully. The presentation was stunning and the drinks were delicious. My friends said it was the best party they\'ve ever attended!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'David Thompson',
      event: 'Anniversary Celebration',
      rating: 5,
      date: 'July 2024',
      text: 'Young Spirits helped us celebrate 25 years of marriage in style. They were attentive, creative, and brought such positive energy to our event. The classic cocktails were expertly crafted and the service was top-notch. Thank you for making our special day even more memorable!',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Jennifer Lee',
      event: 'Baby Shower',
      rating: 5,
      date: 'June 2024',
      text: 'I was worried about finding a bartending service that could create amazing mocktails for my baby shower, but Young Spirits delivered beautifully! The non-alcoholic cocktails were creative and delicious, and they even made special drinks for the expecting mothers. Everyone loved it!',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Robert Jackson',
      event: 'Retirement Party',
      rating: 5,
      date: 'May 2024',
      text: 'Exceptional service from start to finish. The team was punctual, professional, and incredibly skilled. They handled our diverse guest list perfectly, creating drinks that everyone enjoyed. The bar setup was beautiful and added a touch of elegance to our celebration. Would hire again in a heartbeat!',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <button
              onClick={toggleFireflyMode}
              className="cursor-pointer transition-transform hover:scale-110 duration-300"
              aria-label="Toggle firefly mode"
            >
              <Star className="w-6 h-6 text-[#d4af37] mx-4 fill-current" />
            </button>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>Client Testimonials</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            Hear from those who've experienced the Young Spirits difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => {
            return (
            <div
              key={index}
              className={`border-2 p-6 hover:border-[#d4af37]/50 transition-all frosted-glass ${tokens.transitions.colorChange} hover:shadow-lg ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${testimonial.image})` }}
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${getOrganicTransitionClass('testimonials', index * 3)}`} style={{ color: colors.text.primary }}>{testimonial.name}</h3>
                  <p className={`text-xs ${getOrganicTransitionClass('testimonials', index * 3 + 1)}`} style={{ color: colors.text.secondary }}>{testimonial.event}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#d4af37] fill-current" />
                    ))}
                    <span className={`text-xs ml-2 ${getOrganicTransitionClass('testimonials', index * 3 + 2)}`} style={{ color: colors.text.secondary }}>{testimonial.date}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-[#d4af37]/20 absolute -top-2 -left-1" />
                <p className={`text-sm leading-relaxed pl-6 ${getOrganicTransitionClass('testimonials', index * 4)}`} style={{ color: colors.text.tertiary }}>
                  {testimonial.text}
                </p>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
