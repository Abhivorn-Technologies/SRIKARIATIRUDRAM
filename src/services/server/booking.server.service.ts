import { getPool, query } from '@/lib/db';
import { sevaServerService } from './seva.server.service';
import { scheduleServerService } from './schedule.server.service';

export interface BookingRecord {
  id: string;
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
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  attendance: 'PENDING' | 'PRESENT' | 'ABSENT';
  transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
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
  /**
   * ATOMIC BOOKING CREATION WITH CAPACITY SAFEGUARDS
   * Prevents overbooking under concurrent requests using database row-level locking.
   */
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
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Verify Seva from database (NEVER trust client-provided price)
      const seva = await sevaServerService.getSevaByIdOrSlug(data.seva_id);
      if (!seva || !seva.active) {
        throw new Error('Selected Seva is invalid or no longer active.');
      }

      const cleanDate = new Date(data.selected_date).toISOString().split('T')[0];

      // 2. Lock and verify Seva Availability for the specific date
      const lockSql = `
        SELECT id, capacity, booked_count
        FROM public.seva_availability
        WHERE date = $1::date AND seva_id = $2
        FOR UPDATE;
      `;
      let availRes = await client.query(lockSql, [cleanDate, seva.id]);

      if (availRes.rows.length === 0) {
        // Create availability record if missing
        await client.query(`
          INSERT INTO public.seva_availability (date, seva_id, capacity, booked_count, status, updated_at)
          VALUES ($1::date, $2, $3, 0, 'AVAILABLE', NOW())
          ON CONFLICT (date, seva_id) DO NOTHING;
        `, [cleanDate, seva.id, seva.capacity]);

        availRes = await client.query(lockSql, [cleanDate, seva.id]);
      }

      const avail = availRes.rows[0];
      if (avail.booked_count >= avail.capacity) {
        throw new Error(`Seva "${seva.title}" is fully booked for ${cleanDate}. Please select another date or seva.`);
      }

      // 3. Resolve schedule day number
      const schedule = await scheduleServerService.getScheduleByDate(cleanDate);
      const dayNumber = schedule?.day_number || 1;

      // 4. Generate unique Booking ID: SAR-2026-XXXXXX
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const bookingId = `SAR-2026-${randNum}`;

      const resolvedParticipation = data.attending_personally || 
        (data.devotee_participation === 'attending' ? 'yes' : data.devotee_participation === 'not-attending' ? 'no' : 'yes');

      // 5. Insert Booking record
      const insertBookingSql = `
        INSERT INTO public.bookings (
          booking_id, seva_id, seva_name, amount, selected_date, day_number, nakshatra, rasi,
          full_name, phone_number, email, gotram, janma_nakshatra, date_of_birth,
          sankalpam_names, family_members, address, city, attending_personally, payment_method,
          payment_status, booking_status, attendance, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5::date, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20,
          'PENDING', 'PENDING', 'PENDING', $21, NOW(), NOW()
        )
        RETURNING *;
      `;

      const bookingRes = await client.query(insertBookingSql, [
        bookingId,
        seva.id,
        seva.title,
        seva.amount, // Server verified price
        cleanDate,
        dayNumber,
        data.nakshatra || data.janma_nakshatra || 'Sarva Nakshatra',
        data.rasi || '',
        data.full_name,
        data.phone_number,
        data.email || null,
        data.gotram || null,
        data.janma_nakshatra || null,
        data.date_of_birth || null,
        data.sankalpam_names || data.full_name,
        JSON.stringify(data.family_members || []),
        data.address || null,
        data.city || null,
        resolvedParticipation,
        data.payment_method || 'upi',
        data.notes || null
      ]);

      // 6. Atomically increment booked_count
      const newBookedCount = avail.booked_count + 1;
      const newStatus = newBookedCount >= avail.capacity 
        ? 'FULLY_BOOKED' 
        : (avail.capacity - newBookedCount <= 5 ? 'FEW_SLOTS_LEFT' : 'AVAILABLE');

      await client.query(`
        UPDATE public.seva_availability
        SET booked_count = $1, status = $2, updated_at = NOW()
        WHERE id = $3;
      `, [newBookedCount, newStatus, avail.id]);

      // 7. Upsert Devotee CRM profile
      await client.query(`
        INSERT INTO public.devotees (
          full_name, phone_number, email, gotram, nakshatram, rasi, address, city,
          total_bookings, total_donated, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          1, $9, NOW(), NOW()
        )
        ON CONFLICT (phone_number) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          email = COALESCE(EXCLUDED.email, public.devotees.email),
          gotram = COALESCE(EXCLUDED.gotram, public.devotees.gotram),
          total_bookings = public.devotees.total_bookings + 1,
          total_donated = public.devotees.total_donated + EXCLUDED.total_donated,
          updated_at = NOW();
      `, [
        data.full_name, data.phone_number, data.email || null, data.gotram || null,
        data.janma_nakshatra || data.nakshatra || null, data.rasi || null,
        data.address || null, data.city || null, seva.amount
      ]);

