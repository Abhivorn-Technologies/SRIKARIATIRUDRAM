import { query } from '@/lib/db';

export const reportServerService = {
  /**
   * Sankalpam report for Vedic Priests on designated date
   */
  async getSankalpamReport(date: string) {
    const cleanDate = new Date(date).toISOString().split('T')[0];

    const sql = `
      SELECT 
        ROW_NUMBER() OVER(ORDER BY created_at ASC) as s_no,
        booking_id,
        full_name as devotee_name,
        COALESCE(gotram, 'Not Specified') as gotram,
        COALESCE(janma_nakshatra, nakshatra) as nakshatram,
        COALESCE(rasi, 'Not Specified') as rasi,
        COALESCE(sankalpam_names, full_name) as sankalpam_names,
        seva_name as seva,
        amount,
        phone_number as mobile,
        attending_personally,
        attendance,
        payment_status,
        created_at
      FROM public.bookings
      WHERE selected_date = $1::date AND payment_status = 'SUCCESS'
      ORDER BY created_at ASC;
    `;

    const res = await query(sql, [cleanDate]);

    // Schedule details
    const scheduleRes = await query(`
      SELECT day_number, date_display, nakshatra, day_type, title, special_programme
      FROM public.schedules
      WHERE date = $1::date
      LIMIT 1;
    `, [cleanDate]);

    return {
      date: cleanDate,
      schedule: scheduleRes.rows[0] || null,
      totalSankalpams: res.rows.length,
      records: res.rows
    };
  },

  /**
   * Financial & Bookings aggregated report
   */
  async getBookingsReport(filters: { dateFrom?: string; dateTo?: string; sevaId?: string; paymentStatus?: string }) {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters.dateFrom) {
      conditions.push(`selected_date >= $${idx}::date`);
      params.push(filters.dateFrom);
      idx++;
    }

    if (filters.dateTo) {
      conditions.push(`selected_date <= $${idx}::date`);
      params.push(filters.dateTo);
      idx++;
    }

    if (filters.sevaId) {
      conditions.push(`seva_id = $${idx}`);
      params.push(filters.sevaId);
      idx++;
    }

    if (filters.paymentStatus) {
      conditions.push(`payment_status = $${idx}`);
      params.push(filters.paymentStatus);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        booking_id,
        created_at,
        selected_date,
        seva_name,
        amount,
        full_name,
        phone_number,
        gotram,
        nakshatra,
        payment_status,
        booking_status,
        attendance,
        transaction_id
      FROM public.bookings
      ${whereClause}
      ORDER BY selected_date ASC, created_at ASC;
    `;

    const res = await query(sql, params);

    const summarySql = `
      SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(CASE WHEN payment_status = 'SUCCESS' THEN 1 END) as success_count,
        COALESCE(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as success_amount,
        COUNT(CASE WHEN attendance = 'PRESENT' THEN 1 END) as attended_count
      FROM public.bookings
      ${whereClause};
    `;

    const summaryRes = await query(summarySql, params);

    return {
      summary: summaryRes.rows[0],
      records: res.rows
    };
  },

  /**
   * Donations summary report
   */
  async getDonationsReport(filters: { dateFrom?: string; dateTo?: string; purpose?: string }) {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters.dateFrom) {
      conditions.push(`created_at::date >= $${idx}::date`);
      params.push(filters.dateFrom);
      idx++;
    }

    if (filters.dateTo) {
      conditions.push(`created_at::date <= $${idx}::date`);
      params.push(filters.dateTo);
      idx++;
    }

    if (filters.purpose) {
      conditions.push(`purpose = $${idx}`);
      params.push(filters.purpose);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT * FROM public.donations
      ${whereClause}
      ORDER BY created_at DESC;
    `;

    const res = await query(sql, params);

    const summarySql = `
      SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM public.donations
      ${whereClause};
    `;

    const summaryRes = await query(summarySql, params);

    return {
      summary: summaryRes.rows[0],
      records: res.rows
    };
  }
};
