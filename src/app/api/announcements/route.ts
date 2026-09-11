import { NextResponse } from 'next/server';
import { announcementServerService } from '@/services/server/announcement.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await announcementServerService.getAnnouncements(true);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
