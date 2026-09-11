import { NextRequest, NextResponse } from 'next/server';
import { liveServerService } from '@/services/server/live.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await liveServerService.getLiveConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await liveServerService.updateLiveConfig(body);

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'live_stream',
      record_id: updated.id,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
