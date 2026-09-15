import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sevaServerService } from "@/services/server/seva.server.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const schedules = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();
    const availabilities = await db.collection('seva_availability').find({}).toArray();
    const allSevas = await sevaServerService.getAllSevas();
    const sevasMap = new Map(allSevas.map(s => [s.id, s]));

    const data = schedules.map(sc => {
      const dayAvails = availabilities.filter(sa => sa.date === sc.date);
      const assigned = dayAvails.map(sa => {
        const s = sevasMap.get(sa.seva_id);
        return {
          availability_id: sa.id || sa._id.toString(),
          seva_id: sa.seva_id,
          slug: s?.slug || sa.seva_id,
          title: s?.title || 'Seva',
          title_te: s?.title_te,
          short_desc: s?.short_desc,
          short_desc_te: s?.short_desc_te,
          amount: s?.amount || 0,
          category: s?.category || 'General',
          capacity: sa.capacity || 50,
          booked_count: sa.booked_count || 0,
          status: sa.status || 'AVAILABLE',
          available_slots: Math.max(0, (sa.capacity || 50) - (sa.booked_count || 0))
        };
      });

      return {
        day_number: sc.day_number,
        date: sc.date,
        date_display: sc.date_display,
        nakshatra: sc.nakshatra,
        day_type: sc.day_type,
        assigned_sevas: assigned
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/admin/schedule/sevas ERROR:", error);
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { availability_id } = body;
    if (!availability_id) {
      return NextResponse.json({ success: false, error: "availability_id is required" }, { status: 400 });
    }
    await db.collection('seva_availability').deleteOne({
      $or: [{ id: availability_id }, { _id: availability_id as any }]
    });
    return NextResponse.json({ success: true, message: "Seva removed from day" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { date, seva_id, capacity, status } = body;
    if (!date || !seva_id || capacity === undefined) {
      return NextResponse.json({ success: false, error: "date, seva_id, and capacity are required" }, { status: 400 });
    }
    const sevaStatus = status || 'AVAILABLE';
    const availId = `sa_${date}_${seva_id}`;
    const newDoc = {
      id: availId,
      date,
      seva_id,
      capacity: parseInt(String(capacity), 10),
      booked_count: 0,
      status: sevaStatus,
      updated_at: new Date().toISOString()
    };

    await db.collection('seva_availability').updateOne(
      { date, seva_id },
      { $set: newDoc },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: newDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { availability_id, status, capacity } = body;
    if (!availability_id) {
      return NextResponse.json({ success: false, error: "availability_id is required" }, { status: 400 });
    }
    const setFields: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) setFields.status = status;
    if (capacity !== undefined) setFields.capacity = parseInt(capacity, 10);

    const res = await db.collection('seva_availability').findOneAndUpdate(
      { $or: [{ id: availability_id }, { _id: availability_id as any }] },
      { $set: setFields },
      { returnDocument: 'after' }
    );
    return NextResponse.json({ success: true, data: res?.value });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}