import { NextRequest, NextResponse } from 'next/server';
import { enquiryServerService } from '@/services/server/enquiry.server.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const enquiries = await enquiryServerService.getAllEnquiries(search);
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json({ success: false, error: 'Name, phone, and message are required' }, { status: 400 });
    }

    const created = await enquiryServerService.createEnquiry(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
