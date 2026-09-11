import { NextRequest, NextResponse } from 'next/server';
import { sevaServerService } from '@/services/server/seva.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;
    const sevaId = searchParams.get('seva_id') || undefined;

    const list = await sevaServerService.getSevaAvailability(date, sevaId);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.date || !body.seva_id || body.capacity === undefined) {
      return NextResponse.json({ success: false, error: 'date, seva_id, and capacity are required' }, { status: 400 });
    }

    const updated = await sevaServerService.updateSevaAvailability(body.date, body.seva_id, parseInt(body.capacity, 10));
    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'seva_availability',
      record_id: `${body.date}_${body.seva_id}`,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
