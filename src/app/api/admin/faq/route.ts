import { NextRequest, NextResponse } from 'next/server';
import { faqServerService } from '@/services/server/faq.server.service';
import { auditServerService } from '@/services/server/audit.server.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await faqServerService.getFaqs(false);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await faqServerService.createFaq(body);

    await auditServerService.logAction({
      admin_name: 'Admin',
      action: 'CREATE',
      module: 'faqs',
      record_id: created.id,
      new_value: created
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
