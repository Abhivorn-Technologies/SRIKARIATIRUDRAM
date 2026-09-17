import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { scheduleServerService } from "@/services/server/schedule.server.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await scheduleServerService.getAllSchedules();
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

    // Handle synthetic IDs like everyday-2-ati-rudram-donation or special-2-sarpa-suktam-homam
    if (availability_id.startsWith('everyday-') || availability_id.startsWith('special-')) {
      const parts = availability_id.split('-');
      const dayNum = parseInt(parts[1], 10);
      const sevaId = parts.slice(2).join('-');

      const schedule = await db.collection('schedules').findOne({ day_number: dayNum });
      const date = schedule?.date || '';

      await db.collection('seva_availability').updateOne(
        { $or: [{ id: availability_id }, { date, seva_id: sevaId }] },
        {
          $set: {
            id: availability_id,
            date,
            day_number: dayNum,
            seva_id: sevaId,
            status: 'HIDDEN',
            updated_at: new Date().toISOString()
          }
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true, message: "Seva hidden from day" });
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
    const { date, day_number, seva_id, capacity, status } = body;
    if ((!date && day_number === undefined) || !seva_id || capacity === undefined) {
      return NextResponse.json({ success: false, error: "date or day_number, seva_id, and capacity are required" }, { status: 400 });
    }

    let targetDate = date;
    if (!targetDate && day_number !== undefined) {
      const sc = await db.collection('schedules').findOne({ day_number: parseInt(String(day_number), 10) });
      targetDate = sc?.date || '';
    }

    const sevaStatus = status || 'AVAILABLE';
    const availId = `sa_${targetDate}_${seva_id}`;
    const newDoc = {
      id: availId,
      date: targetDate,
      day_number: day_number !== undefined ? parseInt(String(day_number), 10) : undefined,
      seva_id,
      capacity: parseInt(String(capacity), 10),
      booked_count: 0,
      status: sevaStatus,
      updated_at: new Date().toISOString()
    };

    await db.collection('seva_availability').updateOne(
      { date: targetDate, seva_id },
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

    // Handle synthetic IDs like everyday-2-ati-rudram-donation or special-2-sarpa-suktam-homam
    if (availability_id.startsWith('everyday-') || availability_id.startsWith('special-')) {
      const parts = availability_id.split('-');
      const dayNum = parseInt(parts[1], 10);
      const sevaId = parts.slice(2).join('-');

      const schedule = await db.collection('schedules').findOne({ day_number: dayNum });
      const targetDate = schedule?.date || '';

      await db.collection('seva_availability').updateOne(
        { $or: [{ id: availability_id }, { date: targetDate, seva_id: sevaId }] },
        {
          $set: {
            id: availability_id,
            date: targetDate,
            day_number: dayNum,
            seva_id: sevaId,
            booked_count: 0,
            ...setFields
          }
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true, message: "Availability updated" });
    }

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