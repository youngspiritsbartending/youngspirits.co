import { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useOrganicTransition, getOrganicTransitionClass } from '../hooks/useOrganicTransition';
import { useColors } from '../hooks/useColors';

interface Review {
  id: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  event_date: string | null;
  event_type: string | null;
  photo_urls: string[];
  submission_date: string;
}

export default function Reviews() {
  const { isFireflyMode, toggleFireflyMode } = useTheme();
  const colors = useColors();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTransitionClass } = useOrganicTransition('reviews');

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('submission_date', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    }

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? 'fill-[#d4af37] text-[#d4af37]'
                : 'text-[#e5dcc5]'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center ${getTransitionClass(0)}`} style={{ color: colors.text.secondary }}>Loading reviews...</div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-24">
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
          <h2 className={`text-6xl font-light mb-4 ${getTransitionClass(1)}`} style={{ color: colors.text.primary }}>Client Testimonials</h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${getTransitionClass(2)}`} style={{ color: colors.text.secondary }}>
            What our clients say about their experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => {
            return (
            <div
              key={review.id}
              className={`border-2 p-8 hover:border-[#d4af37] transition-all duration-300 ${getOrganicTransitionClass(`review-${review.id}`, 0)}`}
              style={{ backgroundColor: colors.backgrounds.card, borderColor: colors.borders.secondary }}
            >
              <div className="mb-4">{renderStars(review.rating)}</div>

              <p className={`leading-relaxed mb-6 italic ${getOrganicTransitionClass(`review-${review.id}`, 1)}`} style={{ color: colors.text.tertiary }}>
                "{review.review_text}"
              </p>

              <div className={`border-t pt-4 ${getOrganicTransitionClass(`review-${review.id}`, 2)}`} style={{ borderColor: colors.borders.secondary }}>
                <p className={`font-medium mb-1 ${getOrganicTransitionClass(`review-${review.id}`, 3)}`} style={{ color: colors.text.primary }}>{review.reviewer_name}</p>
                {review.event_type && (
                  <p className={`text-sm capitalize ${getOrganicTransitionClass(`review-${review.id}`, 4)}`} style={{ color: colors.text.secondary }}>
                    {review.event_type}
                    {review.event_date && ` • ${new Date(review.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </p>
                )}
              </div>

              {review.photo_urls && review.photo_urls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {review.photo_urls.slice(0, 2).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Event photo ${index + 1}`}
                      className="w-full h-24 object-cover border border-[#e5dcc5]"
                    />
                  ))}
                </div>
              )}
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
