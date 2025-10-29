import { useEffect, useState } from 'react';
import { Check, X, Clock, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuoteData {
  id: string;
  quote_number: string;
  quote_amount: number;
  quote_details: any;
  status: string;
  sent_at: string;
  expires_at: string;
  submission: {
    name: string;
    email: string;
    event_date?: string;
    event_type?: string;
    guest_count?: number;
  };
}

export default function QuoteAcceptance({ token }: { token: string }) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          quote_number,
          quote_amount,
          quote_details,
          status,
          sent_at,
          expires_at,
          submission_id,
          contact_submissions!quotes_submission_id_fkey (
            name,
            email,
            event_date,
            event_type,
            guest_count
          )
        `)
        .eq('unique_link_token', token)
        .maybeSingle();

      if (error || !data) {
        setError('Quote not found or link is invalid.');
      } else {
        const quoteData: any = data;
        setQuote({
          ...quoteData,
          submission: quoteData.contact_submissions,
        });

        if (quoteData.status === 'sent' && !quoteData.viewed_at) {
          await supabase
            .from('quotes')
            .update({ viewed_at: new Date().toISOString(), status: 'viewed' })
            .eq('id', data.id);
        }
      }
      setLoading(false);
    }

    fetchQuote();
  }, [token]);

  const handleAccept = async () => {
    if (!quote) return;

    setAccepting(true);
    setError('');

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', quote.id);

    setAccepting(false);

    if (updateError) {
      setError('Failed to accept quote. Please try again or contact us.');
    } else {
      setSuccess(true);
    }
  };

  const handleDecline = async () => {
    if (!quote) return;

    setDeclining(true);
    setError('');

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', quote.id);

    setDeclining(false);

    if (updateError) {
      setError('Failed to decline quote. Please contact us directly.');
    } else {
      setQuote({ ...quote, status: 'declined' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <div className="text-[#8b7355]">Loading your quote...</div>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-[#2c2416] mb-2">Quote Not Found</h1>
          <p className="text-[#8b7355]">{error}</p>
          <p className="text-sm text-[#8b7355] mt-4">
            If you need assistance, please contact us at{' '}
            <a href="mailto:hello@youngspirits.co" className="text-[#d4af37] hover:underline">
              hello@youngspirits.co
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const isExpired = quote.expires_at && new Date(quote.expires_at) < new Date();
  const canRespond = quote.status === 'sent' || quote.status === 'viewed';

  if (success) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <Check className="w-20 h-20 text-[#d4af37] mx-auto mb-6" />
          <h1 className="text-4xl font-light text-[#2c2416] mb-4">Quote Accepted!</h1>
          <p className="text-lg text-[#8b7355] mb-6">
            Thank you for accepting our quote. We'll send your deposit invoice shortly to{' '}
            <span className="font-medium">{quote.submission.email}</span>
          </p>
          <div className="bg-[#f5f3ed] border-2 border-[#e5dcc5] p-8">
            <p className="text-[#5a4a3a] mb-4">
              Once you receive the deposit invoice, you'll be able to secure your booking by paying the deposit amount.
            </p>
            <p className="text-sm text-[#8b7355] italic">
              We typically send deposit invoices within 1-2 business hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (quote.status === 'declined') {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-[#8b7355] mb-4">This quote has been declined.</div>
          <p className="text-sm text-[#8b7355]">
            If you'd like to discuss alternative options, please contact us at{' '}
            <a href="mailto:hello@youngspirits.co" className="text-[#d4af37] hover:underline">
              hello@youngspirits.co
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <Sparkles className="w-6 h-6 text-[#d4af37] mx-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h1 className="text-5xl font-light text-[#2c2416] mb-2">Your Custom Quote</h1>
          <p className="text-[#8b7355]">Quote #{quote.quote_number}</p>
        </div>

        <div className="bg-[#f5f3ed] border-2 border-[#e5dcc5] p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-light text-[#2c2416] mb-4">Event Details</h2>
            <div className="space-y-2 text-[#5a4a3a]">
              <p><span className="text-[#8b7355]">Name:</span> {quote.submission.name}</p>
              {quote.submission.event_type && (
                <p><span className="text-[#8b7355]">Event Type:</span> {quote.submission.event_type}</p>
              )}
              {quote.submission.event_date && (
                <p><span className="text-[#8b7355]">Date:</span> {new Date(quote.submission.event_date).toLocaleDateString()}</p>
              )}
              {quote.submission.guest_count && (
                <p><span className="text-[#8b7355]">Guests:</span> {quote.submission.guest_count}</p>
              )}
            </div>
          </div>

          <div className="border-t-2 border-[#e5dcc5] pt-6 mb-6">
            <h2 className="text-2xl font-light text-[#2c2416] mb-4">Quote Amount</h2>
            <div className="text-5xl font-light text-[#d4af37]">
              ${quote.quote_amount.toLocaleString()}
            </div>
          </div>

          {isExpired && (
            <div className="bg-red-50 border-2 border-red-600 p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <Clock className="w-5 h-5" />
                <p className="font-medium">This quote has expired</p>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Please contact us to request a new quote.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-600 p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {canRespond && !isExpired && (
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                disabled={accepting || declining}
                className="flex-1 bg-[#d4af37] text-[#2c2416] py-4 text-sm tracking-wider font-medium hover:bg-[#c4a037] transition-all duration-300 disabled:opacity-50"
              >
                {accepting ? 'ACCEPTING...' : 'ACCEPT QUOTE'}
              </button>
              <button
                onClick={handleDecline}
                disabled={accepting || declining}
                className="flex-1 border-2 border-[#8b7355] text-[#8b7355] py-4 text-sm tracking-wider font-medium hover:bg-[#8b7355] hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                {declining ? 'DECLINING...' : 'DECLINE'}
              </button>
            </div>
          )}

          {!canRespond && !isExpired && (
            <div className="text-center text-[#8b7355]">
              <p>You have already responded to this quote.</p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-[#8b7355]">
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:hello@youngspirits.co" className="text-[#d4af37] hover:underline">
              hello@youngspirits.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
