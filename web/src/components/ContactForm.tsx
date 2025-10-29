import { useState, FormEvent, useEffect } from 'react';
import { Mail, Phone, Users, MessageSquare, Sparkles } from 'lucide-react';
import { supabase, ContactSubmission } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import TimePicker from './TimePicker';
import CustomCalendar from './CustomCalendar';
import { useOrganicTransition } from '../hooks/useOrganicTransition';
import { useThemeColors } from '../hooks/useThemeColors';
import { useColors } from '../hooks/useColors';

export default function ContactForm() {
  const { isFireflyMode, toggleFireflyMode, tokens } = useTheme();
  const { cardBgClass, cardBorderClass } = useThemeColors();
  const colors = useColors();
  const { selectedPackage, selectedAddons, serviceConfig, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { getTransitionClass } = useOrganicTransition('contact-form', { baseDelay: 0.1, staggerDelay: 0.08 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_date: '',
    event_type: '',
    guest_count: '',
    start_time: '17:00',
    end_time: '22:00',
    message: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      event_date: serviceConfig.eventDate || prev.event_date,
      guest_count: serviceConfig.guestCount || prev.guest_count,
      start_time: serviceConfig.startTime || prev.start_time,
      end_time: serviceConfig.endTime || prev.end_time,
    }));
  }, [serviceConfig]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedPackage && selectedAddons.length > 0) {
      const proceed = window.confirm(
        'You have selected enhancements but no base package. Would you like to proceed with enhancements only, or go back to select a package?\n\nClick OK to proceed without a package, or Cancel to go back.'
      );

      if (!proceed) {
        return;
      }
    }

    setLoading(true);
    setError('');

    const estimateTotal = getTotal();
    const messageText = formData.message || '';

    const submission: ContactSubmission = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      event_date: formData.event_date || undefined,
      event_type: formData.event_type || undefined,
      guest_count: formData.guest_count || undefined,
      start_time: formData.start_time || undefined,
      end_time: formData.end_time || undefined,
      selected_package_id: selectedPackage?.id,
      selected_addons: selectedAddons.map(a => a.id),
      message: messageText || undefined,
      total_estimate: estimateTotal,
    };

    const { error: submitError } = await supabase
      .from('contact_submissions')
      .insert([submission]);

    setLoading(false);

    if (submitError) {
      setError('Failed to submit form. Please try again.');
      console.error('Submission error:', submitError);
    } else {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_date: '',
        event_type: '',
        guest_count: '',
        start_time: '17:00',
        end_time: '22:00',
        message: '',
      });
      clearCart();
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
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
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(0)}`} style={{ color: colors.text.primary }}>Begin Your Journey</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(1)}`} style={{ color: colors.text.secondary }}>
            Share your vision with us, and we'll craft an unforgettable experience
          </p>
        </div>

        <div className={`border-2 p-10 transition-colors frosted-glass ${tokens.transitions.colorChange} ${cardBgClass} ${cardBorderClass}`}>
          <form onSubmit={handleSubmit}>
            {success && (
              <div className="mb-8 p-4 border-2 border-[#d4af37] bg-[#d4af37]/5 text-[#2c2416]">
                <p className="text-center font-medium">Thank you for your inquiry. We will be in touch within 24 hours.</p>
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 border-2 border-red-600 bg-red-50 text-red-800">
                <p className="text-center">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-xs tracking-wider mb-2 uppercase font-medium" style={{ color: colors.text.secondary }}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} placeholder:text-sm`}
                  style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs tracking-wider mb-2 uppercase font-medium flex items-center gap-2" style={{ color: colors.text.secondary }}>
                  <Mail className="w-3 h-3" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} placeholder:text-sm`}
                  style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs tracking-wider mb-2 uppercase font-medium flex items-center gap-2" style={{ color: colors.text.secondary }}>
                  <Phone className="w-3 h-3" />
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} placeholder:text-sm`}
                  style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <CustomCalendar
                  id="event_date"
                  label="Event Date"
                  value={formData.event_date}
                  onChange={(date) => setFormData({ ...formData, event_date: date })}
                />
              </div>

              <div>
                <label htmlFor="event_type" className="block text-xs tracking-wider mb-2 uppercase font-medium" style={{ color: colors.text.secondary }}>
                  Event Type
                </label>
                <select
                  id="event_type"
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange}`}
                  style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
                >
                  <option value="">Select type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="private">Private Party</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="guest_count" className="block text-xs tracking-wider mb-2 uppercase font-medium flex items-center gap-2" style={{ color: colors.text.secondary }}>
                  <Users className="w-3 h-3" />
                  Guest Count
                </label>
                <select
                  id="guest_count"
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                  className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange}`}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TimePicker
                id="start_time"
                label="Start Time"
                value={formData.start_time}
                onChange={(time) => setFormData({ ...formData, start_time: time })}
              />

              <TimePicker
                id="end_time"
                label="End Time"
                value={formData.end_time}
                onChange={(time) => setFormData({ ...formData, end_time: time })}
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-xs tracking-wider mb-2 uppercase font-medium flex items-center gap-2" style={{ color: colors.text.secondary }}>
                <MessageSquare className="w-3 h-3" />
                Your Vision
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className={`w-full px-4 py-3 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} resize-none placeholder:text-sm`}
                style={{ borderColor: colors.borders.secondary, backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt, color: colors.text.primary }}
                placeholder="Tell us about your celebration..."
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] text-[#2c2416] py-4 text-sm tracking-wider font-medium hover:bg-[#c4a037] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SUBMITTING...' : 'REQUEST YOUR QUOTE'}
            </button>

            <p className="text-xs text-center mt-4 italic" style={{ color: colors.text.secondary }}>
              We typically respond within 24 hours
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
