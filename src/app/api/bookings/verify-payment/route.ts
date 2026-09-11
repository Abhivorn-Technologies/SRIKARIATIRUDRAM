import { NextRequest, NextResponse } from 'next/server';
import { bookingServerService } from '@/services/server/booking.server.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, transaction_id, payment_response } = body;

    if (!booking_id || !transaction_id) {
      return NextResponse.json(
        { success: false, error: 'booking_id and transaction_id are required' },
        { status: 400 }
      );
    }

    // Server-side payment confirmation & status update
    const confirmed = await bookingServerService.verifyAndConfirmPayment(
      booking_id,
      transaction_id,
      payment_response
    );

    return NextResponse.json({
      success: true,
      data: confirmed,
      message: 'Payment verified and booking confirmed successfully.'
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
