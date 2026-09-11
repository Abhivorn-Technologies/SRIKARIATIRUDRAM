import { NextRequest, NextResponse } from 'next/server';
import { bookingServerService } from '@/services/server/booking.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = await bookingServerService.getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const oldBooking = await bookingServerService.getBookingById(params.id);
    const updated = await bookingServerService.updateBooking(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'bookings',
      record_id: params.id,
      old_value: oldBooking,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oldBooking = await bookingServerService.getBookingById(params.id);
    const ok = await bookingServerService.deleteBooking(params.id);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'bookings',
      record_id: params.id,
      old_value: oldBooking
    });

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
