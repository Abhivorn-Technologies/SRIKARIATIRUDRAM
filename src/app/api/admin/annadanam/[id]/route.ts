import { NextRequest, NextResponse } from 'next/server';
import { annadanamServerService } from '@/services/server/annadanam.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await annadanamServerService.updateAnnadanam(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Annadanam record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'annadanam',
      record_id: params.id,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ok = await annadanamServerService.deleteAnnadanam(params.id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Annadanam record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'annadanam',
      record_id: params.id
    });

    return NextResponse.json({ success: true, message: 'Annadanam record deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