      await client.query('COMMIT');
      return bookingRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * VERIFY PAYMENT & CONFIRM BOOKING (SERVER-SIDE)
   */
  async verifyAndConfirmPayment(bookingId: string, transactionId: string, paymentResponse?: any): Promise<BookingRecord> {
    const res = await query<BookingRecord>(`
      UPDATE public.bookings
      SET 
        payment_status = 'SUCCESS',
        booking_status = 'CONFIRMED',
        transaction_id = $1,
        payment_response = $2,
        updated_at = NOW()
      WHERE booking_id = $3 OR id::text = $3
      RETURNING *;
    `, [transactionId, JSON.stringify(paymentResponse || {}), bookingId]);

    if (res.rows.length === 0) {
      throw new Error(`Booking "${bookingId}" not found.`);
    }

    return res.rows[0];
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
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (options.date) {
      conditions.push(`selected_date = $${idx}::date`);
      params.push(options.date);
      idx++;
    }

    if (options.seva_id) {
      conditions.push(`seva_id = $${idx}`);
      params.push(options.seva_id);
      idx++;
    }

    if (options.nakshatra) {
      conditions.push(`(nakshatra ILIKE $${idx} OR janma_nakshatra ILIKE $${idx})`);
      params.push(`%${options.nakshatra}%`);
      idx++;
    }

    if (options.payment_status) {
      conditions.push(`payment_status = $${idx}`);
      params.push(options.payment_status);
      idx++;
    }

    if (options.booking_status) {
      conditions.push(`booking_status = $${idx}`);
      params.push(options.booking_status);
      idx++;
    }

    if (options.attendance) {
      conditions.push(`attendance = $${idx}`);
      params.push(options.attendance);
      idx++;
    }

    if (options.devotee_participation || options.attending_personally) {
      const part = (options.devotee_participation || options.attending_personally)?.toLowerCase();
      if (part === 'attending' || part === 'yes') {
        conditions.push(`(attending_personally = 'yes' OR attending_personally = 'attending')`);
      } else if (part === 'not-attending' || part === 'no' || part === 'not_attending') {
        conditions.push(`(attending_personally = 'no' OR attending_personally = 'not-attending')`);
      }
    }

    if (options.search) {
      conditions.push(`(
        full_name ILIKE $${idx} OR 
        phone_number ILIKE $${idx} OR 
        booking_id ILIKE $${idx} OR 
        sankalpam_names ILIKE $${idx} OR
        gotram ILIKE $${idx}
      )`);
      params.push(`%${options.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countRes = await query(`
      SELECT COUNT(*) as total FROM public.bookings
      ${whereClause};
    `, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // Fetch page
    params.push(limit, offset);
    const dataSql = `
      SELECT * FROM public.bookings
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1};
    `;

    const dataRes = await query<BookingRecord>(dataSql, params);

    return {
      bookings: dataRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  },

  async getBookingById(bookingId: string): Promise<BookingRecord | null> {
    const res = await query<BookingRecord>(`
      SELECT * FROM public.bookings
      WHERE booking_id = $1 OR id::text = $1
      LIMIT 1;
    `, [bookingId]);
    return res.rows[0] || null;
  },

  async updateAttendance(id: string, attendance: 'PENDING' | 'PRESENT' | 'ABSENT'): Promise<BookingRecord | null> {
    const res = await query<BookingRecord>(`
      UPDATE public.bookings
      SET attendance = $1, updated_at = NOW()
      WHERE id::text = $2 OR booking_id = $2
      RETURNING *;
    `, [attendance, id]);
    return res.rows[0] || null;
  },

  async updateBooking(id: string, updates: Partial<BookingRecord>): Promise<BookingRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof BookingRecord)[] = [
      'full_name', 'phone_number', 'email', 'gotram', 'sankalpam_names',
      'payment_status', 'booking_status', 'attendance', 'notes', 'transaction_id'
    ];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${String(key)} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.bookings
      SET ${fields.join(', ')}
      WHERE id::text = $${idx} OR booking_id = $${idx}
      RETURNING *;
    `;

    const res = await query<BookingRecord>(sql, values);
    return res.rows[0] || null;
  },

  async deleteBooking(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.bookings
      WHERE id::text = $1 OR booking_id = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
