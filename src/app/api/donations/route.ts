import { NextRequest, NextResponse } from 'next/server';
import { donationServerService } from '@/services/server/donation.server.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donor_name, mobile, email, amount, purpose, gotram, nakshatram, address, transaction_id, notes } = body;

    if (!donor_name || !mobile || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Donor Name, Mobile Number, and valid Amount are required.' },
        { status: 400 }
      );
    }

    const donation = await donationServerService.createDonation({
      donor_name,
      mobile,
      email: email || undefined,
      amount: Number(amount),
      purpose: purpose || 'General Mahayajnam Donation',
      gotram: gotram || undefined,
      nakshatram: nakshatram || undefined,
      address: address || undefined,
      payment_status: 'SUCCESS',
      transaction_id: transaction_id || `RAZORPAY_${Date.now()}`,
      notes: notes || undefined,
    });

    return NextResponse.json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    console.error('Error creating donation record:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record donation' },
      { status: 500 }
    );
  }
}
