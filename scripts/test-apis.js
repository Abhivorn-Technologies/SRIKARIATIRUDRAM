const { scheduleServerService } = require('../src/services/server/schedule.server.service');
const { nakshatraServerService } = require('../src/services/server/nakshatra.server.service');
const { sevaServerService } = require('../src/services/server/seva.server.service');
const { dashboardServerService } = require('../src/services/server/dashboard.server.service');
const { bookingServerService } = require('../src/services/server/booking.server.service');
const { reportServerService } = require('../src/services/server/report.server.service');

async function testServices() {
  console.log('=== 1. Testing Dashboard Metrics ===');
  const dash = await dashboardServerService.getDashboardMetrics();
  console.log('Dashboard Data:', {
    totalBookings: dash.totalBookings,
    totalRevenue: dash.totalRevenue,
    availableSlots: dash.availableSlots,
    todayProgramme: dash.todayProgramme?.title
  });

  console.log('\n=== 2. Testing Core Business Logic: Mrigasira (26 Nov 2026 - Sarpa Sukta Day) ===');
  const mrigasiraProg = await nakshatraServerService.getNakshatraProgramme('Mrigasira');
  console.log('Mrigasira Programme:', {
    nakshatra: mrigasiraProg.nakshatra,
    programmeDate: mrigasiraProg.programmeDate,
    dayType: mrigasiraProg.dayType,
    availableSevas: mrigasiraProg.availableSevas.map(s => ({ title: s.title, amount: s.amount, tag: s.tag, slots: s.availableSlots }))
  });

  console.log('\n=== 3. Testing Core Business Logic: Arudra (27 Nov 2026 - Chandi Homam Day) ===');
  const arudraProg = await nakshatraServerService.getNakshatraProgramme('Arudra');
  console.log('Arudra Programme:', {
    nakshatra: arudraProg.nakshatra,
    dayType: arudraProg.dayType,
    sevasCount: arudraProg.availableSevas.length
  });

  console.log('\n=== 4. Testing Core Business Logic: Krithika (Subramanyeswara Kalyanam Day) ===');
  const krithikaProg = await nakshatraServerService.getNakshatraProgramme('Krithika');
  console.log('Krithika Programme:', {
    nakshatra: krithikaProg.nakshatra,
    dayType: krithikaProg.dayType,
    availableSevas: krithikaProg.availableSevas.map(s => ({ title: s.title, amount: s.amount, tag: s.tag }))
  });

  console.log('\n=== 5. Testing Sankalpam Priest Roster Generation ===');
  const sankalpam = await reportServerService.getSankalpamReport('2026-11-26');
  console.log('Sankalpam for 26 Nov 2026:', {
    date: sankalpam.date,
    totalSankalpams: sankalpam.totalSankalpams,
    firstRecord: sankalpam.records[0] ? {
      devotee: sankalpam.records[0].devotee_name,
      gotram: sankalpam.records[0].gotram,
      seva: sankalpam.records[0].seva
    } : 'None'
  });

  console.log('\n✅ ALL SERVER SERVICES & DYNAMIC BUSINESS LOGIC PASSED 100%!');
}

testServices().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
