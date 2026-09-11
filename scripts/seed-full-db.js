const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { Client } = require('pg');



async function main() {
  console.log('=== Step 1: Connecting to Supabase PostgreSQL Database ===');
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected successfully!');

  console.log('\n=== Step 2: Applying Full Schema Migrations ===');
  const sqlPath = path.resolve(__dirname, 'full-schema.sql');
  const schemaSql = fs.readFileSync(sqlPath, 'utf8');
  await client.query(schemaSql);
  console.log('✅ Schema tables, constraints, indexes & RLS policies verified!');

  console.log('\n=== Step 3: Seeding 9 Approved Sevas ===');
  const approvedSevas = [
    {
      id: 'ati-rudram-donation',
      slug: 'ati-rudram-donation',
      title: 'ATI RUDRAM DONATION',
      title_te: 'అతి రుద్రం పవిత్ర విరాళం',
      title_hi: 'अति रुद्रम दान',
      amount: 216,
      short_desc: 'Support the sacred Srikari Ati Rudra Mahayajnam through this contribution.',
      short_desc_te: 'ఈ పవిత్ర విరాళం ద్వారా శ్రీకరీ అతిరుద్ర మహాయజ్ఞ నిర్వహణలో భాగస్వామ్యం పొందండి.',
      short_desc_hi: 'इस पावन योगदान के माध्यम से श्रीकरी अति रुद्र महायज्ञ में सहयोग करें।',
      full_desc: 'Support the sacred Srikari Ati Rudra Mahayajnam through this contribution. Dedicated towards Veda Samrakshana and Lokakalyanam.',
      full_desc_te: 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞ నిర్వహణ కొరకు భక్తులు సమర్పించే పవిత్ర విరాళం.',
      full_desc_hi: 'श्रीकरी अति रुद्र महायज्ञ के पावन आयोजन में सहयोग हेतु यह पवित्र दान अर्पित करें।',
      category: 'donation',
      icon: '🕉️',
      duration: 'Entire Event',
      time: 'Daily Rituals (25 Nov – 22 Dec 2026)',
      capacity: 5000,
      active: true,
      featured: false,
      sort_order: 1,
      benefits: JSON.stringify(['Lokakalyanam resolve participation', 'Blessings of Lord Shiva', 'Digital Seva Certificate']),
      prasadam: JSON.stringify(['Blessed Vibhuti (Bhasma)', 'Digital Blessing Certificate'])
    },
    {
      id: 'ekadasa-rudra-abhishekam',
      slug: 'ekadasa-rudra-abhishekam',
      title: 'EKADASA RUDRA ABHISHEKAM',
      title_te: 'ఏకాదశ రుద్ర అభిషేకం',
      title_hi: 'एकादश रुद्र अभिषेक',
      amount: 5116,
      short_desc: 'Participate in Ekadasa Rudra Abhishekam with Sankalpam.',
      short_desc_te: 'సంకల్పంతో ఏకాదశ రుద్ర అభిషేకంలో పాల్గొనండి.',
      short_desc_hi: 'संकल्प के साथ एकादश रुद्र अभिषेक में सम्मिलित हों।',
      full_desc: 'Continuous sacred abhishekam performed with 11 holy Dravyas accompanied by Namaka-Chamaka recitations for spiritual upliftment and obstacles removal.',
      full_desc_te: '11 పవిత్ర ద్రవ్యాలతో నమక చమక సహిత ఏకాదశ రుద్ర మహాభిషేకం నిర్వహించబడును.',
      full_desc_hi: '11 पवित्र द्रव्यों एवं नमक-चमक पाठ के साथ एकादश रुद्र महाभिषेक।',
      category: 'abhishekam',
      icon: '🔱',
      duration: '3.5 Hours',
      time: 'Morning 07:30 AM – 11:00 AM',
      capacity: 50,
      active: true,
      featured: false,
      sort_order: 2,
      benefits: JSON.stringify(['Family Gotra Sankalpam included', 'Protection from Graha Doshas', 'Abhisheka Theertham & Silver Coin']),
      prasadam: JSON.stringify(['Abhisheka Theertham', 'Kumkum & Vibhuti', 'Blessed Silver Coin'])
    },
    {
      id: 'maha-rudra-japam-and-homam',
      slug: 'maha-rudra-japam-and-homam',
      title: 'MAHA RUDRA JAPAM & HOMAM',
      title_te: 'మహా రుద్ర జపం & హోమం',
      title_hi: 'महा रुद्र जप एवं होम',
      amount: 11116,
      short_desc: 'Participate in Maha Rudra Japam and Homam offering.',
      short_desc_te: 'మహా రుద్ర జపం మరియు పవిత్ర హోమ క్రతువులో పాల్గొనండి.',
      short_desc_hi: 'महा रुद्र जप एवं पावन होम अनुष्ठान में भाग लें।',
      full_desc: 'Grand Vedic chanting of 1,331 Rudra recitations coupled with intense Homa oblations into 11 sacred Homa Kundas for health, prosperity, and peace.',
      full_desc_te: '11 హోమ గుండాలలో 1,331 రుద్ర ఆవర్తనలతో నిర్వహించే దివ్య మహారుద్ర హోమ క్రతువు.',
      full_desc_hi: '11 पवित्र होम कुंडों में 1,331 रुद्र पाठों सहित महा रुद्र होम अनुष्ठान।',
      category: 'homam',
      icon: '🔥',
      duration: '4.5 Hours',
      time: 'Morning 07:30 AM – 12:00 PM',
      capacity: 40,
      active: true,
      featured: true,
      sort_order: 3,
      benefits: JSON.stringify(['Complete Family Sankalpam with 11 Priests', 'Homa Bhasma & Maha Prasadam box', 'Special Yajna Raksha Bandhana']),
      prasadam: JSON.stringify(['Homa Bhasma', 'Panchamrutha Prasadam', 'Veda Asirvachanam Certificate'])
    },
    {
      id: 'rudra-kramarchana',
      slug: 'rudra-kramarchana',
      title: 'RUDRA KRAMARCHANA',
      title_te: 'రుద్ర క్రమార్చన',
      title_hi: 'रुद्र क्रमार्चना',
      amount: 1116,
      short_desc: 'Offer Rudra Kramarchana with sacred Bilva leaves and flowers.',
      short_desc_te: 'పవిత్ర బిల్వ పత్రాలు మరియు పుష్పాలతో రుద్ర క్రమార్చన సమర్పించండి.',
      short_desc_hi: 'पवित्र बिल्व पत्रों एवं पुष्पों से रुद्र क्रमार्चना अर्पित करें।',
      full_desc: 'Special archana performed with sacred Bilva patras following rigorous Vedic Krama recitation for divine Shiva grace and peace of mind.',
      full_desc_te: 'వేద క్రమ పద్ధతిలో బిల్వ దళాలతో సమర్పించే విశేష రుద్ర క్రమార్చన.',
      full_desc_hi: 'वैदिक क्रम पद्धति से बिल्व पत्रों द्वारा अर्पित विशेष रुद्र क्रमार्चना।',
      category: 'archana',
      icon: '🌿',
      duration: '1.5 Hours',
      time: 'Evening 05:30 PM – 07:00 PM',
      capacity: 100,
      active: true,
      featured: false,
      sort_order: 4,
      benefits: JSON.stringify(['Personalized Archana in devotee name', 'Bilva Patra & Akshata Prasadam by post', 'Spiritual tranquility']),
      prasadam: JSON.stringify(['Sanctified Bilva Patra', 'Akshatas', 'Blessed Rudraksha Bead'])
    },
    {
      id: 'nakshatra-hawan-seva',
      slug: 'nakshatra-hawan-seva',
      title: 'NAKSHATRA HAWAN SEVA',
      title_te: 'నక్షత్ర హవన సేవ',
      title_hi: 'नक्षत्र हवन सेवा',
      amount: 216,
      short_desc: 'Sacred Hawan offering dedicated to your Janma Nakshatra day.',
      short_desc_te: 'మీ జన్మ నక్షత్ర పర్వదినాన సమర్పించే పవిత్ర నక్షత్ర హవనం.',
      short_desc_hi: 'आपके जन्म नक्षत्र के पावन दिन पर अर्पित नक्षत्र हवन सेवा।',
      full_desc: 'Dedicated Hawan ahutis performed specifically on the programme date corresponding to the devotee Janma Nakshatra for planetary balance and peace.',
      full_desc_te: 'భక్తుల జన్మ నక్షత్ర అనుకూలత కొరకు విశేష మంత్రోచ్ఛారణతో సమర్పించే నక్షత్ర హవన సేవ.',
      full_desc_hi: 'ग्रह शांति एवं नक्षत्र शुद्धि हेतु वैदिक आहुतियों सहित नक्षत्र हवन।',
      category: 'homam',
      icon: '✨',
      duration: '1 Hour',
      time: 'Morning 08:30 AM – 09:30 AM',
      capacity: 250,
      active: true,
      featured: false,
      sort_order: 5,
      benefits: JSON.stringify(['Nakshatra-specific Ahuti sankalpam', 'Planetary balance and positivity', 'Digital blessing card']),
      prasadam: JSON.stringify(['Nakshatra Yantra Card', 'Blessed Vibhuti'])
    },
    {
      id: 'sampoorna-nakshatra-shanthi',
      slug: 'sampoorna-nakshatra-shanthi',
      title: 'SAMPOORNA NAKSHATRA SHANTHI',
      title_te: 'సంపూర్ణ నక్షత్ర శాంతి',
      title_hi: 'सम्पूर्ण नक्षत्र शांति',
      amount: 10116,
      short_desc: 'Complete Vedic Nakshatra Shanthi ritual on your programme date.',
      short_desc_te: 'మీ జన్మ నక్షత్ర విశేష దినాన సంపూర్ణ వేద నక్షత్ర శాంతి హోమం.',
      short_desc_hi: 'आपके जन्म नक्षत्र दिवस पर सम्पूर्ण वैदिक नक्षत्र शांति अनुष्ठान।',
      full_desc: 'Comprehensive Nakshatra Devata invocation, Graha Shanti japas, and Kalasa Abhisheka performed on the assigned programme date for total life prosperity and dosha relief.',
      full_desc_te: 'నక్షత్ర దేవతా ప్రీత్యర్థం, గ్రహదోష నివారణార్థం సంపూర్ణ హోమ క్రతువు.',
      full_desc_hi: 'समस्त जीवन समृद्धि एवं दोष निवारण हेतु सम्पूर्ण नक्षत्र शांति होम।',
      category: 'homam',
      icon: '⭐',
      duration: '3.5 Hours',
      time: 'Morning 08:00 AM – 11:30 AM',
      capacity: 35,
      active: true,
      featured: true,
      sort_order: 6,
      benefits: JSON.stringify(['Full Family Sankalpam with Nakshatra Suktam', 'Exclusive Kalasha Sthapana for devotee', 'Consecrated Copper Yantra & Silver Coin']),
      prasadam: JSON.stringify(['Energized Nakshatra Copper Yantra', 'Silver Shiva Coin', 'Homa Raksha Bhasma', 'Panchamrutha Bottle'])
    },
    {
      id: 'sampoorna-visesha-nakshatra-seva',
      slug: 'sampoorna-visesha-nakshatra-seva',
      title: 'SAMPOORNA VISESHA NAKSHATRA SEVA',
      title_te: 'సంపూర్ణ విశేష నక్షత్ర సేవ',
      title_hi: 'सम्पूर्ण विशेष नक्षत्र सेवा',
      amount: 12116,
      short_desc: 'Special Nakshatra Shanthi combined with specific Homa on designated days.',
      short_desc_te: 'ప్రత్యేక దినాలలో చండీ / సర్ప సూక్త / ఆశ్లేష బలి సహిత సంపూర్ణ విశేష నక్షత్ర సేవ.',
      short_desc_hi: 'विशेष दिवसों पर चंडी / सर्प सूक्त / आश्लेषा बलि सहित सम्पूर्ण विशेष नक्षत्र सेवा।',
      full_desc: 'Offered exclusively on special programme days (Chandi Homam, Sarpa Sukta Homam, or Aslesha Bali days) combining complete Nakshatra Shanthi with targeted powerful Vedic rituals.',
      full_desc_te: 'విశేష క్రతువులు జరిగే పుణ్యదినాలలో (చండీ హోమం, సర్ప సూక్తం, ఆశ్లేష బలి) నిర్వహించే పరమోత్కృష్ట సేవ.',
      full_desc_hi: 'विशेष पावन दिवसों पर चंडी होम / सर्प सूक्त / आश्लेषा बलि सहित परम कल्याणकारी सेवा।',
      category: 'homam',
      icon: '👑',
      duration: '4.5 Hours',
      time: 'Morning 07:30 AM – 12:00 PM',
      capacity: 30,
      active: true,
      featured: true,
      sort_order: 7,
      benefits: JSON.stringify(['Full Family Gotra Sankalpam across both Homams', 'Primary Seva Peetam seating', 'Special Prasadam kit & energised idol']),
      prasadam: JSON.stringify(['Energized Brass Shiva Idol', 'Silver Coin', 'Consecrated Silk Cloth (Angavastram)', 'Maha Prasadam Kit'])
    },
    {
      id: 'sri-subramanyeswara-swamy-kalyanam',
      slug: 'sri-subramanyeswara-swamy-kalyanam',
      title: 'SRI SUBRAMANYESWARA SWAMY KALYANAM',
      title_te: 'శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి కళ్యాణం',
      title_hi: 'श्री सुब्रमण्येश्वर स्वामी कल्याणम्',
      amount: 5116,
      short_desc: 'Divine Kalyana Utsavam on Krithika Nakshatra day.',
      short_desc_te: 'కృత్తికా నక్షత్ర పుణ్యదినాన శ్రీ వల్లీ దేవసేన సమేత సుబ్రహ్మణ్యేశ్వర కళ్యాణం.',
      short_desc_hi: 'कृत्तिका नक्षत्र के पावन दिन श्री सुब्रमण्येश्वर स्वामी कल्याण उत्सव।',
      full_desc: 'Grand Celestial Wedding ceremony of Lord Subramanya with Valli and Devasena performed on Krithika Nakshatra day for marital harmony, progeny, and courage.',
      full_desc_te: 'వివాహ ప్రాప్తి, సంతాన భాగ్యం, కుటుంబ సౌభాగ్యాల కొరకు నిర్వహించే దివ్య కళ్యాణోత్సవం.',
      full_desc_hi: 'विवाह बाधा निवारण एवं संतान सुख हेतु दिव्य सुब्रमण्येश्वर स्वामी कल्याणम्।',
      category: 'kalyanam',
      icon: '🦚',
      duration: '3.5 Hours',
      time: 'Evening 05:00 PM – 08:30 PM',
      capacity: 100,
      active: true,
      featured: false,
      sort_order: 8,
      benefits: JSON.stringify(['Couple Sankalpam on Kalyana Mandapam', 'Blessed Kalyana Akshatas & Silk Vastra', 'Subramanya Yantra & Raksha']),
      prasadam: JSON.stringify(['Kalyana Akshatas', 'Consecrated Subramanya Yantra', 'Kalyana Prasadam Box'])
    },
    {
      id: 'annadanam-seva',
      slug: 'annadanam-seva',
      title: 'ANNADANAM SEVA',
      title_te: 'నిత్య అన్నదాన సేవ',
      title_hi: 'अन्नदान सेवा',
      amount: 5116,
      short_desc: 'Support daily Annaprasadam distribution for thousands of visiting devotees.',
      short_desc_te: 'యజ్ఞానికి విచ్చేసే వేలాది మంది భక్తులకు నిత్య అన్నప్రసాద వితరణలో పాలుపంచుకోండి.',
      short_desc_hi: 'महायज्ञ में पधारे हजारों श्रद्धालुओं हेतु पावन अन्नप्रसादम वितरण में सहयोग दें।',
      full_desc: 'Sacred Annadanam is Maha Danam. Sponsor one day meal distribution for 1,000+ devotees, sadhus, and Vedic scholars attending the 28-day Ati Rudra Mahayajnam.',
      full_desc_te: 'అన్నదానం పరమోత్కృష్ట దానం. 28 రోజుల పాటు నిత్యం వేలాది మందికి పవిత్ర అన్నప్రసాద వితరణ.',
      full_desc_hi: 'अन्नदानम् परम पावन महादान है। 28 दिनों तक प्रतिदिन हजारों भक्तों को महाप्रसाद वितरण।',
      category: 'donation',
      icon: '🍚',
      duration: 'Daily',
      time: 'Afternoon 12:00 PM – 03:30 PM & Night',
      capacity: 1000,
      active: true,
      featured: true,
      sort_order: 9,
      benefits: JSON.stringify(['Annadanam Donor recognition on display board', 'Special Annaprasada Sankalpam', 'Divine satisfaction of feeding devotees']),
      prasadam: JSON.stringify(['Special Laddu & Maha Prasadam box', 'Srikari Temple Calendar', 'Donor Blessing Certificate'])
    }
  ];

  for (const seva of approvedSevas) {
    await client.query(`
      INSERT INTO public.sevas (
        id, slug, title, title_te, title_hi, amount, short_desc, short_desc_te, short_desc_hi,
        full_desc, full_desc_te, full_desc_hi, category, icon, duration, time,
        capacity, active, featured, sort_order, benefits, prasadam, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        title_te = EXCLUDED.title_te,
        title_hi = EXCLUDED.title_hi,
        amount = EXCLUDED.amount,
        short_desc = EXCLUDED.short_desc,
        short_desc_te = EXCLUDED.short_desc_te,
        short_desc_hi = EXCLUDED.short_desc_hi,
        full_desc = EXCLUDED.full_desc,
        full_desc_te = EXCLUDED.full_desc_te,
        full_desc_hi = EXCLUDED.full_desc_hi,
        category = EXCLUDED.category,
        icon = EXCLUDED.icon,
        duration = EXCLUDED.duration,
        time = EXCLUDED.time,
        capacity = EXCLUDED.capacity,
        active = EXCLUDED.active,
        featured = EXCLUDED.featured,
        sort_order = EXCLUDED.sort_order,
        benefits = EXCLUDED.benefits,
        prasadam = EXCLUDED.prasadam,
        updated_at = NOW();
    `, [
      seva.id, seva.slug, seva.title, seva.title_te, seva.title_hi, seva.amount,
      seva.short_desc, seva.short_desc_te, seva.short_desc_hi,
      seva.full_desc, seva.full_desc_te, seva.full_desc_hi,
      seva.category, seva.icon, seva.duration, seva.time,
      seva.capacity, seva.active, seva.featured, seva.sort_order,
      seva.benefits, seva.prasadam
    ]);
  }
  console.log(`✅ Seeded ${approvedSevas.length} Approved Sevas!`);

  console.log('\n=== Step 4: Seeding 28-Day Mahayagnam Schedule (25 Nov – 22 Dec 2026) ===');
  const rawSchedule = [
    { day: 1, date: '2026-11-25', display: '25 November 2026', nakshatra: 'Rohini', rasi: 'Vrishabha', dayType: 'REGULAR', title: 'Mahayagna Mahotsava Arambham & Rohini Nakshatra Homam' },
    { day: 2, date: '2026-11-26', display: '26 November 2026', nakshatra: 'Mrigasira', rasi: 'Vrishabha / Mithuna', dayType: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Mrigasira Nakshatra Shanthi & Sarpa Sukta Homam' },
    { day: 3, date: '2026-11-27', display: '27 November 2026', nakshatra: 'Arudra', rasi: 'Mithuna', dayType: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Maha Shiva Nakshatram Arudra & Chandi Homam' },
    { day: 4, date: '2026-11-28', display: '28 November 2026', nakshatra: 'Punarvasu', rasi: 'Mithuna / Karkataka', dayType: 'REGULAR', title: 'Punarvasu Nakshatra Shanthi & Rudra Homam' },
    { day: 5, date: '2026-11-29', display: '29 November 2026', nakshatra: 'Pushyami', rasi: 'Karkataka', dayType: 'REGULAR', title: 'Pushyami Nakshatra Shanthi & Guru Kripa Homam' },
    { day: 6, date: '2026-11-30', display: '30 November 2026', nakshatra: 'Aslesha', rasi: 'Karkataka', dayType: 'ASLESHA_BALI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Aslesha Nakshatra Shanthi & Aslesha Bali Pooja' },
    { day: 7, date: '2026-12-01', display: '1 December 2026', nakshatra: 'Makha', rasi: 'Simha', dayType: 'REGULAR', title: 'Makha Nakshatra Shanthi & Pitru Devata Kripa Homam' },
    { day: 8, date: '2026-12-02', display: '2 December 2026', nakshatra: 'Pubba (Purva Phalguni)', rasi: 'Simha', dayType: 'REGULAR', title: 'Purva Phalguni Nakshatra Shanthi Homam' },
    { day: 9, date: '2026-12-03', display: '3 December 2026', nakshatra: 'Uttara (Uttara Phalguni)', rasi: 'Simha / Kanya', dayType: 'REGULAR', title: 'Uttara Phalguni Nakshatra Shanthi Homam' },
    { day: 10, date: '2026-12-04', display: '4 December 2026', nakshatra: 'Hastha', rasi: 'Kanya', dayType: 'REGULAR', title: 'Hastha Nakshatra Shanthi & Surya Kripa Homam' },
    { day: 11, date: '2026-12-05', display: '5 December 2026', nakshatra: 'Chitta', rasi: 'Kanya / Thula', dayType: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Chitta Nakshatra Shanthi & Sarpa Sukta Homam' },
    { day: 12, date: '2026-12-06', display: '6 December 2026', nakshatra: 'Swathi', rasi: 'Thula', dayType: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Swathi Nakshatra Shanthi & Chandi Homam' },
    { day: 13, date: '2026-12-07', display: '7 December 2026', nakshatra: 'Visakha', rasi: 'Thula / Vrischika', dayType: 'REGULAR', title: 'Visakha Nakshatra Shanthi & Kartikeya Kripa Homam' },
    { day: 14, date: '2026-12-08', display: '8 December 2026', nakshatra: 'Anuradha', rasi: 'Vrischika', dayType: 'REGULAR', title: 'Anuradha Nakshatra Shanthi & Mitra Devata Homam' },
    { day: 15, date: '2026-12-09', display: '9 December 2026', nakshatra: 'Jyeshta', rasi: 'Vrischika', dayType: 'REGULAR', title: 'Jyeshta Nakshatra Shanthi & Indra Devata Homam' },
    { day: 16, date: '2026-12-10', display: '10 December 2026', nakshatra: 'Moola', rasi: 'Dhanus', dayType: 'REGULAR', title: 'Moola Nakshatra Shanthi & Nirruti Devata Homam' },
    { day: 17, date: '2026-12-11', display: '11 December 2026', nakshatra: 'Purvashada', rasi: 'Dhanus', dayType: 'REGULAR', title: 'Purvashada Nakshatra Shanthi & Apah Devata Homam' },
    { day: 18, date: '2026-12-12', display: '12 December 2026', nakshatra: 'Uttarashada', rasi: 'Dhanus / Makara', dayType: 'REGULAR', title: 'Uttarashada Nakshatra Shanthi & Visvedeva Homam' },
    { day: 19, date: '2026-12-13', display: '13 December 2026', nakshatra: 'Sravana', rasi: 'Makara', dayType: 'REGULAR', title: 'Sravana Nakshatra Shanthi & Vishnu Devata Homam' },
    { day: 20, date: '2026-12-14', display: '14 December 2026', nakshatra: 'Dhanishta', rasi: 'Makara / Kumbha', dayType: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Dhanishta Nakshatra Shanthi & Sarpa Sukta Homam' },
    { day: 21, date: '2026-12-15', display: '15 December 2026', nakshatra: 'Satabhisham', rasi: 'Kumbha', dayType: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', title: 'Satabhisham Nakshatra Shanthi & Chandi Homam' },
    { day: 22, date: '2026-12-16', display: '16 December 2026', nakshatra: 'Purvabhadra', rasi: 'Kumbha / Meena', dayType: 'REGULAR', title: 'Purvabhadra Nakshatra Shanthi & Aja Ekapada Homam' },
    { day: 23, date: '2026-12-17', display: '17 December 2026', nakshatra: 'Uttarabhadra', rasi: 'Meena', dayType: 'REGULAR', title: 'Uttarabhadra Nakshatra Shanthi & Ahirbudhnya Homam' },
    { day: 24, date: '2026-12-18', display: '18 December 2026', nakshatra: 'Revathi', rasi: 'Meena', dayType: 'REGULAR', title: 'Revathi Nakshatra Shanthi & Pushan Devata Homam' },
    { day: 25, date: '2026-12-19', display: '19 December 2026', nakshatra: 'Aswini', rasi: 'Mesha', dayType: 'REGULAR', title: 'Aswini Nakshatra Shanthi & Asvini Kumaras Homam' },
    { day: 26, date: '2026-12-20', display: '20 December 2026', nakshatra: 'Bharani', rasi: 'Mesha', dayType: 'REGULAR', title: 'Bharani Nakshatra Shanthi & Yama Devata Homam' },
    { day: 27, date: '2026-12-21', display: '21 December 2026', nakshatra: 'Krithika', rasi: 'Mesha / Vrishabha', dayType: 'SUBRAMANYESWARA_KALYANAM', specialSevaId: 'sri-subramanyeswara-swamy-kalyanam', title: 'Krithika Nakshatra & Subramanyeswara Swamy Kalyanam' },
    { day: 28, date: '2026-12-22', display: '22 December 2026', nakshatra: 'Sarva Nakshatras', rasi: 'All Rasis', dayType: 'POORNAHUTI', title: 'Maha Poornahuti & Avabhritha Snanam (Grand Finale)' }
  ];

  for (const s of rawSchedule) {
    await client.query(`
      INSERT INTO public.schedules (
        day_number, date, date_display, nakshatra, rasi, day_type, special_seva_id, status, title,
        morning_programme, madhyahnika, special_programme, evening_programme, annadanam_menu, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'SCHEDULED', $8,
        '06:30 AM Suprabhatam & Mahanyasa Poorvaka Rudra Abhishekam',
        '11:30 AM Maha Rudra Kramarchana & Madhyahnika Pooja',
        $9,
        '06:00 PM Veda Vinnapam, Deeparadhana & Maha Mangala Harathi',
        'Traditional Sattvic Annaprasadam with Sweet Pongal, Sambar & Payasam',
        NOW()
      )
      ON CONFLICT (day_number) DO UPDATE SET
        date = EXCLUDED.date,
        date_display = EXCLUDED.date_display,
        nakshatra = EXCLUDED.nakshatra,
        rasi = EXCLUDED.rasi,
        day_type = EXCLUDED.day_type,
        special_seva_id = EXCLUDED.special_seva_id,
        title = EXCLUDED.title,
        special_programme = EXCLUDED.special_programme,
        updated_at = NOW();
    `, [
      s.day, s.date, s.display, s.nakshatra, s.rasi, s.dayType, s.specialSevaId || null, s.title,
      s.dayType === 'CHANDI' ? '08:30 AM Chandi Homam' :
      s.dayType === 'SARPA_SUKTA' ? '08:30 AM Sarpa Sukta Homam' :
      s.dayType === 'ASLESHA_BALI' ? '08:30 AM Aslesha Bali Pooja' :
      s.dayType === 'SUBRAMANYESWARA_KALYANAM' ? '05:00 PM Sri Subramanyeswara Swamy Kalyanam' :
      s.dayType === 'POORNAHUTI' ? '10:00 AM Maha Poornahuti & Kalasa Abhishekam' : '08:30 AM Nakshatra Hawan'
    ]);
  }
  console.log(`✅ Seeded 28-day Mahayagnam schedule!`);

  console.log('\n=== Step 5: Seeding 27 Janma Nakshatras ===');
  const rawNakshatras = [
    { name: 'Aswini', name_te: 'అశ్విని', name_hi: 'अश्विनी', deity: 'Asvini Kumaras', rasi: 'Mesha', lord: 'Ketu', day: 25, date: '2026-12-19', type: 'REGULAR' },
    { name: 'Bharani', name_te: 'భరణి', name_hi: 'भरणी', deity: 'Yama', rasi: 'Mesha', lord: 'Venus', day: 26, date: '2026-12-20', type: 'REGULAR' },
    { name: 'Krithika', name_te: 'కృత్తిక', name_hi: 'कृत्तिका', deity: 'Agni / Subramanya', rasi: 'Mesha / Vrishabha', lord: 'Sun', day: 27, date: '2026-12-21', type: 'SUBRAMANYESWARA_KALYANAM', specialSevaId: 'sri-subramanyeswara-swamy-kalyanam', specialSevaName: 'Sri Subramanyeswara Swamy Kalyanam' },
    { name: 'Rohini', name_te: 'రోహిణి', name_hi: 'रोहिणी', deity: 'Brahma / Prajapati', rasi: 'Vrishabha', lord: 'Moon', day: 1, date: '2026-11-25', type: 'REGULAR' },
    { name: 'Mrigasira', name_te: 'మృగశిర', name_hi: 'मृगशिरा', deity: 'Soma / Chandra', rasi: 'Vrishabha / Mithuna', lord: 'Mars', day: 2, date: '2026-11-26', type: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Sarpa Sukta Homam' },
    { name: 'Arudra', name_te: 'ఆరుద్ర', name_hi: 'आर्द्रा', deity: 'Rudra / Shiva', rasi: 'Mithuna', lord: 'Rahu', day: 3, date: '2026-11-27', type: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Chandi Homam' },
    { name: 'Punarvasu', name_te: 'పునర్వసు', name_hi: 'पुनर्वसु', deity: 'Aditi', rasi: 'Mithuna / Karkataka', lord: 'Jupiter', day: 4, date: '2026-11-28', type: 'REGULAR' },
    { name: 'Pushyami', name_te: 'పుష్యమి', name_hi: 'पुष्य', deity: 'Brihaspati', rasi: 'Karkataka', lord: 'Saturn', day: 5, date: '2026-11-29', type: 'REGULAR' },
    { name: 'Aslesha', name_te: 'ఆశ్లేష', name_hi: 'आश्लेषा', deity: 'Nagas / Sarpa', rasi: 'Karkataka', lord: 'Mercury', day: 6, date: '2026-11-30', type: 'ASLESHA_BALI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Aslesha Bali' },
    { name: 'Makha', name_te: 'మఖ', name_hi: 'मघा', deity: 'Pitrus', rasi: 'Simha', lord: 'Ketu', day: 7, date: '2026-12-01', type: 'REGULAR' },
    { name: 'Pubba (Purva Phalguni)', name_te: 'పుబ్బ (పూర్వ ఫల్గుణి)', name_hi: 'पूर्वाफाल्गुनी', deity: 'Bhaga / Aryama', rasi: 'Simha', lord: 'Venus', day: 8, date: '2026-12-02', type: 'REGULAR' },
    { name: 'Uttara (Uttara Phalguni)', name_te: 'ఉత్తర (ఉత్తర ఫల్గుణి)', name_hi: 'उत्तराफाल्गुनी', deity: 'Aryama', rasi: 'Simha / Kanya', lord: 'Sun', day: 9, date: '2026-12-03', type: 'REGULAR' },
    { name: 'Hastha', name_te: 'హస్త', name_hi: 'हस्त', deity: 'Savita / Surya', rasi: 'Kanya', lord: 'Moon', day: 10, date: '2026-12-04', type: 'REGULAR' },
    { name: 'Chitta', name_te: 'చిత్త', name_hi: 'चित्रा', deity: 'Tvashtar / Vishwakarma', rasi: 'Kanya / Thula', lord: 'Mars', day: 11, date: '2026-12-05', type: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Sarpa Sukta Homam' },
    { name: 'Swathi', name_te: 'స్వాతి', name_hi: 'स्वाति', deity: 'Vayu', rasi: 'Thula', lord: 'Rahu', day: 12, date: '2026-12-06', type: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Chandi Homam' },
    { name: 'Visakha', name_te: 'విశాఖ', name_hi: 'विशाखा', deity: 'Indra & Agni', rasi: 'Thula / Vrischika', lord: 'Jupiter', day: 13, date: '2026-12-07', type: 'REGULAR' },
    { name: 'Anuradha', name_te: 'అనూరాధ', name_hi: 'अनुराधा', deity: 'Mitra', rasi: 'Vrischika', lord: 'Saturn', day: 14, date: '2026-12-08', type: 'REGULAR' },
    { name: 'Jyeshta', name_te: 'జ్యేష్ఠ', name_hi: 'ज्येष्ठा', deity: 'Indra', rasi: 'Vrischika', lord: 'Mercury', day: 15, date: '2026-12-09', type: 'REGULAR' },
    { name: 'Moola', name_te: 'మూల', name_hi: 'मूल', deity: 'Nirruti', rasi: 'Dhanus', lord: 'Ketu', day: 16, date: '2026-12-10', type: 'REGULAR' },
    { name: 'Purvashada', name_te: 'పూర్వాషాఢ', name_hi: 'पूर्वाषाढ़ा', deity: 'Apah', rasi: 'Dhanus', lord: 'Venus', day: 17, date: '2026-12-11', type: 'REGULAR' },
    { name: 'Uttarashada', name_te: 'ఉత్తరాషాఢ', name_hi: 'उत्तराषाढ़ा', deity: 'Visvedevas', rasi: 'Dhanus / Makara', lord: 'Sun', day: 18, date: '2026-12-12', type: 'REGULAR' },
    { name: 'Sravana', name_te: 'శ్రవణ', name_hi: 'श्रवण', deity: 'Vishnu', rasi: 'Makara', lord: 'Moon', day: 19, date: '2026-12-13', type: 'REGULAR' },
    { name: 'Dhanishta', name_te: 'ధనిష్ట', name_hi: 'धनिष्ठा', deity: 'Ashta Vasus', rasi: 'Makara / Kumbha', lord: 'Mars', day: 20, date: '2026-12-14', type: 'SARPA_SUKTA', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Sarpa Sukta Homam' },
    { name: 'Satabhisham', name_te: 'శతభిషం', name_hi: 'शतभिषा', deity: 'Varuna', rasi: 'Kumbha', lord: 'Rahu', day: 21, date: '2026-12-15', type: 'CHANDI', specialSevaId: 'sampoorna-visesha-nakshatra-seva', specialSevaName: 'Nakshatra Shanthi with Chandi Homam' },
    { name: 'Purvabhadra', name_te: 'పూర్వాభాద్ర', name_hi: 'पूर्वाभाद्रपद', deity: 'Aja Ekapada', rasi: 'Kumbha / Meena', lord: 'Jupiter', day: 22, date: '2026-12-16', type: 'REGULAR' },
    { name: 'Uttarabhadra', name_te: 'ఉత్తరాభాద్ర', name_hi: 'उत्तराभाद्रपद', deity: 'Ahirbudhnya', rasi: 'Meena', lord: 'Saturn', day: 23, date: '2026-12-17', type: 'REGULAR' },
    { name: 'Revathi', name_te: 'రేవతి', name_hi: 'रेवती', deity: 'Pushan', rasi: 'Meena', lord: 'Mercury', day: 24, date: '2026-12-18', type: 'REGULAR' }
  ];

  for (const n of rawNakshatras) {
    await client.query(`
      INSERT INTO public.nakshatras (
        name, name_te, name_hi, deity, rasi, lord, programme_date, day_number, day_type, special_seva_id, special_seva_name, active, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW()
      )
      ON CONFLICT (name) DO UPDATE SET
        name_te = EXCLUDED.name_te,
        name_hi = EXCLUDED.name_hi,
        deity = EXCLUDED.deity,
        rasi = EXCLUDED.rasi,
        lord = EXCLUDED.lord,
        programme_date = EXCLUDED.programme_date,
        day_number = EXCLUDED.day_number,
        day_type = EXCLUDED.day_type,
        special_seva_id = EXCLUDED.special_seva_id,
        special_seva_name = EXCLUDED.special_seva_name,
        active = true,
        updated_at = NOW();
    `, [
      n.name, n.name_te, n.name_hi, n.deity, n.rasi, n.lord, n.date, n.day, n.type, n.specialSevaId || null, n.specialSevaName || null
    ]);
  }
  console.log(`✅ Seeded 27 Janma Nakshatras!`);

  console.log('\n=== Step 6: Initializing Seva Availability Ledger for All 28 Days ===');
  for (const s of rawSchedule) {
    for (const seva of approvedSevas) {
      await client.query(`
        INSERT INTO public.seva_availability (
          date, seva_id, capacity, booked_count, status, updated_at
        ) VALUES (
          $1, $2, $3, 0, 'AVAILABLE', NOW()
        )
        ON CONFLICT (date, seva_id) DO NOTHING;
      `, [s.date, seva.id, seva.capacity]);
    }
  }
  console.log(`✅ Initialized Seva Availability records for 28 days!`);

  console.log('\n=== Step 7: Seeding Live Stream Configuration & Site Settings ===');
  await client.query(`
    INSERT INTO public.live_stream (
      id, live_url, title, description, is_live, platform, channel_name, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000001',
      'https://www.youtube.com/watch?v=live_stream_placeholder',
      'Sri Ati Rudra Mahayagnam 2026 — Live Telecast from Sri Kshetram',
      'Watch continuous live streaming of holy homams, Rudra Parayanam, and evening Harathi.',
      false,
      'youtube',
      'Srikari Ati Rudram Official',
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      updated_at = NOW();
  `);

  const settings = [
    { key: 'site_title', value: JSON.stringify('Srikari Ati Rudra Mahayagnam 2026'), description: 'Official Website Title' },
    { key: 'kalyanam_amount', value: JSON.stringify(5116), description: 'Krithika Day Subramanyeswara Swamy Kalyanam Seva Amount' },
    { key: 'annadanam_slot_amount', value: JSON.stringify(5116), description: 'Per Day Annadanam Sponsorship Amount' },
    { key: 'nakshatra_hawan_amount', value: JSON.stringify(216), description: 'Nakshatra Hawan Minimum Contribution' },
    { key: 'contact_phone', value: JSON.stringify('+91 94904 62652'), description: 'Yajna Committee Contact Phone' },
    { key: 'contact_email', value: JSON.stringify('contact@srikariatirudram.org'), description: 'Official Contact Email' },
    { key: 'event_dates', value: JSON.stringify({ start: '2026-11-25', end: '2026-12-22' }), description: 'Mahayagnam Official Dates' },
    { key: 'venue_address', value: JSON.stringify('Srikari Sri Kshetram, Yajna Vedika, Hyderabad, Telangana, India'), description: 'Event Venue' }
  ];

  for (const item of settings) {
    await client.query(`
      INSERT INTO public.site_settings (key, value, description, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        description = EXCLUDED.description,
        updated_at = NOW();
    `, [item.key, item.value, item.description]);
  }
  console.log(`✅ Seeded default Site Settings & Live Stream config!`);

  console.log('\n=== Step 8: Seeding Sample Confirmed Bookings for Real Data Display ===');
  const sampleBookings = [
    {
      booking_id: 'SAR-2026-000101',
      seva_id: 'sampoorna-visesha-nakshatra-seva',
      seva_name: 'SAMPOORNA VISESHA NAKSHATRA SEVA',
      amount: 12116,
      date: '2026-11-26',
      day: 2,
      nakshatra: 'Mrigasira',
      rasi: 'Vrishabha',
      full_name: 'Dr. Venkata Rama Sharma',
      phone: '+91 98480 12345',
      email: 'dr.sharma@example.com',
      gotram: 'Kasyapa',
      sankalpam_names: 'Venkata Rama Sharma, Gayatri, Srikar',
      payment_status: 'SUCCESS',
      booking_status: 'CONFIRMED',
      attendance: 'PENDING',
      tx: 'UPI/TXN984801234567'
    },
    {
      booking_id: 'SAR-2026-000102',
      seva_id: 'ekadasa-rudra-abhishekam',
      seva_name: 'EKADASA RUDRA ABHISHEKAM',
      amount: 5116,
      date: '2026-11-25',
      day: 1,
      nakshatra: 'Rohini',
      rasi: 'Vrishabha',
      full_name: 'M. Sridhar Reddy',
      phone: '+91 99890 54321',
      email: 'sridhar.reddy@example.com',
      gotram: 'Palamooru',
      sankalpam_names: 'M. Sridhar Reddy, Sarala Devi',
      payment_status: 'SUCCESS',
      booking_status: 'CONFIRMED',
      attendance: 'PRESENT',
      tx: 'UPI/TXN998905432189'
    },
    {
      booking_id: 'SAR-2026-000103',
      seva_id: 'maha-rudra-japam-and-homam',
      seva_name: 'MAHA RUDRA JAPAM & HOMAM',
      amount: 11116,
      date: '2026-11-27',
      day: 3,
      nakshatra: 'Arudra',
      rasi: 'Mithuna',
      full_name: 'Ch. Satyanarayana Murthy',
      phone: '+91 94401 98765',
      email: 'satya.murthy@example.com',
      gotram: 'Bharadwaja',
      sankalpam_names: 'Satyanarayana Murthy, Lakshmi, Teja',
      payment_status: 'SUCCESS',
      booking_status: 'CONFIRMED',
      attendance: 'PENDING',
      tx: 'UPI/TXN944019876543'
    }
  ];

  for (const b of sampleBookings) {
    await client.query(`
      INSERT INTO public.bookings (
        booking_id, seva_id, seva_name, amount, selected_date, day_number, nakshatra, rasi,
        full_name, phone_number, email, gotram, sankalpam_names, payment_status, booking_status, attendance, transaction_id, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
      )
      ON CONFLICT (booking_id) DO NOTHING;
    `, [
      b.booking_id, b.seva_id, b.seva_name, b.amount, b.date, b.day, b.nakshatra, b.rasi,
      b.full_name, b.phone, b.email, b.gotram, b.sankalpam_names, b.payment_status, b.booking_status, b.attendance, b.tx
    ]);

    // Upsert devotee CRM profile
    await client.query(`
      INSERT INTO public.devotees (
        full_name, phone_number, email, gotram, nakshatram, rasi, total_bookings, total_donated, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 1, $7, NOW()
      )
      ON CONFLICT (phone_number) DO UPDATE SET
        total_bookings = public.devotees.total_bookings + 1,
        total_donated = public.devotees.total_donated + EXCLUDED.total_donated,
        updated_at = NOW();
    `, [b.full_name, b.phone, b.email, b.gotram, b.nakshatra, b.rasi, b.amount]);

    // Update seva_availability booked_count
    await client.query(`
      UPDATE public.seva_availability
      SET booked_count = booked_count + 1
      WHERE date = $1 AND seva_id = $2;
    `, [b.date, b.seva_id]);
  }
  console.log(`✅ Seeded sample confirmed bookings and updated Devotee CRM!`);

  console.log('\n=== Step 9: Seeding Sample Annadanam Sponsors & Announcements ===');
  await client.query(`
    INSERT INTO public.annadanam (
      date, day_number, sponsor_name, mobile, email, amount, occasion, display_name, payment_status, status
    ) VALUES 
    ('2026-11-25', 1, 'Sri G. Ramakrishna & Family', '+91 98490 11223', 'ramakrishna@example.com', 10116, 'In loving memory of Parents', 'Late Sri G. Venkatappaiah Garu', 'SUCCESS', 'CONFIRMED'),
    ('2026-11-26', 2, 'Smt. K. Vani & Sri K. Suresh', '+91 97000 33445', 'suresh.vani@example.com', 5116, '25th Wedding Anniversary', 'Sri Suresh & Vani Kutumbam', 'SUCCESS', 'CONFIRMED')
    ON CONFLICT DO NOTHING;
  `);

  await client.query(`
    INSERT INTO public.announcements (
      title, description, start_date, priority, active
    ) VALUES (
      'Grand Ati Rudra Mahayagnam Online Seva Registrations Open',
      'Devotees across the world can now perform Sankalpam on their Janma Nakshatra days through the official portal.',
      CURRENT_DATE,
      'HIGH',
      true
    )
    ON CONFLICT DO NOTHING;
  `);

  await client.end();
  console.log('\n🎉 ALL DATABASE INITIALIZATION & SEEDING COMPLETED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
