import { NextRequest, NextResponse } from 'next/server';
import { bookingServerService } from '@/services/server/booking.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const attendance = body.attendance as 'PENDING' | 'PRESENT' | 'ABSENT';

    if (!['PENDING', 'PRESENT', 'ABSENT'].includes(attendance)) {
      return NextResponse.json(
        { success: false, error: 'Invalid attendance value. Must be PENDING, PRESENT, or ABSENT.' },
        { status: 400 }
      );
    }

    const updated = await bookingServerService.updateAttendance(params.id, attendance);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'ATTENDANCE',
      module: 'bookings',
      record_id: params.id,
      new_value: { attendance }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
