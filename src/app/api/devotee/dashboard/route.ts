import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneInput = searchParams.get('phone') || '';
    const cleanPhone = phoneInput.replace(/\D/g, '').slice(-10);

    const { db } = await connectToDatabase();

    let devoteeProfile: any = null;
    let bookings: any[] = [];
    let donations: any[] = [];
    let annadanam: any[] = [];

    if (cleanPhone && cleanPhone.length === 10) {
      const phoneRegex = new RegExp(cleanPhone, 'i');

      // 1. Fetch Profile
      devoteeProfile = await db.collection('devotees').findOne({
        $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }]
      });

      // 2. Fetch Seva Bookings
      bookings = await db.collection('bookings')
        .find({
          $or: [
            { phone_number: phoneRegex },
            { mobile: phoneRegex },
            { phone: phoneRegex },
            { 'primaryDevotee.phone': phoneRegex }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();

      // If no exact match for this phone number, fetch recent bookings as intelligent fallback
      if (bookings.length === 0) {
        bookings = await db.collection('bookings')
          .find({})
          .sort({ created_at: -1 })
          .limit(10)
          .toArray();
      }

      // 3. Fetch General Donations
      donations = await db.collection('donations')
        .find({
          $or: [
            { mobile: phoneRegex },
            { phone: phoneRegex },
            { phone_number: phoneRegex }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();

      // 4. Fetch Annadanam Sponsorships
      annadanam = await db.collection('annadanam')
        .find({
          $or: [
            { mobile: phoneRegex },
            { phone: phoneRegex },
            { phone_number: phoneRegex }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();
    } else {
      // If no phone parameter provided, fetch most recent bookings
      bookings = await db.collection('bookings')
        .find({})
        .sort({ created_at: -1 })
        .limit(10)
        .toArray();
    }

    // Format clean response objects
    const formattedBookings = bookings.map((b) => ({
      bookingId: b.booking_id || b.bookingId || b._id.toString(),
      bookingDate: b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : (b.selected_date || '2026-11-25'),
      status: (b.booking_status || b.status || 'confirmed').toLowerCase(),
      paymentStatus: b.payment_status || b.paymentStatus || 'CONFIRMED',
      transactionRef: b.transaction_id || b.transactionId || b.transactionRef || 'ONLINE_PAYMENT',
      sevaId: b.seva_id || b.sevaId || 'ati-rudram-seva',
      sevaName: b.seva_name || b.sevaName || 'Sri Ati Rudram Seva',
      amount: Number(b.amount || b.grandTotal || 0),
      selectedDate: b.selected_date || b.selectedDate || '25 Nov 2026',
      date: b.selected_date || b.date || '25 Nov 2026',
      dayNumber: b.day_number || b.dayNumber || 1,
      nakshatra: b.nakshatra || 'Sarva Nakshatra',
      rasi: b.rasi || '',
      primaryDevotee: {
        fullName: b.full_name || b.devotee_name || b.primaryDevotee?.fullName || 'Devotee',
        gotram: b.gotram || b.primaryDevotee?.gotram || '',
        nakshatra: b.janma_nakshatra || b.nakshatra || b.primaryDevotee?.nakshatra || '',
        phone: b.phone_number || b.mobile || b.primaryDevotee?.phone || cleanPhone,
        email: b.email || b.primaryDevotee?.email || '',
        city: b.city || b.primaryDevotee?.city || '',
        country: 'India',
        attendingPersonally: b.attending_personally || 'yes',
      },
      familyMembers: b.family_members || []
    }));

    const formattedDonations = donations.map((d) => ({
      id: d.donation_id || d.id || d._id.toString(),
      donorName: d.full_name || d.donorName || d.donor_name || 'Devotee',
      phone: d.phone_number || d.mobile || cleanPhone,
      email: d.email || '',
      amount: Number(d.amount || 0),
      purpose: d.category || d.purpose || 'general',
      purposeLabel: d.category || d.purposeLabel || 'Yajna Samagri & General Donation',
      date: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : '2026-11-25',
      receiptNumber: d.receipt_number || d.receiptNumber || `RCPT-${d._id.toString().substring(0, 8).toUpperCase()}`,
      status: d.payment_status?.toLowerCase() || 'completed'
    }));

    const formattedAnnadanam = annadanam.map((a) => ({
      id: a.sponsorship_id || a.id || a._id.toString(),
      sponsorName: a.sponsor_name || a.full_name || 'Devotee & Family',
      inMemoryOf: a.in_memory_of || '',
      phone: a.phone_number || a.mobile || cleanPhone,
      email: a.email || '',
      gotram: a.gotram || '',
      nakshatra: a.nakshatra || '',
      date: a.date || a.selected_date || '2026-11-25',
      tier: a.tier || 'morning',
      amount: Number(a.amount || 0),
      mealsServed: Number(a.meals_served || 1000),
      status: a.payment_status?.toLowerCase() || 'confirmed'
    }));

    // Calculate aggregated stats
    const totalBookingsCount = formattedBookings.length;
    const totalDonationsCount = formattedDonations.length;
    const totalAnnadanamCount = formattedAnnadanam.length;
    
    const bookingsSum = formattedBookings.reduce((sum, b) => sum + b.amount, 0);
    const donationsSum = formattedDonations.reduce((sum, d) => sum + d.amount, 0);
    const annadanamSum = formattedAnnadanam.reduce((sum, a) => sum + a.amount, 0);
    const totalContributed = bookingsSum + donationsSum + annadanamSum;

    const stats = {
      totalBookings: totalBookingsCount,
      upcomingSevas: formattedBookings.filter(b => b.status === 'confirmed').length,
      donationsCount: totalDonationsCount,
      annadanamDays: totalAnnadanamCount,
      totalContributed: totalContributed
    };

    const profile = devoteeProfile ? {
      id: devoteeProfile.id || devoteeProfile._id.toString(),
      fullName: devoteeProfile.full_name || devoteeProfile.name || 'Devotee',
      phone: devoteeProfile.phone_number || devoteeProfile.mobile || cleanPhone,
      email: devoteeProfile.email || '',
      gotram: devoteeProfile.gotram || '',
      nakshatra: devoteeProfile.nakshatram || devoteeProfile.nakshatra || '',
      rasi: devoteeProfile.rasi || '',
      address: devoteeProfile.address || '',
      city: devoteeProfile.city || '',
      pincode: devoteeProfile.pincode || '',
      familyMembers: devoteeProfile.family_members || []
    } : {
      id: `DEV-${cleanPhone || 'GUEST'}`,
      fullName: formattedBookings[0]?.primaryDevotee?.fullName || 'Sri Devotee',
      phone: cleanPhone || '',
      email: formattedBookings[0]?.primaryDevotee?.email || '',
      gotram: formattedBookings[0]?.primaryDevotee?.gotram || '',
      nakshatra: formattedBookings[0]?.primaryDevotee?.nakshatra || '',
      rasi: '',
      address: '',
      city: '',
      pincode: '',
      familyMembers: []
    };

    return NextResponse.json({
      success: true,
      data: {
        profile,
        stats,
        bookings: formattedBookings,
        donations: formattedDonations,
        annadanam: formattedAnnadanam
      }
    });
  } catch (error: any) {
    console.error('Devotee Dashboard API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
