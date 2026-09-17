import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateDevoteePhone, validateDevoteePassword, hashPassword } from '@/lib/devotee-auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, fullName, password, confirmPassword, gotram, nakshatra, rasi, email } = await req.json();

    // 1. Validate Phone
    const phoneVal = validateDevoteePhone(phone || '');
    if (!phoneVal.isValid) {
      return NextResponse.json({
        success: false,
        error: phoneVal.errorMessage || 'Please enter a valid mobile number.'
      }, { status: 400 });
    }

    // 2. Validate Password strength via @organization-wide-standards/input-validations
    const passVal = validateDevoteePassword(password || '');
    if (!passVal.isValid) {
      return NextResponse.json({
        success: false,
        error: passVal.errorMessage || 'Password does not meet validation requirements.'
      }, { status: 400 });
    }

    // 3. Confirm Password Match
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Passwords do not match. Please ensure Password and Confirm Password match.'
      }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const { db } = await connectToDatabase();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    const { hash, salt } = hashPassword(password);

    const existing = await db.collection('devotees').findOne({
      $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }]
    });

    const updatedProfile = {
      phone_number: cleanPhone,
      mobile: cleanPhone,
      full_name: fullName || existing?.full_name || existing?.fullName || 'Sacred Devotee',
      email: email || existing?.email || '',
      gotram: gotram || existing?.gotram || '',
      nakshatra: nakshatra || existing?.nakshatra || '',
      rasi: rasi || existing?.rasi || '',
      has_password: true,
      password_hash: hash,
      password_salt: salt,
      updated_at: new Date()
    };

    if (existing) {
      await db.collection('devotees').updateOne(
        { _id: existing._id },
        { $set: updatedProfile }
      );
    } else {
      await db.collection('devotees').insertOne({
        ...updatedProfile,
        created_at: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        phone: cleanPhone,
        fullName: updatedProfile.full_name,
        email: updatedProfile.email,
        gotram: updatedProfile.gotram,
        nakshatra: updatedProfile.nakshatra,
        rasi: updatedProfile.rasi
      },
      message: 'Password set successfully! Devotee account registered.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
