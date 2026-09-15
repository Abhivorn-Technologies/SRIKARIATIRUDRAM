import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { bookingServerService } from '@/services/server/booking.server.service';
import { annadanamServerService } from '@/services/server/annadanam.server.service';
import { donationServerService } from '@/services/server/donation.server.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay Secret Key missing in environment' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      record_id,
      type = 'booking', // 'booking' | 'annadanam' | 'donation'
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing Razorpay signature verification parameters' },
        { status: 400 }
      );
    }

    // Verify Razorpay HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Invalid transaction.' },
        { status: 400 }
      );
    }

    // Update database record status to SUCCESS based on transaction type
    let updatedRecord: any = null;

    if (type === 'booking' && record_id) {
      updatedRecord = await bookingServerService.verifyAndConfirmPayment(
        record_id,
        razorpay_payment_id,
        { razorpay_order_id, razorpay_payment_id, razorpay_signature }
      );
    } else if (type === 'annadanam' && record_id) {
      updatedRecord = await annadanamServerService.updateAnnadanam(record_id, {
        payment_status: 'SUCCESS',
        transaction_id: razorpay_payment_id,
      });
    } else if (type === 'donation' && record_id) {
      updatedRecord = await donationServerService.updateDonation(record_id, {
        payment_status: 'SUCCESS',
        transaction_id: razorpay_payment_id,
      });
    }

    return NextResponse.json({
      success: true,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error('Razorpay Payment Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
