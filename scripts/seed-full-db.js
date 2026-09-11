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
        "id": "ati-rudram-donation",
        "slug": "ati-rudram-donation",
        "title": "Ati Rudram Donation",
        "title_te": "అతి రుద్రం పవిత్ర విరాళం",
        "title_hi": "अति रुद्रम दान",
        "amount": 216,
        "short_desc": "Support the sacred Srikari Ati Rudra Mahayajnam through this contribution.",
        "short_desc_te": "ఈ పవిత్ర విరాళం ద్వారా శ్రీకరీ అతిరుద్ర మహాయజ్ఞ నిర్వహణలో భాగస్వామ్యం పొందండి.",
        "short_desc_hi": "इस पावन योगदान के माध्यम से श्रीकरी अति रुद्र महायज्ञ में सहयोग करें।",
        "full_desc": "Support the sacred Srikari Ati Rudra Mahayajnam through this contribution. Voluntary offerings are dedicated towards the sacred chanting of 14,641 Sri Rudrams, Veda Samrakshana, and Lokakalyanam.",
        "full_desc_te": "శ్రీకరీ అతిరుద్ర మహాయజ్ఞ నిర్వహణ కొరకు భక్తులు సమర్పించే పవిత్ర విరాళం. లోకకళ్యాణార్థం మీ కుటుంబ క్షేమం కొరకు ప్రార్థించబడును.",
        "full_desc_hi": "श्रीकरी अति रुद्र महायज्ञ के पावन आयोजन में सहयोग हेतु यह पवित्र दान अर्पित करें।",
        "category": "donation",
        "icon": "🕉️",
        "duration": "Entire Event",
        "time": "Daily Rituals (25 Nov – 22 Dec 2026)",
        "capacity": 1000,
        "active": true,
        "featured": false,
        "sort_order": 1,
        "benefits": "[\"Direct participation in Lokakalyanam resolve\",\"Divine blessings of Lord Shiva\",\"Digital Seva Certificate included\"]",
        "prasadam": "[\"Blessed Vibhuti (Bhasma)\",\"Digital Blessing Certificate\"]"
    },
    {
        "id": "ekadasa-rudra-abhishekam",
        "slug": "ekadasa-rudra-abhishekam",
        "title": "Ekadasa Rudra Abhishekam",
        "title_te": "ఏకాదశ రుద్ర అభిషేకం",
        "title_hi": "एकादश रुद्र अभिषेक",
        "amount": 5116,
        "short_desc": "Participate in Ekadasa Rudra Abhishekam with Sankalpam.",
        "short_desc_te": "సంకల్పంతో ఏకాదశ రుద్ర అభిషేకంలో పాల్గొనండి.",
        "short_desc_hi": "संकल्प के साथ एकादश रुद्र अभिषेक में भाग लें।",
        "full_desc": "Consecrated Vedic scholars chant Sri Rudram with 11 sacred dravyas (milk, honey, curd, ghee, cane juice, tender coconut water, bhasma, bilva leaves, fragrant water). Dissolves karmic debts and bestows inner tranquility.",
        "full_desc_te": "వేద పండితుల మంత్రోచ్ఛారణల మధ్య 11 పవిత్ర ద్రవ్యాలతో ఏకాదశ రుద్రాభిషేకం నిర్వహించబడును. సర్వపాప నివారణ మరియు మనశ్శాంతి చేకూరుతుంది.",
        "full_desc_hi": "11 पावन द्रव्यों एवं मंत्रोच्चार के साथ एकादश रुद्राभिषेक में संकल्प सहित सहभागिता।",
        "category": "abhishekam",
        "icon": "🔱",
        "duration": "2 Hours",
        "time": "07:30 AM – 09:30 AM Daily",
        "capacity": 45,
        "active": true,
        "featured": true,
        "sort_order": 2,
        "benefits": "[\"Relief from chronic ailments & mental anxiety\",\"Harmonious family life & spiritual elevation\",\"Neutralizes planetary doshas\"]",
        "prasadam": "[\"Blessed Vibhuti (Bhasma)\",\"Kumkuma\",\"Sacred Raksha Sutra\",\"Silver Shiva Coin\"]"
    },
    {
        "id": "nakshatra-shanthi",
        "slug": "nakshatra-shanthi",
        "title": "Nakshatra Shanthi",
        "title_te": "నక్షత్ర శాంతి",
        "title_hi": "नक्षत्र शांति",
        "amount": 10116,
        "short_desc": "Complete Janma Nakshatra Shanthi performed with Sankalpam in the devotee's name.",
        "short_desc_te": "భక్తుని పేరిట సంకల్పంతో నిర్వహించే సంపూర్ణ జన్మ నక్షత్ర శాంతి హోమం.",
        "short_desc_hi": "भक्त के नाम से संकल्प सहित संपूर्ण जन्म नक्षत्र शांति।",
        "full_desc": "Complete Janma Nakshatra Shanthi performed with Sankalpam in the devotee's name during the 28-day Rohini-to-Rohini Mahayagnam cycle. Vedic oblations of sacred samidhas and pure desi cow ghee are offered into the Maha Homa Kundam in your Gotram and family names.",
        "full_desc_te": "28 రోజుల మహాయజ్ఞంలో భక్తుని పేరిట విశేష సంకల్పంతో సంపూర్ణ జన్మ నక్షత్ర శాంతి హోమం నిర్వహించబడును. సమస్త గ్రహ దోష నివారణ మరియు సంపూర్ణ శాంతి ప్రదాయకం.",
        "full_desc_hi": "28 दिवसीय महायज्ञ में भक्त के गोत्र-नाम से संपूर्ण जन्म नक्षत्र शांति महाहवन।",
        "category": "homam",
        "icon": "⭐",
        "duration": "3 Hours",
        "time": "08:30 AM – 11:30 AM on Janma Nakshatra Day",
        "capacity": 35,
        "active": true,
        "featured": true,
        "sort_order": 3,
        "benefits": "[\"Complete Janma Nakshatra Shanthi & planetary dosha nivarana\",\"Special Sankalpam in devotee's Gotram and family names\",\"Yajna Raksha, Silver Shiva Coin & consecrated Prasadam kit\"]",
        "prasadam": "[\"Nakshatra Yantra Card\",\"Blessed Yajna Bhasma\",\"Silver Shiva Coin\",\"Raksha Sutram\"]"
    },
    {
        "id": "chandi-homam",
        "slug": "chandi-homam",
        "title": "Chandi Homam",
        "title_te": "చండీ హోమం",
        "title_hi": "चंडी होम",
        "amount": 12116,
        "short_desc": "Participate in the sacred Chandi Homam with Sankalpam.",
        "short_desc_te": "సంకల్పంతో పవిత్ర చండీ హోమంలో పాల్గొనండి.",
        "short_desc_hi": "संकल्प के साथ पवित्र चंडी होम में भाग लें।",
        "full_desc": "A powerful Vedic ritual performed on designated Visesha Nakshatra days (Ardra: 27 Nov, Swathi: 6 Dec, Satabhisham: 15 Dec 2026). Combines complete Janma Nakshatra Shanthi with the supreme Durga Saptashati Chandi Homa.",
        "full_desc_te": "విశేష నక్షత్ర దినములలో (ఆర్ద్ర: 27 నవంబర్, స్వాతి: 6 డిసెంబర్, శతాభిషం: 15 డిసెంబర్ 2026) సంపూర్ణ నక్షత్ర శాంతితో పాటు దేవీ దుర్గా సప్తశతి మంత్రాలతో నిర్వహించే మహా చండీ హోమం.",
        "full_desc_hi": "विशेष नक्षत्र दिवसों (आर्द्रा, स्वाति, शतभिषा) पर दुर्गा सप्तशती के महामंत्रों सहित चंडी होम।",
        "category": "homam",
        "icon": "🔥",
        "duration": "3.5 Hours",
        "time": "08:30 AM – 12:00 PM (27 Nov, 6 Dec, 15 Dec)",
        "capacity": 25,
        "active": true,
        "featured": true,
        "sort_order": 4,
        "benefits": "[\"Nakshatra Shanthi with sacred Chandi Homam\",\"Dissolves deep karmic obstacles and malefic planetary afflictions\",\"Consecrated dates: 27 Nov (Ardra), 6 Dec (Swathi), 15 Dec (Satabhisham)\"]",
        "prasadam": "[\"Chandi Raksha Yantra\",\"Kumkuma Prasadam\",\"Silver Coin\",\"Vibhuti & Akshatas\"]"
    },
    {
        "id": "sarpa-suktam-homam",
        "slug": "sarpa-suktam-homam",
        "title": "Sarpa Suktam Homam",
        "title_te": "సర్ప సూక్తం హోమం",
        "title_hi": "सर्प सूक्तम होम",
        "amount": 12116,
        "short_desc": "Participate in the sacred Sarpa Sukta Homam with Sankalpam.",
        "short_desc_te": "సంకల్పంతో పవిత్ర సర్ప సూక్త హోమంలో పాల్గొనండి.",
        "short_desc_hi": "संकल्प के साथ पवित्र सर्प सूक्त होम में भाग लें।",
        "full_desc": "Performed on designated Visesha Nakshatras (Mrigasira: 26 Nov, Chitta: 5 Dec, Dhanishta: 14 Dec 2026). Combines complete Janma Nakshatra Shanthi with continuous Rigvedic Sarpa Suktam chanting and sacred oblations.",
        "full_desc_te": "విశేష నక్షత్ర దినములలో (మృగశిర: 26 నవంబర్, చిత్త: 5 డిసెంబర్, ధనిష్ఠ: 14 డిసెంబర్ 2026) సంపూర్ణ నక్షత్ర శాంతితో పాటు నిర్వహించే పవిత్ర సర్ప సూక్త హోమం.",
        "full_desc_hi": "विशेष नक्षत्र दिवसों (मृगशिरा, चित्रा, धनिष्ठा) पर ऋग्वैदिक सर्प सूक्त सहित महाहवन।",
        "category": "homam",
        "icon": "🐍",
        "duration": "3 Hours",
        "time": "09:00 AM – 12:00 PM (26 Nov, 5 Dec, 14 Dec)",
        "capacity": 25,
        "active": true,
        "featured": true,
        "sort_order": 5,
        "benefits": "[\"Nakshatra Shanthi with sacred Sarpa Sukta Homam\",\"Overcomes Kala Sarpa Dosha, Rahu-Ketu planetary obstacles\",\"Consecrated dates: 26 Nov (Mrigasira), 5 Dec (Chitta), 14 Dec (Dhanishta)\"]",
        "prasadam": "[\"Naga Raksha\",\"Silver Naga Pratima Coin\",\"Blessed Vibhuti\",\"Kumkuma\"]"
    },
    {
        "id": "ashlesha-bali",
        "slug": "ashlesha-bali",
        "title": "Ashlesha Bali",
        "title_te": "ఆశ్లేష బలి",
        "title_hi": "आश्लेषा बलि",
        "amount": 12116,
        "short_desc": "Participate in the prescribed Ashlesha Bali Seva with Sankalpam.",
        "short_desc_te": "సంకల్పంతో నిర్దేశిత ఆశ్లేష బలి సేవలో పాల్గొనండి.",
        "short_desc_hi": "संकल्प के साथ निर्दिष्ट आश्लेषा बलि सेवा में भाग लें।",
        "full_desc": "Conducted specifically on Aslesha Nakshatra (30 Nov 2026). A deeply revered Vedic offering combining complete Janma Nakshatra Shanthi with the sacred Aslesha Bali for neutralizing intense serpent doshas and pitru blockages.",
        "full_desc_te": "30 నవంబర్ 2026 ఆశ్లేష నక్షత్రం రోజున సంపూర్ణ నక్షత్ర శాంతితో పాటు ప్రత్యేక మండపంలో నిర్వహించే విశేష ఆశ్లేష బలి క్రతువు.",
        "full_desc_hi": "30 नवम्बर 2026 आश्लेषा नक्षत्र पर विशेष मंडप में आश्लेषा बलि एवं नक्षत्र शांति अनुष्ठान।",
        "category": "special",
        "icon": "🪔",
        "duration": "4 Hours",
        "time": "08:30 AM – 12:30 PM (30 Nov 2026)",
        "capacity": 15,
        "active": true,
        "featured": true,
        "sort_order": 6,
        "benefits": "[\"Nakshatra Shanthi with sacred Aslesha Bali\",\"Complete relief from severe Naga Dosha and Sarpa Shapam\",\"Dedicated Date: 30 Nov 2026 (Aslesha Nakshatram)\"]",
        "prasadam": "[\"Ashlesha Bali Raksha\",\"Consecrated Silver Token\",\"Vibhuti\",\"Kumkuma\"]"
    },
    {
        "id": "valli-devasena-subramanyeswara-kalyanam",
        "slug": "valli-devasena-subramanyeswara-kalyanam",
        "title": "Valli–Devasena Subramanyeswara Kalyanam",
        "title_te": "శ్రీ వల్లీ–దేవసేన సుబ్రహ్మణ్యేశ్వర కళ్యాణం",
        "title_hi": "श्री वल्ली–देवसेना सुब्रह्मण्येश्वर कल्याणम्",
        "amount": 1116,
        "short_desc": "Participate in the sacred Sri Valli–Devasena Sametha Subramanyeswara Swamy Kalyanam.",
        "short_desc_te": "శ్రీ వల్లీ–దేవసేన సమేత సుబ్రహ్మణ్యేశ్వర స్వామి దివ్య కళ్యాణోత్సవంలో పాల్గొనండి.",
        "short_desc_hi": "श्री वल्ली–देवसेना समेत सुब्रह्मण्येश्वर स्वामी दिव्य कल्याणोत्सव में भाग लें।",
        "full_desc": "Celebrated on Krittika Nakshatra (19 Dec 2026, Day 25). Devotees participating receive the boundless grace of Lord Kartikeya for marital harmony, courageous wisdom, removal of Kuja/Mars doshas, and children welfare.",
        "full_desc_te": "19 డిసెంబర్ 2026 (25వ రోజు) కృత్తిక నక్షత్రం రోజున నిర్వహించే అత్యంత పవిత్ర కళ్యాణ క్రతువు. కుజ దోష నివారణ మరియు సంతాన సౌభాగ్యం చేకూరును.",
        "full_desc_hi": "19 दिसम्बर 2026 कृत्तिका नक्षत्र पर श्री वल्ली-देवसेना समेत सुब्रह्मण्येश्वर स्वामी कल्याणोत्सव।",
        "category": "kalyanam",
        "icon": "🌺",
        "duration": "3 Hours",
        "time": "10:00 AM – 01:00 PM (19 Dec 2026)",
        "capacity": 50,
        "active": true,
        "featured": true,
        "sort_order": 7,
        "benefits": "[\"Removes Kuja Dosha (Manglik) and removes obstacles in marriage\",\"Bestows victory in righteous endeavors, valour, and children's welfare\",\"Dedicated Date: 19 Dec 2026 (Krittika Nakshatram, Day 25)\"]",
        "prasadam": "[\"Kalyana Akshatas\",\"Subramanya Raksha Thread\",\"Kumkum\",\"Vibhuti\"]"
    },
    {
        "id": "parvathi-parameswara-kalyanam",
        "slug": "parvathi-parameswara-kalyanam",
        "title": "Parvathi–Parameswara Maha Shanti Kalyanam",
        "title_te": "శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణం",
        "title_hi": "श्री पार्वती–परमेश्वर महा शांति कल्याणम्",
        "amount": 1116,
        "short_desc": "Participate in the sacred Sri Parvathi–Parameswara Maha Shanti Kalyanam.",
        "short_desc_te": "శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి దివ్య కళ్యాణోత్సవంలో పాల్గొనండి.",
        "short_desc_hi": "శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణోత్సవంలో పాల్గొనండి.",
        "full_desc": "The pinnacle concluding seva performed on Concluding Rohini Day (22 Dec 2026) along with Maha Purnahuti and Ashirvachanam. Bestows lasting family peace, longevity, universal auspiciousness and the pinnacle blessings of the 28-day Mahayagnam.",
        "full_desc_te": "22 డిసెంబర్ 2026 ముగింపు రోహిణి రోజున మహా పూర్ణాహుతి మరియు వేద పండితుల ఆశీర్వచనములతో నిర్వహించే సర్వోన్నత దివ్య కళ్యాణం.",
        "full_desc_hi": "22 दिसम्बर 2026 समापन रोहिणी दिवस पर महा पूर्णाहुति सहित दिव्य कल्याणोत्सव।",
        "category": "kalyanam",
        "icon": "🕉️",
        "duration": "4 Hours",
        "time": "09:00 AM – 01:30 PM (22 Dec 2026)",
        "capacity": 50,
        "active": true,
        "featured": true,
        "sort_order": 8,
        "benefits": "[\"Pinnacle blessings of the entire 28-Day Ati Rudra Mahayagnam\",\"Lifelong marital bliss, family harmony, health and universal peace\",\"Dedicated Date: 22 Dec 2026 (Concluding Rohini Day)\"]",
        "prasadam": "[\"Maha Purnahuti Bhasma\",\"Kalyana Raksha\",\"Silver Shiva Coin\",\"Sacred Kumkum & Akshatas\"]"
    },
    {
        "id": "one-day-annadanam",
        "slug": "one-day-annadanam",
        "title": "One-Day Annadanam",
        "title_te": "ఒక రోజు అన్నదానం",
        "title_hi": "एक दिवसीय अन्नदान",
        "amount": 25116,
        "short_desc": "Sponsor Annadanam for one complete day of the Srikari Ati Rudra Mahayajnam.",
        "short_desc_te": "శ్రీకరీ అతిరుద్ర మహాయజ్ఞంలో ఒక రోజు సంపూర్ణ అన్నదానాన్ని స్పాన్సర్ చేయండి.",
        "short_desc_hi": "श्रीकरी अति रुद्र महायज्ञ में एक संपूर्ण दिन के अन्नदान का प्रायोजन करें।",
        "full_desc": "Annadanam is praised in the Vedas as the supreme charity (Samam Danam Na Vidyate). Sponsoring one full day of Annadanam feeds all visiting devotees, ritwiks, and pilgrims during the 28-day Mahayagnam.",
        "full_desc_te": "అన్నదానం పరమోత్కృష్టమైన దానం. ఒక రోజు సంపూర్ణ అన్నదానాన్ని స్పాన్సర్ చేయడం ద్వారా వేలాది మంది భక్తులకు భోజన ప్రసాదం అందించబడుతుంది.",
        "full_desc_hi": "अन्नदान को वेदों में सर्वश्रेष्ठ दान कहा गया है। 28 दिवसीय महायज्ञ में एक दिन का संपूर्ण अन्नदान प्रायोजन।",
        "category": "annadanam",
        "icon": "🍲",
        "duration": "Full Day",
        "time": "11:30 AM – 04:00 PM & 07:30 PM – 09:30 PM",
        "capacity": 28,
        "active": true,
        "featured": true,
        "sort_order": 9,
        "benefits": "[\"Feeds thousands of devotees & Vedic ritwiks\",\"Supreme Punya of Annadanam\",\"Sponsor name displayed at Annadana Mandapam\"]",
        "prasadam": "[\"Maha Prasadam Kit\",\"Annapoorna Devi Coin\",\"Blessed Vibhuti & Kumkum\"]"
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
