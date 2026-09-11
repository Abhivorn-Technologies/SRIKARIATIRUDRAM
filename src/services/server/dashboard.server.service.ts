import { query } from '@/lib/db';

export interface DashboardMetrics {
  todayBookings: number;
  todayRevenue: number;
  totalBookings: number;
  totalRevenue: number;
  todayDonations: number;
  totalDonations: number;
  annadanamSponsors: number;
  annadanamRevenue: number;
  pendingPayments: number;
  availableSlots: number;
  bookedSlots: number;
  attendancePresent: number;
  attendancePending: number;
  todayProgramme: any | null;
  sevasBreakdown: { name: string; count: number; revenue: number }[];
  nakshatrasBreakdown: { name: string; count: number }[];
  dailyChart: { date: string; display: string; bookings: number; revenue: number }[];
  recentBookings: any[];
}

export const dashboardServerService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const today = new Date().toISOString().split('T')[0];

    // 1. Bookings Aggregations
    const bookingsAggSql = `
      SELECT 
        COUNT(*) as total_bookings,
        COALESCE(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN created_at::date = $1::date THEN 1 END) as today_bookings,
        COALESCE(SUM(CASE WHEN created_at::date = $1::date AND payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as today_revenue,
        COUNT(CASE WHEN payment_status = 'PENDING' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN attendance = 'PRESENT' THEN 1 END) as attendance_present,
        COUNT(CASE WHEN attendance = 'PENDING' THEN 1 END) as attendance_pending
      FROM public.bookings;
    `;
    const bookingsAggRes = await query(bookingsAggSql, [today]);
    const bAgg = bookingsAggRes.rows[0] || {};

    // 2. Donations Aggregations
    const donationsAggSql = `
      SELECT 
        COALESCE(SUM(CASE WHEN created_at::date = $1::date AND payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as today_donations,
        COALESCE(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_donations
      FROM public.donations;
    `;
    const donationsAggRes = await query(donationsAggSql, [today]);
    const dAgg = donationsAggRes.rows[0] || {};

    // 3. Annadanam Aggregations
    const annadanamAggSql = `
      SELECT 
        COUNT(*) as total_sponsors,
        COALESCE(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_annadanam_revenue
      FROM public.annadanam;
    `;
    const annadanamAggRes = await query(annadanamAggSql);
    const aAgg = annadanamAggRes.rows[0] || {};

    // 4. Seva Availability Aggregations
    const availAggSql = `
      SELECT 
        COALESCE(SUM(capacity), 0) as total_capacity,
        COALESCE(SUM(booked_count), 0) as total_booked
      FROM public.seva_availability;
    `;
    const availAggRes = await query(availAggSql);
    const totalCapacity = parseInt(availAggRes.rows[0]?.total_capacity || '0', 10);
    const totalBooked = parseInt(availAggRes.rows[0]?.total_booked || '0', 10);

    // 5. Sevas Breakdown
    const sevasBreakdownSql = `
      SELECT 
        seva_name as name,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END), 0) as revenue
      FROM public.bookings
      GROUP BY seva_name
      ORDER BY count DESC
      LIMIT 8;
    `;
    const sevasBreakdownRes = await query(sevasBreakdownSql);

    // 6. Nakshatras Breakdown
    const nakshatrasBreakdownSql = `
      SELECT 
        COALESCE(janma_nakshatra, nakshatra) as name,
        COUNT(*) as count
      FROM public.bookings
      GROUP BY name
      ORDER BY count DESC
      LIMIT 8;
    `;
    const nakshatrasBreakdownRes = await query(nakshatrasBreakdownSql);

    // 7. Daily 28-day schedule Chart
    const dailyChartSql = `
      SELECT 
        s.date::text as date,
        s.date_display as display,
        COUNT(b.id) as bookings,
        COALESCE(SUM(CASE WHEN b.payment_status = 'SUCCESS' THEN b.amount ELSE 0 END), 0) as revenue
      FROM public.schedules s
      LEFT JOIN public.bookings b ON b.selected_date = s.date
      GROUP BY s.day_number, s.date, s.date_display
      ORDER BY s.day_number ASC;
    `;
    const dailyChartRes = await query(dailyChartSql);

    // 8. Today's Programme
    const todayProgSql = `
      SELECT * FROM public.schedules
      WHERE date = $1::date
      LIMIT 1;
    `;
    const todayProgRes = await query(todayProgSql, [today]);
    const fallbackProg = dailyChartRes.rows[0] ? await query('SELECT * FROM public.schedules ORDER BY day_number ASC LIMIT 1') : { rows: [] };
    const todayProgramme = todayProgRes.rows[0] || fallbackProg.rows[0] || null;

    // 9. Recent 6 bookings
    const recentBookingsSql = `
      SELECT * FROM public.bookings
      ORDER BY created_at DESC
      LIMIT 6;
    `;
    const recentBookingsRes = await query(recentBookingsSql);

    return {
      todayBookings: parseInt(bAgg.today_bookings || '0', 10),
      todayRevenue: parseFloat(bAgg.today_revenue || '0'),
      totalBookings: parseInt(bAgg.total_bookings || '0', 10),
      totalRevenue: parseFloat(bAgg.total_revenue || '0'),
      todayDonations: parseFloat(dAgg.today_donations || '0'),
      totalDonations: parseFloat(dAgg.total_donations || '0'),
      annadanamSponsors: parseInt(aAgg.total_sponsors || '0', 10),
      annadanamRevenue: parseFloat(aAgg.total_annadanam_revenue || '0'),
      pendingPayments: parseInt(bAgg.pending_payments || '0', 10),
      availableSlots: Math.max(0, totalCapacity - totalBooked),
      bookedSlots: totalBooked,
      attendancePresent: parseInt(bAgg.attendance_present || '0', 10),
      attendancePending: parseInt(bAgg.attendance_pending || '0', 10),
      todayProgramme,
      sevasBreakdown: sevasBreakdownRes.rows.map((r: any) => ({
        name: r.name,
        count: parseInt(r.count || '0', 10),
        revenue: parseFloat(r.revenue || '0')
      })),
      nakshatrasBreakdown: nakshatrasBreakdownRes.rows.map((r: any) => ({
        name: r.name,
        count: parseInt(r.count || '0', 10)
      })),
      dailyChart: dailyChartRes.rows.map((r: any) => ({
        date: r.date,
        display: r.display,
        bookings: parseInt(r.bookings || '0', 10),
        revenue: parseFloat(r.revenue || '0')
      })),
      recentBookings: recentBookingsRes.rows
    };
  }
};
