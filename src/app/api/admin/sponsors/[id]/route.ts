import { NextRequest, NextResponse } from 'next/server';
import { sponsorServerService } from '@/services/server/sponsor.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await sponsorServerService.updateSponsor(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Sponsor not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'sponsors',
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
    const ok = await sponsorServerService.deleteSponsor(params.id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Sponsor not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'sponsors',
      record_id: params.id
    });

    return NextResponse.json({ success: true, message: 'Sponsor deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
