import { NextRequest, NextResponse } from 'next/server';
import { faqServerService } from '@/services/server/faq.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await faqServerService.updateFaq(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'FAQ item not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'UPDATE',
      module: 'faqs',
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
    const ok = await faqServerService.deleteFaq(params.id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'FAQ item not found' }, { status: 404 });
    }

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'DELETE',
      module: 'faqs',
      record_id: params.id
    });

    return NextResponse.json({ success: true, message: 'FAQ deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
