import { NextResponse } from 'next/server';
import { scheduleServerService } from '@/services/server/schedule.server.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const list = await scheduleServerService.getAllSchedules();
    return NextResponse.json({ success: true, data: list }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
