import { NextRequest, NextResponse } from 'next/server';
import { enquiryServerService } from '@/services/server/enquiry.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await enquiryServerService.updateEnquiryStatus(params.id, body.status || 'RESPONDED');

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enquiry record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'enquiries',
      record_id: params.id,
      new_value: updated
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ok = await enquiryServerService.deleteEnquiry(params.id);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Enquiry record not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'enquiries',
      record_id: params.id
    });

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
