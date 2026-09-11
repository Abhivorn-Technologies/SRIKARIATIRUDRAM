import { NextRequest, NextResponse } from 'next/server';
import { bookingServerService } from '@/services/server/booking.server.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Server-Side Validation
    if (!body.seva_id) {
      return NextResponse.json({ success: false, error: 'Please select a Seva.' }, { status: 400 });
    }
    if (!body.selected_date) {
      return NextResponse.json({ success: false, error: 'Please select a programme date.' }, { status: 400 });
    }
    if (!body.full_name || body.full_name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Please provide a valid Devotee Full Name.' }, { status: 400 });
    }
    if (!body.phone_number || body.phone_number.trim().length < 8) {
      return NextResponse.json({ success: false, error: 'Please provide a valid Contact Phone Number.' }, { status: 400 });
    }

    // 2. Atomic Booking Execution (verifies database price & locks availability slot)
    const booking = await bookingServerService.createBooking({
      seva_id: body.seva_id,
      selected_date: body.selected_date,
      nakshatra: body.nakshatra || body.janma_nakshatra || 'Rohini',
      rasi: body.rasi,
      full_name: body.full_name.trim(),
      phone_number: body.phone_number.trim(),
      email: body.email?.trim(),
      gotram: body.gotram?.trim(),
      janma_nakshatra: body.janma_nakshatra || body.nakshatra,
      date_of_birth: body.date_of_birth,
      sankalpam_names: body.sankalpam_names || body.family_members || body.full_name,
      family_members: body.family_members_list || [],
      address: body.address,
      city: body.city,
      attending_personally: body.attending_personally || body.attendingPersonally,
      devotee_participation: body.devotee_participation || body.devoteeParticipation,
      payment_method: body.payment_method || 'upi',
      notes: body.notes
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking initialized successfully. Please complete payment.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Booking Creation Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unable to process booking. Please try again.'
    }, { status: 400 });
  }
}
