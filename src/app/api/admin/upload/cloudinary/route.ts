import { NextRequest, NextResponse } from 'next/server';
import { mediaServerService } from '@/services/server/media.server.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || 'srikari_atirudram';
    const tags = body.tags || undefined;

    const authData = mediaServerService.generateUploadSignature(folder, tags);
    return NextResponse.json({ success: true, data: authData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
