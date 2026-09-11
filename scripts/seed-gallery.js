const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { Client } = require('pg');

const galleryImages = [
  { id: 'g1', title: 'Sacred Yagasala & Kalasa Sthapana', title_te: 'పవిత్ర యాగశాల & కలశ స్థాపన', url: '/assets/gallary/g1.png', day_number: 1, category: 'rituals', nakshatra: 'Rohini' },
  { id: 'g2', title: 'Sri Rudra Maha Abhishekam', title_te: 'శ్రీ రుద్ర మహాభిషేకం', url: '/assets/gallary/g2.png', day_number: 2, category: 'rituals', nakshatra: 'Mrigasira' },
  { id: 'g3', title: 'Divya Shiva Alankara Darshanam', title_te: 'దివ్య శివాలంకార దర్శనం', url: '/assets/gallary/g3.png', day_number: 3, category: 'deities', nakshatra: 'Ardra' },
  { id: 'g4', title: 'Nitya Maha Annadanam', title_te: 'నిత్య మహా అన్నదానం', url: '/assets/gallary/g4.png', day_number: 4, category: 'annadanam', nakshatra: 'Punarvasu' },
  { id: 'g5', title: 'Sahasra Deepalankara Seva', title_te: 'సహస్ర దీపాలంకార సేవ', url: '/assets/gallary/g5.png', day_number: 5, category: 'rituals', nakshatra: 'Pushyami' },
  { id: 'g6', title: 'Veda Parayanam by Rithwiks', title_te: 'ఋత్విక్కులచే వేద పారాయణం', url: '/assets/gallary/g6.png', day_number: 6, category: 'vedic', nakshatra: 'Aslesha' },
  { id: 'g7', title: 'Poornahuti & Maha Mangala Harathi', title_te: 'పూర్ణాహుతి & మహా మంగళ హారతి', url: '/assets/gallary/g7.png', day_number: 7, category: 'rituals', nakshatra: 'Makha' },
  { id: 'g8', title: 'Sri Lalitha Sahasranama Kumkumarchana', title_te: 'శ్రీ లలితా సహస్రనామ కుంకుమార్చన', url: '/assets/gallary/g8.png', day_number: 8, category: 'rituals', nakshatra: 'Pubba' },
  { id: 'g9', title: 'Sri Subramanyeswara Kalyanam', title_te: 'శ్రీ సుబ్రహ్మణ్యేశ్వర కళ్యాణం', url: '/assets/gallary/g9.png', day_number: 9, category: 'rituals', nakshatra: 'Uttara' },
  { id: 'g12', title: 'Gaja Pooja & Go Pooja Vidhanam', title_te: 'గజ పూజ & గో పూజా విధానం', url: '/assets/gallary/g12.png', day_number: 12, category: 'rituals', nakshatra: 'Swathi' },
  { id: 'g13', title: 'Chandi Homa Kunda Archana', title_te: 'చండీ హోమ కుండార్చన', url: '/assets/gallary/g13.png', day_number: 13, category: 'rituals', nakshatra: 'Visakha' },
  { id: 'g14', title: 'Sri Parvathi Parameswara Kalyana Mahotsavam', title_te: 'శ్రీ పార్వతీ పరమేశ్వర కళ్యాణ మహోత్సవం', url: '/assets/gallary/g14.png', day_number: 14, category: 'rituals', nakshatra: 'Anuradha' },
  { id: 'g15', title: 'Rudra Trishathi Havana Karyakramam', title_te: 'రుద్ర త్రిశతీ హవన కార్యక్రమం', url: '/assets/gallary/g15.png', day_number: 15, category: 'rituals', nakshatra: 'Jyeshta' },
  { id: 'g16', title: 'Brahmasri Devotee Felicitations', title_te: 'బ్రహ్మశ్రీ భక్త సన్మానం', url: '/assets/gallary/g16.png', day_number: 16, category: 'vedic', nakshatra: 'Moola' },
  { id: 'g17', title: 'Panchamrutha Abhisheka Vaibhavam', title_te: 'పంచామృతాభిషేక వైభవం', url: '/assets/gallary/g17.png', day_number: 17, category: 'rituals', nakshatra: 'Poorvashadha' },
  { id: 'g18', title: 'Maha Kumbhabhisheka Teertha Prokshana', title_te: 'మహా కుంభాభిషేక తీర్థ ప్రోక్షణ', url: '/assets/gallary/g18.png', day_number: 18, category: 'rituals', nakshatra: 'Uttarashadha' },
  { id: 'g19', title: 'Veda Gnana Sabha & Anugraha Bhashanam', title_te: 'వేద జ్ఞాన సభ & అనుగ్రహ భాషణం', url: '/assets/gallary/g19.png', day_number: 19, category: 'vedic', nakshatra: 'Sravana' },
  { id: 'g20', title: 'Kavacha Dharana & Raksha Bandhanam', title_te: 'కవచ ధారణ & రక్షా బంధనం', url: '/assets/gallary/g20.png', day_number: 20, category: 'rituals', nakshatra: 'Dhanishta' },
  { id: 'g21', title: 'Siva Nama Sankeerthana', title_te: 'శివ నామ సంకీర్తన', url: '/assets/gallary/g21.png', day_number: 21, category: 'rituals', nakshatra: 'Satabhisham' },
  { id: 'g22', title: 'Avabhrutha Snana Mahotsavam', title_te: 'అవభృథ స్నాన మహోత్సవం', url: '/assets/gallary/g22.png', day_number: 22, category: 'rituals', nakshatra: 'Poorvabhadra' },
  { id: 'g23', title: 'Maha Poornahuti & Divya Prasada Vitarana', title_te: 'మహా పూర్ణాహుతి & దివ్య ప్రసాద వితరణ', url: '/assets/gallary/g23.png', day_number: 28, category: 'rituals', nakshatra: 'Rohini' }
];

