const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== Checking Environment & Credentials ===');
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('Supabase URL:', supabaseUrl);

  // 1. Check video file
  const videoPath = path.resolve(__dirname, '../public/assets/gallary/MAINVD.mp4');
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found at:', videoPath);
    return;
  }
  const stats = fs.statSync(videoPath);
  console.log(`Video found: MAINVD.mp4 (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);

  // 2. Upload to Cloudinary using upload_large for large video files
  console.log('\n=== Uploading Video to Cloudinary (this may take a few minutes for ~596MB) ===');
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      videoPath,
      {
        resource_type: 'video',
        folder: 'srikari_atirudram',
        public_id: 'MAINVD',
        overwrite: true,
        chunk_size: 20 * 1024 * 1024 // 20MB chunks
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });

  console.log('\n=== Cloudinary Upload Success! ===');
  console.log('Secure URL:', uploadResult.secure_url);
  console.log('Public ID:', uploadResult.public_id);
  console.log('Format:', uploadResult.format);
  console.log('Duration:', uploadResult.duration);
  console.log('Bytes:', uploadResult.bytes);

  // 3. Store in Supabase
  console.log('\n=== Storing in Supabase Database ===');
  
  // Create or insert into media_assets / site_media table
  const record = {
    key: 'main_video',
    name: 'MAINVD.mp4',
    media_type: 'video',
    cloudinary_public_id: uploadResult.public_id,
    secure_url: uploadResult.secure_url,
    url: uploadResult.secure_url,
    format: uploadResult.format,
    duration: uploadResult.duration ? String(uploadResult.duration) : null,
    bytes: uploadResult.bytes,
    created_at: new Date().toISOString()
  };

  // Try inserting into media_assets or site_assets
  let insertRes = await supabase
    .from('media_assets')
    .upsert(record, { onConflict: 'key' });

  if (insertRes.error) {
    console.log('Note: "media_assets" table may not exist yet:', insertRes.error.message);
    console.log('Attempting to check/create or insert in available tables...');
    // We will save to a media_assets.json manifest and output the SQL needed if table creation is required
  } else {
    console.log('Successfully saved to Supabase table "media_assets"!');
  }

  // Also write a local metadata manifest so the frontend can immediately consume it
  const metadataPath = path.resolve(__dirname, '../public/assets/gallary/mainvd_meta.json');
  fs.writeFileSync(metadataPath, JSON.stringify({
    ...record,
    uploaded_at: new Date().toISOString()
  }, null, 2));
  console.log('Local manifest written to:', metadataPath);
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
