import { Award, Heart, Users, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

export default function ServicesShowcase() {
  const { isFireflyMode, toggleFireflyMode, tokens } = useTheme();
  const { getTransitionClass } = useOrganicTransition('services');
  const colors = useColors();
  const features = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Uncompromising quality in every cocktail, every detail, every moment',
    },
    {
      icon: Sparkles,
      title: 'Creativity',
      description: 'Imaginative drinks and presentations that surprise and inspire',
    },
    {
      icon: Heart,
      title: 'Delight',
      description: 'Joyful experiences that create lasting memories for you and your guests',
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#d4af37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#d4af37] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
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
          <h2 className={`text-6xl font-light mb-6 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>What Sets Us Apart</h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            More than just bartending—we create immersive experiences that elevate every moment of your celebration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group relative"
            >
              <div className="relative p-8">
                <button
                  onClick={toggleFireflyMode}
                  className="inline-flex items-center justify-center w-24 h-24 mb-6 border-2 border-[#d4af37] rounded-full group-hover:bg-[#d4af37] group-hover:scale-110 transition-all duration-500 shadow-lg cursor-pointer"
                  aria-label="Toggle firefly mode"
                >
                  <feature.icon className="w-10 h-10 text-[#d4af37] transition-colors duration-500 group-hover:text-[#2c2416]" />
                </button>
                <h3 className={`text-3xl font-light mb-4 tracking-wide ${getTransitionClass(index + 2)}`} style={{ color: colors.text.primary }}>
                  {feature.title}
                </h3>
                <p className={`text-lg leading-relaxed ${getTransitionClass(index + 5)}`} style={{ color: colors.text.secondary }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
