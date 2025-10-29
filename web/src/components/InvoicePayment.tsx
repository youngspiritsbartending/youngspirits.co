import { useEffect, useState } from 'react';
import { Check, X, Receipt, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InvoiceData {
  id: string;
  invoice_number: string;
  invoice_type: string;
  amount: number;
  line_items: any[];
  status: string;
  sent_at: string;
  due_date: string;
  booking: {
    booking_number: string;
    customer_name: string;
    customer_email: string;
    event_date: string;
    event_type?: string;
  };
}

export default function InvoicePayment({ token }: { token: string }) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInvoice() {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          invoice_type,
          amount,
          line_items,
          status,
          sent_at,
          due_date,
          booking_id,
          bookings!invoices_booking_id_fkey (
            booking_number,
            customer_name,
            customer_email,
            event_date,
            event_type
          )
        `)
        .eq('unique_link_token', token)
        .maybeSingle();

      if (error || !data) {
        setError('Invoice not found or link is invalid.');
      } else {
        const invoiceData: any = data;
        setInvoice({
          ...invoiceData,
          booking: invoiceData.bookings,
        });

        if (invoiceData.status === 'sent' && !invoiceData.viewed_at) {
          await supabase
            .from('invoices')
            .update({ viewed_at: new Date().toISOString(), status: 'viewed' })
            .eq('id', data.id);
        }
      }
      setLoading(false);
    }

    fetchInvoice();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <div className="text-[#8b7355]">Loading your invoice...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-[#2c2416] mb-2">Invoice Not Found</h1>
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

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && !isPaid;

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
            <Sparkles className="w-6 h-6 text-[#d4af37] mx-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
          </div>
          <h1 className="text-5xl font-light text-[#2c2416] mb-2">
            {invoice.invoice_type === 'deposit' ? 'Deposit Invoice' : 'Final Invoice'}
          </h1>
          <p className="text-[#8b7355]">Invoice #{invoice.invoice_number}</p>
        </div>

        <div className="bg-[#f5f3ed] border-2 border-[#e5dcc5] p-8 mb-6">
          {isPaid && (
            <div className="bg-[#d4af37]/10 border-2 border-[#d4af37] p-4 mb-6">
              <div className="flex items-center gap-2 text-[#2c2416]">
                <Check className="w-5 h-5" />
                <p className="font-medium">This invoice has been paid</p>
              </div>
            </div>
          )}

          {isOverdue && (
            <div className="bg-red-50 border-2 border-red-600 p-4 mb-6">
              <p className="text-red-800 font-medium">This invoice is overdue</p>
              <p className="text-sm text-red-700 mt-1">
                Please contact us if you need to discuss payment arrangements.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-light text-[#2c2416] mb-4">Booking Details</h2>
            <div className="space-y-2 text-[#5a4a3a]">
              <p><span className="text-[#8b7355]">Booking:</span> #{invoice.booking.booking_number}</p>
              <p><span className="text-[#8b7355]">Name:</span> {invoice.booking.customer_name}</p>
              {invoice.booking.event_type && (
                <p><span className="text-[#8b7355]">Event Type:</span> {invoice.booking.event_type}</p>
              )}
              <p><span className="text-[#8b7355]">Event Date:</span> {new Date(invoice.booking.event_date).toLocaleDateString()}</p>
              {invoice.due_date && (
                <p><span className="text-[#8b7355]">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {invoice.line_items && invoice.line_items.length > 0 && (
            <div className="border-t-2 border-[#e5dcc5] pt-6 mb-6">
              <h2 className="text-2xl font-light text-[#2c2416] mb-4">Invoice Items</h2>
              <div className="space-y-2">
                {invoice.line_items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-[#5a4a3a]">
                    <span>{item.description}</span>
                    <span>${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t-2 border-[#e5dcc5] pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-[#2c2416]">Amount Due</h2>
              <div className="text-5xl font-light text-[#d4af37]">
                ${invoice.amount.toLocaleString()}
              </div>
            </div>

            {!isPaid && (
              <div className="bg-[#fdfcf8] border-2 border-[#d4af37] p-6 text-center">
                <Receipt className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                <p className="text-[#5a4a3a] mb-4">
                  Payment processing integration will be completed here.
                </p>
                <p className="text-sm text-[#8b7355] italic">
                  For now, please contact us at{' '}
                  <a href="mailto:hello@youngspirits.co" className="text-[#d4af37] hover:underline">
                    hello@youngspirits.co
                  </a>
                  {' '}to arrange payment.
                </p>
              </div>
            )}
          </div>
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
