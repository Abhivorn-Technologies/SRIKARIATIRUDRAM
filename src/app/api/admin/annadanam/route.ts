import { NextRequest, NextResponse } from 'next/server';
import { annadanamServerService } from '@/services/server/annadanam.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;

    const list = await annadanamServerService.getAllAnnadanam(date);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.sponsor_name || !body.date) {
      return NextResponse.json({ success: false, error: 'sponsor_name and date are required' }, { status: 400 });
    }

    const created = await annadanamServerService.createAnnadanam(body);
    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'annadanam',
      record_id: created.id,
      new_value: created
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
