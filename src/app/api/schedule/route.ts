import { NextResponse } from 'next/server';
import { scheduleServerService } from '@/services/server/schedule.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await scheduleServerService.getAllSchedules();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
