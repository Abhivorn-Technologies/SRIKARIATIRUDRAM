import { NextRequest, NextResponse } from 'next/server';
import { bookingServerService } from '@/services/server/booking.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const date = searchParams.get('date') || undefined;
    const seva_id = searchParams.get('seva_id') || undefined;
    const type = searchParams.get('type') || undefined;
    const nakshatra = searchParams.get('nakshatra') || undefined;
    const payment_status = searchParams.get('payment_status') || undefined;
    const booking_status = searchParams.get('booking_status') || undefined;
    const attendance = searchParams.get('attendance') || undefined;
    const devotee_participation = searchParams.get('devotee_participation') || searchParams.get('attending_personally') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await bookingServerService.getBookings({
      page,
      limit,
      date,
      seva_id,
      type,
      nakshatra,
      payment_status,
      booking_status,
      attendance,
      devotee_participation,
      search
    });

    return NextResponse.json({
      success: true,
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.seva_id || !body.selected_date || !body.full_name || !body.phone_number) {
      return NextResponse.json(
        { success: false, error: 'seva_id, selected_date, full_name, and phone_number are required' },
        { status: 400 }
      );
    }

    const booking = await bookingServerService.createBooking(body);

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'bookings',
      record_id: booking.booking_id,
      new_value: booking
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
