import { NextRequest, NextResponse } from 'next/server';
import { sevaServerService } from '@/services/server/seva.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const seva = await sevaServerService.getSevaByIdOrSlug(params.id);
    if (!seva) {
      return NextResponse.json({ success: false, error: 'Seva not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: seva });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const oldSeva = await sevaServerService.getSevaByIdOrSlug(params.id);
    const updated = await sevaServerService.updateSeva(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Seva not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'sevas',
      record_id: params.id,
      old_value: oldSeva,
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
    const oldSeva = await sevaServerService.getSevaByIdOrSlug(params.id);
    const ok = await sevaServerService.deleteSeva(params.id);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Seva not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'sevas',
      record_id: params.id,
      old_value: oldSeva
    });

    return NextResponse.json({ success: true, message: 'Seva deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
