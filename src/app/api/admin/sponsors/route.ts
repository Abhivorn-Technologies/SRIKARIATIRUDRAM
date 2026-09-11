import { NextRequest, NextResponse } from 'next/server';
import { sponsorServerService } from '@/services/server/sponsor.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await sponsorServerService.getSponsors();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const created = await sponsorServerService.createSponsor(body);
    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'sponsors',
      record_id: created.id,
      new_value: created
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
