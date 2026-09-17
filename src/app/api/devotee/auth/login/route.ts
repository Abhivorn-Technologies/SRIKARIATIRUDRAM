import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateDevoteePhone, verifyPassword } from '@/lib/devotee-auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    // 1. Validate Phone
    const phoneVal = validateDevoteePhone(phone || '');
    if (!phoneVal.isValid) {
      return NextResponse.json({
        success: false,
        error: phoneVal.errorMessage || 'Please enter a valid mobile number.'
      }, { status: 400 });
    }

    if (!password || !password.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Please enter your account password.'
      }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const { db } = await connectToDatabase();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    const devotee = await db.collection('devotees').findOne({
      $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }]
    });

    if (!devotee) {
      return NextResponse.json({
        success: false,
        requireSetup: true,
        error: 'No password set for this mobile number yet. Switching to Sign Up to set your password.'
      }, { status: 404 });
    }

    if (!devotee.has_password || !devotee.password_hash || !devotee.password_salt) {
      return NextResponse.json({
        success: false,
        requireSetup: true,
        error: 'Password not set for this account yet. Please set your password first.'
      }, { status: 400 });
    }

    const isMatch = verifyPassword(password, devotee.password_hash, devotee.password_salt);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        error: 'Incorrect password. Please enter the correct password.'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        phone: cleanPhone,
        fullName: devotee.full_name || devotee.fullName || devotee.name || 'Sacred Devotee',
        email: devotee.email || '',
        gotram: devotee.gotram || '',
        nakshatra: devotee.nakshatra || '',
        rasi: devotee.rasi || ''
      },
      message: 'Devotee login successful!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
