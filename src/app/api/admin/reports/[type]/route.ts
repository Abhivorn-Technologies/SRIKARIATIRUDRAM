import { NextRequest, NextResponse } from 'next/server';
import { reportServerService } from '@/services/server/report.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const type = params.type.toLowerCase();

    if (type === 'sankalpam') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const data = await reportServerService.getSankalpamReport(date);
      return NextResponse.json({ success: true, data });
    }

    if (type === 'bookings') {
      const dateFrom = searchParams.get('date_from') || undefined;
      const dateTo = searchParams.get('date_to') || undefined;
      const sevaId = searchParams.get('seva_id') || undefined;
      const paymentStatus = searchParams.get('payment_status') || undefined;

      const data = await reportServerService.getBookingsReport({ dateFrom, dateTo, sevaId, paymentStatus });
      return NextResponse.json({ success: true, data });
    }

    if (type === 'donations') {
      const dateFrom = searchParams.get('date_from') || undefined;
      const dateTo = searchParams.get('date_to') || undefined;
      const purpose = searchParams.get('purpose') || undefined;

      const data = await reportServerService.getDonationsReport({ dateFrom, dateTo, purpose });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, error: `Unknown report type "${type}"` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
