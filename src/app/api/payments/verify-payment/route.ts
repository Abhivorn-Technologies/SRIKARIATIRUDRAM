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

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;
    const record_id = body.record_id;
    const type = body.type || 'booking';

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay verification parameters: order_id, payment_id, and signature' },
        { status: 400 }
      );
    }

    // Verify Razorpay HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Invalid transaction signature.' },
        { status: 400 }
      );
    }

    // Signature verified successfully -> update database record status if record_id is provided
    let updatedRecord: any = null;

    if (type === 'booking' && record_id) {
      updatedRecord = await bookingServerService.verifyAndConfirmPayment(
        record_id,
        payment_id,
        { razorpay_order_id: order_id, razorpay_payment_id: payment_id, razorpay_signature: signature }
      );
    } else if (type === 'annadanam' && record_id) {
      updatedRecord = await annadanamServerService.updateAnnadanam(record_id, {
        payment_status: 'SUCCESS',
        transaction_id: payment_id,
      });
    } else if (type === 'donation' && record_id) {
      updatedRecord = await donationServerService.updateDonation(record_id, {
        payment_status: 'SUCCESS',
        transaction_id: payment_id,
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment signature verified successfully',
      transactionId: payment_id,
      orderId: order_id,
      order_id,
      payment_id,
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
