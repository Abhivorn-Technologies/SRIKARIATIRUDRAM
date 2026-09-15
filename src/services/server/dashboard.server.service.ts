import { connectToDatabase } from '@/lib/mongodb';

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
    const { db } = await connectToDatabase();
    const today = new Date().toISOString().split('T')[0];

    // Fetch all bookings
    const bookings = await db.collection('bookings').find({}).toArray();
    const donations = await db.collection('donations').find({}).toArray();
    const annadanams = await db.collection('annadanam').find({}).toArray();
    const schedules = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();

    let totalBookings = bookings.length;
    let totalRevenue = 0;
    let todayBookings = 0;
    let todayRevenue = 0;
    let pendingPayments = 0;
    let attendancePresent = 0;
    let attendancePending = 0;

    const sevasMap: Record<string, { count: number; revenue: number }> = {};
    const nakshatrasMap: Record<string, number> = {};
    const dateBookingsMap: Record<string, { bookings: number; revenue: number }> = {};

    for (const b of bookings) {
      const amt = Number(b.amount || 0);
      const isSuccess = b.payment_status === 'SUCCESS' || b.payment_status === 'CONFIRMED' || b.payment_status === 'success';
      const createdDate = b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : '';

      if (isSuccess) {
        totalRevenue += amt;
      }
      if (createdDate === today) {
        todayBookings++;
        if (isSuccess) todayRevenue += amt;
      }
      if (b.payment_status === 'PENDING') {
        pendingPayments++;
      }
      if (b.attendance === 'PRESENT') {
        attendancePresent++;
      } else {
        attendancePending++;
      }

      // Seva breakdown
      const sevaName = b.seva_name || 'Seva';
      if (!sevasMap[sevaName]) sevasMap[sevaName] = { count: 0, revenue: 0 };
      sevasMap[sevaName].count++;
      if (isSuccess) sevasMap[sevaName].revenue += amt;

      // Nakshatra breakdown
      const nak = b.janma_nakshatra || b.nakshatra || 'Sarva Nakshatra';
      nakshatrasMap[nak] = (nakshatrasMap[nak] || 0) + 1;

      // Date chart map
      if (b.selected_date) {
        if (!dateBookingsMap[b.selected_date]) {
          dateBookingsMap[b.selected_date] = { bookings: 0, revenue: 0 };
        }
        dateBookingsMap[b.selected_date].bookings++;
        if (isSuccess) dateBookingsMap[b.selected_date].revenue += amt;
      }
    }

    // Donations
    let todayDonations = 0;
    let totalDonations = 0;
    for (const d of donations) {
      const amt = Number(d.amount || 0);
      const isSuccess = d.payment_status === 'SUCCESS' || d.payment_status === 'CONFIRMED' || d.payment_status === 'success' || !d.payment_status;
      if (isSuccess) {
        totalDonations += amt;
        const createdDate = d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : '';
        if (createdDate === today) todayDonations += amt;
      }
    }

    // Annadanam
    let annadanamSponsors = annadanams.length;
    let annadanamRevenue = 0;
    for (const a of annadanams) {
      const amt = Number(a.amount || 0);
      const isSuccess = a.payment_status === 'SUCCESS' || a.payment_status === 'CONFIRMED' || a.payment_status === 'success' || !a.payment_status;
      if (isSuccess) annadanamRevenue += amt;
    }

    // Daily Chart from 28-day schedule
    const dailyChart = schedules.map((s: any) => {
      const dateStr = s.date ? new Date(s.date).toISOString().split('T')[0] : '';
      const mapped = dateBookingsMap[dateStr] || { bookings: 0, revenue: 0 };
      return {
        date: dateStr,
        display: s.date_display || `Day ${s.day_number}`,
        bookings: mapped.bookings,
        revenue: mapped.revenue
      };
    });

    const todayProgramme = schedules.find((s: any) => {
      const dateStr = s.date ? new Date(s.date).toISOString().split('T')[0] : '';
      return dateStr === today;
    }) || schedules[0] || null;

    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 6)
      .map((b: any) => ({
        ...b,
        id: b.booking_id || b.id || b._id.toString()
      }));

    const sevasBreakdown = Object.entries(sevasMap)
      .map(([name, val]) => ({ name, count: val.count, revenue: val.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const nakshatrasBreakdown = Object.entries(nakshatrasMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      todayBookings,
      todayRevenue,
      totalBookings,
      totalRevenue,
      todayDonations,
      totalDonations,
      annadanamSponsors,
      annadanamRevenue,
      pendingPayments,
      availableSlots: Math.max(0, 5000 - totalBookings),
      bookedSlots: totalBookings,
      attendancePresent,
      attendancePending,
      todayProgramme,
      sevasBreakdown,
      nakshatrasBreakdown,
      dailyChart,
      recentBookings
    };
  }
};
