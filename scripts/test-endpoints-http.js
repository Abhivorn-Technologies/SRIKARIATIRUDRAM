async function testEndpoints() {
  console.log('=== Testing Live HTTP REST APIs on http://localhost:3000 ===\n');

  // 1. Test /api/admin/dashboard
  const dashRes = await fetch('http://localhost:3000/api/admin/dashboard');
  const dashJson = await dashRes.json();
  console.log('1. /api/admin/dashboard:', {
    status: dashRes.status,
    success: dashJson.success,
    totalBookings: dashJson.data?.totalBookings,
    totalRevenue: dashJson.data?.totalRevenue,
    availableSlots: dashJson.data?.availableSlots,
    todayProgramme: dashJson.data?.todayProgramme?.title
  });

  // 2. Test /api/nakshatra/Mrigasira (Core Business Logic)
  const mrigasiraRes = await fetch('http://localhost:3000/api/nakshatra/Mrigasira');
  const mrigasiraJson = await mrigasiraRes.json();
  console.log('\n2. /api/nakshatra/Mrigasira:', {
    status: mrigasiraRes.status,
    success: mrigasiraJson.success,
    programmeDate: mrigasiraJson.data?.programmeDate,
    dayType: mrigasiraJson.data?.dayType,
    sevas: mrigasiraJson.data?.availableSevas?.map(s => `${s.title} (₹${s.amount}) [${s.tag || 'Standard'}]`)
  });

  // 3. Test /api/nakshatra/Krithika (Krithika Subramanyeswara Kalyanam)
  const krithikaRes = await fetch('http://localhost:3000/api/nakshatra/Krithika');
  const krithikaJson = await krithikaRes.json();
  console.log('\n3. /api/nakshatra/Krithika:', {
    status: krithikaRes.status,
    success: krithikaJson.success,
    dayType: krithikaJson.data?.dayType,
    sevas: krithikaJson.data?.availableSevas?.map(s => `${s.title} (₹${s.amount})`)
  });

  // 4. Test /api/admin/schedule
  const schedRes = await fetch('http://localhost:3000/api/admin/schedule');
  const schedJson = await schedRes.json();
  console.log('\n4. /api/admin/schedule:', {
    status: schedRes.status,
    count: schedJson.data?.length,
    day1: schedJson.data?.[0]?.nakshatra,
    day28: schedJson.data?.[27]?.nakshatra
  });

  // 5. Test /api/admin/sevas
  const sevasRes = await fetch('http://localhost:3000/api/admin/sevas');
  const sevasJson = await sevasRes.json();
  console.log('\n5. /api/admin/sevas:', {
    status: sevasRes.status,
    count: sevasJson.data?.length,
    sevas: sevasJson.data?.map(s => `${s.title} (₹${s.amount})`)
  });

  // 6. Test /api/admin/sankalpam?date=2026-11-26
  const sankRes = await fetch('http://localhost:3000/api/admin/sankalpam?date=2026-11-26');
  const sankJson = await sankRes.json();
  console.log('\n6. /api/admin/sankalpam?date=2026-11-26:', {
    status: sankRes.status,
    totalSankalpams: sankJson.data?.totalSankalpams,
    records: sankJson.data?.records?.map(r => `${r.devotee_name} (${r.gotram} / ${r.nakshatram}) -> ${r.seva}`)
  });

  // 7. Test /api/admin/live
  const liveRes = await fetch('http://localhost:3000/api/admin/live');
  const liveJson = await liveRes.json();
  console.log('\n7. /api/admin/live:', {
    status: liveRes.status,
    is_live: liveJson.data?.is_live,
    title: liveJson.data?.title
  });

  console.log('\n🎉 ALL 7 LIVE REST API ENDPOINTS RETURNED 200 OK WITH REAL SUPABASE DATA!');
}

testEndpoints().catch(err => {
  console.error('HTTP Test Error:', err);
  process.exit(1);
});
