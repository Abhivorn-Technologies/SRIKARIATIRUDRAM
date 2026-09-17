import { NextRequest, NextResponse } from 'next/server';
import { annadanamServerService } from '@/services/server/annadanam.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const calendarDays = await annadanamServerService.getCalendarDays();
    const sponsors = await annadanamServerService.getAllAnnadanam();
    const oneDayStats = await annadanamServerService.getOneDayStats();

    return NextResponse.json({
      success: true,
      calendarDays,
      oneDayStats,
      sponsors: sponsors.map((s) => ({
        id: s.id,
        date: s.date,
        day_number: s.day_number,
        sponsor_name: s.is_anonymous ? 'Private Devotee' : (s.display_name || s.sponsor_name),
        amount: s.amount,
        occasion: s.occasion,
        status: s.status
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.sponsor_name || !body.mobile) {
      return NextResponse.json({ success: false, error: 'Sponsor name and mobile number are required' }, { status: 400 });
    }

    const record = await annadanamServerService.createAnnadanam(body);

    await auditServerService.logAction({
      admin_name: 'Devotee (Self Service)',
      action: 'CREATE',
      module: 'annadanam',
      record_id: record.id,
      new_value: record
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
