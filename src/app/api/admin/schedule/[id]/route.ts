import { NextRequest, NextResponse } from 'next/server';
import { scheduleServerService } from '@/services/server/schedule.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await scheduleServerService.getScheduleById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const oldItem = await scheduleServerService.getScheduleById(params.id);
    const updated = await scheduleServerService.updateSchedule(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'schedule',
      record_id: params.id,
      old_value: oldItem,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  return PATCH(req, ctx);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oldItem = await scheduleServerService.getScheduleById(params.id);
    const ok = await scheduleServerService.deleteSchedule(params.id);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Schedule not found or already deleted' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'schedule',
      record_id: params.id,
      old_value: oldItem
    });

    return NextResponse.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
