import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateDevoteePhone } from '@/lib/devotee-auth';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    const phoneValidation = validateDevoteePhone(phone || '');
    if (!phoneValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: phoneValidation.errorMessage || 'Invalid phone number format.'
      }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const { db } = await connectToDatabase();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    const devotee = await db.collection('devotees').findOne({
      $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }]
    });

    if (devotee && devotee.has_password && devotee.password_hash) {
      return NextResponse.json({
        success: true,
        exists: true,
        hasPassword: true,
        fullName: devotee.full_name || devotee.fullName || devotee.name || '',
        message: 'Devotee found. Please enter your password to log in.'
      });
    }

    return NextResponse.json({
      success: true,
      exists: Boolean(devotee),
      hasPassword: false,
      fullName: devotee?.full_name || devotee?.fullName || devotee?.name || '',
      message: 'Password setup required for this mobile number.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
