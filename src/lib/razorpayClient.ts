'use client';

/**
 * Utility to load Razorpay Checkout Script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface InitiatePaymentOptions {
  amount: number; // In Rupees (INR)
  title?: string;
  description?: string;
  recordId?: string;
  type?: 'booking' | 'annadanam' | 'donation';
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (result: { transactionId: string; orderId: string; record?: any }) => void;
  onError: (error: string) => void;
}

/**
 * High-level function to trigger Razorpay checkout modal
 */
export async function initiateRazorpayPayment(options: InitiatePaymentOptions) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      options.onError('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    // 1. Create order via backend API
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          record_id: options.recordId || '',
          type: options.type || 'booking',
          ...(options.notes || {}),
        },
      }),
    });

    const orderJson = await orderRes.json();
    if (!orderJson.success || !orderJson.data) {
      options.onError(orderJson.error || 'Could not initiate payment order');
      return;
    }

    const { orderId, key, amount, currency } = orderJson.data;

    // Public HTTPS Cloudinary URL for Official Temple Logo (accessible by Razorpay's iframe)
    const logoUrl = 'https://res.cloudinary.com/ic0bztee/image/upload/v1789277394/srikari_atirudram/official_temple_logo.png';

    // 2. Configure Razorpay checkout options
    const razorpayOptions = {
      key: key,
      amount: amount,
      currency: currency,
      name: 'Srikari Ati Rudram Mahayagnam',
      description: options.description || options.title || 'Sacred Seva / Yagnam Donation',
      image: logoUrl,
      order_id: orderId,
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: '#2B0005',
      },
      handler: async function (response: any) {
        try {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              record_id: options.recordId,
              type: options.type || 'booking',
            }),
          });

          const verifyJson = await verifyRes.json();
          if (verifyJson.success) {
            options.onSuccess({
              transactionId: verifyJson.transactionId || response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              record: verifyJson.data,
            });
          } else {
            options.onError(verifyJson.error || 'Payment verification failed');
          }
        } catch (err: any) {
          options.onError(err.message || 'Error verifying payment signature');
        }
      },
      modal: {
        ondismiss: function () {
          options.onError('Payment window closed by user.');
        },
      },
    };

    const rzp = new (window as any).Razorpay(razorpayOptions);
    rzp.open();
  } catch (err: any) {
    options.onError(err.message || 'Payment initiation failed');
  }
}