const galleryVideos = [
  { id: 'v1', title: 'Sacred Maha Yagnashala Drone View', url: 'https://res.cloudinary.com/ic0bztee/video/upload/v1789120993/srikari_atirudram/MAINVD.mp4', day_number: 1, category: 'rituals' },
  { id: 'v2', title: 'Sri Rudrabhishekam Live Glimpse', url: 'https://res.cloudinary.com/ic0bztee/video/upload/v1789120993/srikari_atirudram/MAINVD.mp4', day_number: 2, category: 'rituals' },
  { id: 'v3', title: 'Maha Poornahuti Sacred Agni Ceremony', url: 'https://res.cloudinary.com/ic0bztee/video/upload/v1789120993/srikari_atirudram/MAINVD.mp4', day_number: 3, category: 'rituals' },
  { id: 'v4', title: 'Divya Mangala Harathi Darshanam', url: 'https://res.cloudinary.com/ic0bztee/video/upload/v1789120993/srikari_atirudram/MAINVD.mp4', day_number: 4, category: 'rituals' }
];

async function seedAllGallery() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log('Seeding 21 images into media_assets...');
  for (const img of galleryImages) {
    const sql = `
      INSERT INTO public.media_assets (
        key, name, title, media_type, secure_url, url, category, day_number, nakshatra, published, sort_order, created_at, updated_at
      ) VALUES ($1, $2, $3, 'image', $4, $4, $5, $6, $7, true, $6, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE SET
        title = EXCLUDED.title,
        day_number = EXCLUDED.day_number,
        nakshatra = EXCLUDED.nakshatra,
        secure_url = EXCLUDED.secure_url,
        url = EXCLUDED.url;
    `;
    await client.query(sql, [img.id, `${img.id}.png`, img.title, img.url, img.category, img.day_number, img.nakshatra]);
  }

  console.log('Seeding 4 videos into media_assets...');
  for (const vid of galleryVideos) {
    const sql = `
      INSERT INTO public.media_assets (
        key, name, title, media_type, secure_url, url, category, day_number, published, sort_order, created_at, updated_at
      ) VALUES ($1, $2, $3, 'video', $4, $4, $5, $6, true, $6, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE SET
        title = EXCLUDED.title,
        day_number = EXCLUDED.day_number,
        secure_url = EXCLUDED.secure_url,
        url = EXCLUDED.url;
    `;
    await client.query(sql, [vid.id, `${vid.id}.mp4`, vid.title, vid.url, vid.category, vid.day_number]);
  }

  const count = await client.query('SELECT count(*) FROM public.media_assets;');
  console.log('✅ Successfully seeded media assets! Total records in DB:', count.rows[0].count);
  await client.end();
}

seedAllGallery().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
