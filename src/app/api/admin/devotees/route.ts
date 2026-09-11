import { NextRequest, NextResponse } from 'next/server';
import { devoteeServerService } from '@/services/server/devotee.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const devotees = await devoteeServerService.getDevotees(search);
    return NextResponse.json({ success: true, data: devotees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
