import { connectToDatabase } from '@/lib/mongodb';
import { sevaServerService } from './seva.server.service';
import { scheduleServerService } from './schedule.server.service';

export interface BookingRecord {
  id?: string;
  booking_id: string;
  seva_id: string;
  seva_name: string;
  amount: number;
  selected_date: string;
  day_number?: number;
  nakshatra: string;
  rasi?: string;
  time_slot?: string;
  full_name: string;
  phone_number: string;
  email?: string;
  gotram?: string;
  janma_nakshatra?: string;
  date_of_birth?: string;
  sankalpam_names?: string;
  family_members?: any[];
  address?: string;
  city?: string;
  country?: string;
  attending_personally?: string;
  delivery_option?: string;
  payment_method?: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CONFIRMED';
  booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  attendance: 'PENDING' | 'PRESENT' | 'ABSENT';
  transaction_id?: string;
  notes?: string;
  created_at: Date | string;
  updated_at?: Date | string;
}

export interface BookingListOptions {
  page?: number;
  limit?: number;
  date?: string;
  nakshatra?: string;
  seva_id?: string;
  payment_status?: string;
  booking_status?: string;
  attendance?: string;
  devotee_participation?: string;
  attending_personally?: string;
  search?: string;
}

export const bookingServerService = {
  async createBooking(data: {
    seva_id: string;
    selected_date: string;
    nakshatra: string;
    rasi?: string;
    full_name: string;
    phone_number: string;
    email?: string;
    gotram?: string;
    janma_nakshatra?: string;
    date_of_birth?: string;
    sankalpam_names?: string;
    family_members?: any[];
    address?: string;
    city?: string;
    attending_personally?: string;
    devotee_participation?: 'attending' | 'not-attending' | string;
    payment_method?: string;
    notes?: string;
  }): Promise<BookingRecord> {
    const { db } = await connectToDatabase();

    // 1. Verify Seva from database
    const seva = await sevaServerService.getSevaByIdOrSlug(data.seva_id);
    if (!seva || !seva.active) {
      throw new Error('Selected Seva is invalid or no longer active.');
    }

    const cleanDate = new Date(data.selected_date).toISOString().split('T')[0];

    // 2. Resolve schedule day number
    const schedule = await scheduleServerService.getScheduleByDate(cleanDate);
    const dayNumber = schedule?.day_number || 1;

    // 3. Generate unique Booking ID: SAR-2026-XXXXXX
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `SAR-2026-${randNum}`;

    const resolvedParticipation = data.attending_personally || 
      (data.devotee_participation === 'attending' ? 'yes' : data.devotee_participation === 'not-attending' ? 'no' : 'yes');

    const newBooking: BookingRecord = {
      booking_id: bookingId,
      seva_id: seva.id,
      seva_name: seva.title || (seva as any).name || 'Seva',
      amount: Number(seva.amount || (seva as any).price || 0),
      selected_date: cleanDate,
      day_number: dayNumber,
      nakshatra: data.nakshatra || data.janma_nakshatra || 'Sarva Nakshatra',
      rasi: data.rasi || '',
      full_name: data.full_name,
      phone_number: data.phone_number,
      email: data.email || undefined,
      gotram: data.gotram || undefined,
      janma_nakshatra: data.janma_nakshatra || undefined,
      date_of_birth: data.date_of_birth || undefined,
      sankalpam_names: data.sankalpam_names || data.full_name,
      family_members: data.family_members || [],
      address: data.address || undefined,
      city: data.city || undefined,
      attending_personally: resolvedParticipation,
      payment_method: data.payment_method || 'upi',
      payment_status: 'CONFIRMED',
      booking_status: 'CONFIRMED',
      attendance: 'PENDING',
      notes: data.notes || undefined,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('bookings').insertOne(newBooking as any);

    // Update or insert Devotee record
    await db.collection('devotees').updateOne(
      { phone_number: data.phone_number },
      {
        $set: {
          full_name: data.full_name,
          email: data.email || null,
          gotram: data.gotram || null,
          nakshatram: data.janma_nakshatra || data.nakshatra || null,
          rasi: data.rasi || null,
          address: data.address || null,
          city: data.city || null,
          updated_at: new Date()
        },
        $inc: { total_bookings: 1, total_donated: Number(seva.amount || 0) },
        $setOnInsert: { created_at: new Date() }
      },
      { upsert: true }
    );

    return newBooking;
  },

  async verifyAndConfirmPayment(bookingId: string, transactionId: string, paymentResponse?: any): Promise<BookingRecord> {
    const { db } = await connectToDatabase();
    const result = await db.collection('bookings').findOneAndUpdate(
      { $or: [{ booking_id: bookingId }, { id: bookingId }] },
      {
        $set: {
          payment_status: 'SUCCESS',
          booking_status: 'CONFIRMED',
          transaction_id: transactionId,
          payment_response: paymentResponse || {},
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      // Find directly if value not returned
      const doc = await db.collection('bookings').findOne({ booking_id: bookingId });
      if (doc) return doc as any;
      throw new Error(`Booking "${bookingId}" not found.`);
    }

    return result.value as any;
  },

  async getBookings(options: BookingListOptions = {}): Promise<{
    bookings: BookingRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { db } = await connectToDatabase();
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (options.date) filter.selected_date = options.date;
    if (options.seva_id) filter.seva_id = options.seva_id;
    if (options.payment_status) filter.payment_status = options.payment_status;
    if (options.booking_status) filter.booking_status = options.booking_status;
    if (options.attendance) filter.attendance = options.attendance;

    if (options.search) {
      const q = new RegExp(options.search, 'i');
      filter.$or = [
        { full_name: q },
        { phone_number: q },
        { booking_id: q },
        { sankalpam_names: q },
        { gotram: q }
      ];
    }

    const total = await db.collection('bookings').countDocuments(filter);
    const docs = await db.collection('bookings')
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      bookings: docs as any,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  },

  async getBookingById(bookingId: string): Promise<BookingRecord | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('bookings').findOne({
      $or: [{ booking_id: bookingId }, { id: bookingId }]
    });
    return doc as any;
  },

  async updateAttendance(id: string, attendance: 'PENDING' | 'PRESENT' | 'ABSENT'): Promise<BookingRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('bookings').findOneAndUpdate(
      { $or: [{ booking_id: id }, { id }] },
      { $set: { attendance, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res?.value as any;
  },

  async updateBooking(id: string, updates: Partial<BookingRecord>): Promise<BookingRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('bookings').findOneAndUpdate(
      { $or: [{ booking_id: id }, { id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res?.value as any;
  },

  async deleteBooking(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('bookings').deleteOne({
      $or: [{ booking_id: id }, { id }]
    });
    return res.deletedCount > 0;
  }
};
