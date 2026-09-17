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
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface InitiatePaymentOptions {
  amount: number; // Amount in INR or Paise
  isPaise?: boolean;
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
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        isPaise: options.isPaise,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          record_id: options.recordId || '',
          type: options.type || 'booking',
          ...(options.notes || {}),
        },
      }),
    });

    const orderJson = await orderRes.json();
    if (!orderRes.ok || !orderJson.success) {
      options.onError(orderJson.error || 'Could not initiate Razorpay payment order');
      return;
    }

    const orderId = orderJson.order_id || orderJson.orderId || orderJson.data?.order_id || orderJson.data?.orderId;
    const key = orderJson.key || orderJson.data?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const amount = orderJson.amount || orderJson.data?.amount;
    const currency = orderJson.currency || orderJson.data?.currency || 'INR';

    if (!orderId || !key) {
      options.onError('Invalid order response from payment server');
      return;
    }

    // Public logo for temple checkout header
    const logoUrl = 'https://res.cloudinary.com/ic0bztee/image/upload/v1789277394/srikari_atirudram/official_temple_logo.png';

    // 2. Configure Razorpay checkout modal options
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
          // 3. Send razorpay_payment_id, razorpay_order_id, razorpay_signature to backend verify endpoint
          const verifyRes = await fetch('/api/verify-payment', {
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
          if (verifyRes.ok && (verifyJson.success || verifyJson.verified)) {
            options.onSuccess({
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              record: verifyJson.data,
            });
          } else {
            options.onError(verifyJson.error || 'Payment signature verification failed.');
          }
        } catch (err: any) {
          options.onError(err.message || 'Error verifying payment signature.');
        }
      },
      modal: {
        ondismiss: function () {
          options.onError('Payment window was cancelled by user.');
        },
      },
    };

    const rzp = new (window as any).Razorpay(razorpayOptions);

    // Handle payment.failed event
    rzp.on('payment.failed', function (response: any) {
      const failReason = response?.error?.description || response?.error?.reason || 'Payment failed.';
      options.onError(`Payment failed: ${failReason}`);
    });

    rzp.open();
  } catch (err: any) {
    options.onError(err.message || 'Payment initiation failed.');
  }
}
