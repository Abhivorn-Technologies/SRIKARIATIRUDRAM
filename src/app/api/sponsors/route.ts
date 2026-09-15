import { NextResponse } from 'next/server';
import { sponsorServerService } from '@/services/server/sponsor.server.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sponsors = await sponsorServerService.getSponsors(true);
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
