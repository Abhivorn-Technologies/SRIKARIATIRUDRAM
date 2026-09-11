import { NextRequest, NextResponse } from 'next/server';
import { devoteeServerService } from '@/services/server/devotee.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await devoteeServerService.getDevoteeById(params.id);
    if (!data.devotee) {
      return NextResponse.json({ success: false, error: 'Devotee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await devoteeServerService.updateDevotee(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Devotee not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
