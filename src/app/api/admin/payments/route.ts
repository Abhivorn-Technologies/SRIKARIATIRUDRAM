import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const bookings = await db.collection('bookings').find({}).toArray();
    const annadanams = await db.collection('annadanam').find({}).toArray();
    const donations = await db.collection('donations').find({}).toArray();

    const bookingRecords = bookings.map((b: any) => ({
      reference_id: b.booking_id || b.id || b._id.toString(),
      devotee: b.full_name,
      mobile: b.phone_number,
      purpose: b.seva_name,
      amount: Number(b.amount || 0),
      payment_status: b.payment_status,
      transaction_id: b.transaction_id,
      gateway: b.payment_method || 'UPI',
      category: 'BOOKING',
      created_at: b.created_at
    }));

    const annadanamRecords = annadanams.map((a: any) => ({
      reference_id: a.transaction_id || `ANN-${a.id || a._id.toString()}`,
      devotee: a.sponsor_name || a.full_name,
      mobile: a.mobile || a.phone_number,
      purpose: 'Maha Annadanam Sponsorship',
      amount: Number(a.amount || 0),
      payment_status: a.payment_status || 'CONFIRMED',
      transaction_id: a.transaction_id,
      gateway: 'Razorpay / UPI',
      category: 'ANNADANAM',
      created_at: a.created_at
    }));

    const donationRecords = donations.map((d: any) => ({
      reference_id: d.donation_id || `DON-${d.id || d._id.toString()}`,
      devotee: d.donor_name || d.full_name,
      mobile: d.mobile || d.phone_number,
      purpose: d.purpose || 'General Donation',
      amount: Number(d.amount || 0),
      payment_status: d.payment_status || 'CONFIRMED',
      transaction_id: d.transaction_id,
      gateway: 'Razorpay Online',
      category: 'DONATION',
      created_at: d.created_at
    }));

    const combined = [
      ...bookingRecords,
      ...annadanamRecords,
      ...donationRecords
    ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    const grossCollections = combined.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const successfulTxnsCount = combined.filter((i) => i.payment_status === 'SUCCESS' || i.payment_status === 'CONFIRMED').length;
    const pendingTxnsCount = combined.filter((i) => i.payment_status === 'PENDING').length;

    return NextResponse.json({
      success: true,
      stats: {
        grossCollections,
        successfulTxnsCount,
        pendingTxnsCount,
        totalTxnsCount: combined.length,
      },
      data: combined,
    });
  } catch (error: any) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
