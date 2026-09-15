import { connectToDatabase } from '@/lib/mongodb';

export const reportServerService = {
  /**
   * Sankalpam report for Vedic Priests on designated date
   */
  async getSankalpamReport(paramDate?: string, dayNumber?: number) {
    const { db } = await connectToDatabase();
    let cleanDate: string | null = null;

    if (paramDate) {
      try {
        cleanDate = new Date(paramDate).toISOString().split('T')[0];
      } catch (e) {
        cleanDate = null;
      }
    }

    if (!cleanDate && dayNumber) {
      const sched = await db.collection('schedules').findOne({ day_number: dayNumber });
      if (sched && sched.date) {
        cleanDate = new Date(sched.date).toISOString().split('T')[0];
      }
    }

    // Default fallback to Yagnam Day 1 (2026-11-25) if date invalid
    if (!cleanDate) {
      cleanDate = '2026-11-25';
    }

    const bookings = await db.collection('bookings').find({
      selected_date: cleanDate,
      payment_status: { $in: ['SUCCESS', 'CONFIRMED', 'success', 'confirmed'] }
    }).sort({ created_at: 1 }).toArray();

    const records = bookings.map((b: any, index: number) => ({
      s_no: index + 1,
      booking_id: b.booking_id || b.id || b._id.toString(),
      devotee_name: b.full_name,
      gotram: b.gotram || 'Not Specified',
      nakshatram: b.janma_nakshatra || b.nakshatra || 'Sarva Nakshatra',
      rasi: b.rasi || 'Not Specified',
      sankalpam_names: b.sankalpam_names || b.full_name,
      seva: b.seva_name,
      amount: b.amount,
      mobile: b.phone_number,
      attending_personally: b.attending_personally,
      attendance: b.attendance,
      payment_status: b.payment_status,
      created_at: b.created_at
    }));

    const scheduleDoc = await db.collection('schedules').findOne({ date: cleanDate });

    return {
      date: cleanDate,
      schedule: scheduleDoc ? {
        day_number: scheduleDoc.day_number,
        date_display: scheduleDoc.date_display,
        nakshatra: scheduleDoc.nakshatra,
        day_type: scheduleDoc.day_type,
        title: scheduleDoc.title,
        special_programme: scheduleDoc.special_programme
      } : null,
      totalSankalpams: records.length,
      records
    };
  },

  /**
   * Financial & Bookings aggregated report
   */
  async getBookingsReport(filters: { dateFrom?: string; dateTo?: string; sevaId?: string; paymentStatus?: string }) {
    const { db } = await connectToDatabase();
    const queryFilter: any = {};

    if (filters.dateFrom || filters.dateTo) {
      queryFilter.selected_date = {};
      if (filters.dateFrom) queryFilter.selected_date.$gte = filters.dateFrom;
      if (filters.dateTo) queryFilter.selected_date.$lte = filters.dateTo;
    }

    if (filters.sevaId) {
      queryFilter.seva_id = filters.sevaId;
    }

    if (filters.paymentStatus) {
      queryFilter.payment_status = filters.paymentStatus;
    }

    const docs = await db.collection('bookings')
      .find(queryFilter)
      .sort({ selected_date: 1, created_at: 1 })
      .toArray();

    const records = docs.map((b: any) => ({
      booking_id: b.booking_id || b.id || b._id.toString(),
      created_at: b.created_at,
      selected_date: b.selected_date,
      seva_name: b.seva_name,
      amount: b.amount,
      full_name: b.full_name,
      phone_number: b.phone_number,
      gotram: b.gotram,
      nakshatra: b.nakshatra,
      payment_status: b.payment_status,
      booking_status: b.booking_status,
      attendance: b.attendance,
      transaction_id: b.transaction_id
    }));

    const total_count = docs.length;
    let total_amount = 0;
    let success_count = 0;
    let success_amount = 0;
    let attended_count = 0;

    for (const b of docs) {
      const amt = Number(b.amount || 0);
      total_amount += amt;
      if (b.payment_status === 'SUCCESS' || b.payment_status === 'CONFIRMED') {
        success_count++;
        success_amount += amt;
      }
      if (b.attendance === 'PRESENT') {
        attended_count++;
      }
    }

    return {
      summary: {
        total_count,
        total_amount,
        success_count,
        success_amount,
        attended_count
      },
      records
    };
  },

  /**
   * Donations summary report
   */
  async getDonationsReport(filters: { dateFrom?: string; dateTo?: string; purpose?: string }) {
    const { db } = await connectToDatabase();
    const queryFilter: any = {};

    if (filters.dateFrom || filters.dateTo) {
      queryFilter.created_at = {};
      if (filters.dateFrom) queryFilter.created_at.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) queryFilter.created_at.$lte = new Date(filters.dateTo);
    }

    if (filters.purpose) {
      queryFilter.purpose = filters.purpose;
    }

    const docs = await db.collection('donations')
      .find(queryFilter)
      .sort({ created_at: -1 })
      .toArray();

    let total_amount = 0;
    for (const d of docs) {
      total_amount += Number(d.amount || 0);
    }

    return {
      summary: {
        total_count: docs.length,
        total_amount
      },
      records: docs.map((d: any) => ({
        ...d,
        id: d.id || d._id.toString()
      }))
    };
  }
};
