import { NextRequest, NextResponse } from 'next/server';
import { donationServerService } from '@/services/server/donation.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const record = await donationServerService.getDonationById(params.id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Donation record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const oldVal = await donationServerService.getDonationById(params.id);
    const updated = await donationServerService.updateDonation(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Donation record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'donations',
      record_id: params.id,
      old_value: oldVal,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oldVal = await donationServerService.getDonationById(params.id);
    const ok = await donationServerService.deleteDonation(params.id);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Donation record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'donations',
      record_id: params.id,
      old_value: oldVal
    });

    return NextResponse.json({ success: true, message: 'Donation record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
