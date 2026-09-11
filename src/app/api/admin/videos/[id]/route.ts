import { NextRequest, NextResponse } from 'next/server';
import { mediaServerService } from '@/services/server/media.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await mediaServerService.updateMediaAsset(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'videos',
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
    const ok = await mediaServerService.deleteMediaAsset(params.id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'videos',
      record_id: params.id
    });

    return NextResponse.json({ success: true, message: 'Video deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
