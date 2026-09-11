import { NextResponse } from 'next/server';
import { liveServerService } from '@/services/server/live.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await liveServerService.getLiveConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
