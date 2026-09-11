import { NextRequest, NextResponse } from 'next/server';
import { nakshatraServerService } from '@/services/server/nakshatra.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { nakshatra: string } }) {
  try {
    const rawNakshatra = decodeURIComponent(params.nakshatra);
    const result = await nakshatraServerService.getNakshatraProgramme(rawNakshatra);

    if (!result) {
      return NextResponse.json(
        { success: false, error: `Nakshatra "${rawNakshatra}" not found in Srikari Yajna schedule.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/nakshatra/[nakshatra]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
