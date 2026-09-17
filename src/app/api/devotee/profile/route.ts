import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone') || '';
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanPhone) {
      return NextResponse.json({ success: false, error: 'Mobile number is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    const devotee = await db.collection('devotees').findOne({
      $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }]
    });

    if (!devotee) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: devotee._id.toString(),
        fullName: devotee.full_name || devotee.name || '',
        phone: devotee.phone_number || devotee.mobile || cleanPhone,
        email: devotee.email || '',
        gotram: devotee.gotram || '',
        nakshatra: devotee.nakshatram || devotee.nakshatra || '',
        rasi: devotee.rasi || '',
        address: devotee.address || '',
        city: devotee.city || '',
        pincode: devotee.pincode || '',
        familyMembers: devotee.family_members || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, full_name, email, gotram, nakshatram, rasi, address, city, pincode, family_members } = body;

    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone) {
      return NextResponse.json({ success: false, error: 'Mobile phone number is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    const updateDoc: Record<string, any> = {
      phone_number: cleanPhone,
      mobile: cleanPhone,
      updated_at: new Date()
    };

    if (full_name !== undefined) updateDoc.full_name = full_name;
    if (email !== undefined) updateDoc.email = email;
    if (gotram !== undefined) updateDoc.gotram = gotram;
    if (nakshatram !== undefined) updateDoc.nakshatram = nakshatram;
    if (rasi !== undefined) updateDoc.rasi = rasi;
    if (address !== undefined) updateDoc.address = address;
    if (city !== undefined) updateDoc.city = city;
    if (pincode !== undefined) updateDoc.pincode = pincode;
    if (family_members !== undefined) updateDoc.family_members = family_members;

    const res = await db.collection('devotees').findOneAndUpdate(
      { $or: [{ phone_number: phoneRegex }, { mobile: phoneRegex }, { phone: phoneRegex }] },
      { $set: updateDoc },
      { upsert: true, returnDocument: 'after' }
    );

    const doc = (res as any)?.value || res;

    return NextResponse.json({
      success: true,
      message: 'Devotee profile updated successfully in MongoDB',
      data: doc
    });
  } catch (error: any) {
    console.error('Update Devotee Profile Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
