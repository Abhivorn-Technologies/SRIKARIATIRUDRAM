import { NextRequest, NextResponse } from 'next/server';
import { donationServerService } from '@/services/server/donation.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const purpose = searchParams.get('purpose') || undefined;
    const search = searchParams.get('search') || undefined;

    const list = await donationServerService.getDonations(purpose, search);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.donor_name || !body.amount) {
      return NextResponse.json({ success: false, error: 'donor_name and amount are required' }, { status: 400 });
    }

    const created = await donationServerService.createDonation(body);
    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'donations',
      record_id: created.donation_id,
      new_value: created
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
