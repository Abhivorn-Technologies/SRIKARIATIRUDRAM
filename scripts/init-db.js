const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { Client } = require('pg');

async function initDb() {
  console.log('Testing Supabase PostgreSQL connection...');
  
  // Try DIRECT_URL or DATABASE_URL
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  console.log('Using connection string:', connectionString ? connectionString.replace(/:[^:@]+@/, ':****@') : 'None');

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL successfully!');

    const sqlPath = path.resolve(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying schema.sql to Supabase...');
    await client.query(sql);
    console.log('✅ Tables "media_assets" and "seva_bookings" created/verified successfully!');

    // Check table rows
    const res = await client.query('SELECT count(*) FROM public.media_assets;');
    console.log('Current media_assets count:', res.rows[0].count);

    await client.end();
  } catch (err) {
    console.error('❌ Database connection or query error:', err.message);
    if (client) await client.end().catch(() => {});
  }
}

initDb();
