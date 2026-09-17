import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay API credentials not configured in environment' },
        { status: 401 }
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

    const { receipt, notes, currency = 'INR' } = body;
    const rawAmount = body.amount;

    if (rawAmount === undefined || rawAmount === null || isNaN(Number(rawAmount))) {
      return NextResponse.json(
        { success: false, error: 'Amount is required' },
        { status: 400 }
      );
    }

    const numAmount = Number(rawAmount);

    // Determine amount in paise.
    // If amount is passed in Rupees (e.g., 500), convert to paise (50000).
    // If amount is passed in paise (e.g., 50000), keep as paise.
    // Standard minimum requirement: amount must be >= 100 paise (₹1).
    let amountInPaise: number;

    if (body.isPaise || numAmount >= 1000) {
      // Amount is already in paise
      amountInPaise = Math.round(numAmount);
    } else {
      // Amount is provided in Rupees (e.g. 1 to 999.99), convert to paise
      amountInPaise = Math.round(numAmount * 100);
    }

    if (amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum amount must be at least 100 paise (₹1)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id,
      data: {
        order_id: order.id,
        orderId: order.id,
        key: key_id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    
    // Handle auth errors (401)
    if (error.statusCode === 401 || error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Razorpay authentication failed. Invalid Key ID or Secret.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
