import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay Key Secret is missing in environment variables' },
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

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification parameters: order_id, payment_id, and signature',
        },
        { status: 400 }
      );
    }

    // Generate HMAC SHA256 signature using order_id + "|" + payment_id and KEY_SECRET
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    // Strict comparison
    if (generatedSignature !== signature) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Payment signature verification failed. Invalid transaction signature.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment signature verified successfully',
      order_id,
      payment_id,
      transactionId: payment_id,
      orderId: order_id,
    });
  } catch (error: any) {
    console.error('Razorpay Payment Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
