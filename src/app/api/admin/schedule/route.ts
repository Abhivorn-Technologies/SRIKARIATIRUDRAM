import { NextRequest, NextResponse } from 'next/server';
import { scheduleServerService } from '@/services/server/schedule.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const schedules = await scheduleServerService.getAllSchedules();
    return NextResponse.json({ success: true, data: schedules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.day_number || !body.date) {
      return NextResponse.json({ success: false, error: 'day_number and date are required' }, { status: 400 });
    }

    const created = await scheduleServerService.createSchedule(body);
    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'schedule',
      record_id: String(created.day_number),
      new_value: created
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
