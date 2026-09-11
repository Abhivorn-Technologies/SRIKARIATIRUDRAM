import { NextRequest, NextResponse } from 'next/server';
import { mediaServerService } from '@/services/server/media.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await mediaServerService.getMediaAssets('video');
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url && !body.secure_url) {
      return NextResponse.json({ success: false, error: 'url is required' }, { status: 400 });
    }

    const created = await mediaServerService.createMediaAsset({
      ...body,
      media_type: 'video'
    });

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'videos',
      record_id: created.id,
      new_value: created
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
