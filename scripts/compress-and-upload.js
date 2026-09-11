const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const cloudinary = require('cloudinary').v2;
const { Client } = require('pg');

const ffmpegPath = require('ffmpeg-static');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function main() {
  console.log('=== Step 1: Check Input Video ===');
  const inputVideo = path.resolve(__dirname, '../public/assets/gallary/MAINVD.mp4');
  const outputVideo = path.resolve(__dirname, '../public/assets/gallary/MAINVD_optimized.mp4');

  if (!fs.existsSync(inputVideo)) {
    throw new Error('Input video not found: ' + inputVideo);
  }

  const inputSizeMB = (fs.statSync(inputVideo).size / (1024 * 1024)).toFixed(2);
  console.log(`Original video: ${inputVideo} (${inputSizeMB} MB)`);

  // Step 2: Optimizing Video with FFmpeg
  console.log('\n=== Step 2: Optimizing Video with FFmpeg for Web & Cloudinary (<90MB) ===');
  console.log('FFmpeg binary:', ffmpegPath);

  // Target 75 MB output size to strictly fit Cloudinary's 100MB free tier limit
  // 720p HD with 2-pass/constrained bitrate gives great quality
  const ffmpegArgs = [
    '-y',
    '-i', inputVideo,
    '-vf', 'scale=-2:720',
    '-c:v', 'libx264',
    '-crf', '30',
    '-maxrate', '1800k',
    '-bufsize', '3600k',
    '-preset', 'veryfast',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '96k',
    outputVideo
  ];

  await new Promise((resolve, reject) => {
    const proc = execFile(ffmpegPath, ffmpegArgs);
    proc.stderr.on('data', (data) => {
      // Print progress lines
      const str = data.toString();
      if (str.includes('time=')) {
        process.stdout.write(`\r[FFmpeg] ${str.split('\n')[0].trim()}`);
      }
    });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
    proc.on('error', reject);
  });

  const outputSizeMB = (fs.statSync(outputVideo).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Optimization complete! Output size: ${outputSizeMB} MB (Original: ${inputSizeMB} MB)`);

  // Step 3: Upload to Cloudinary
  console.log('\n=== Step 3: Uploading Optimized Video to Cloudinary ===');
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      outputVideo,
      {
        resource_type: 'video',
        folder: 'srikari_atirudram',
        public_id: 'MAINVD',
        overwrite: true,
        chunk_size: 10 * 1024 * 1024
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });

  console.log('\n🎉 Cloudinary Upload Successful!');
  console.log('Public ID:', uploadResult.public_id);
  console.log('Secure URL:', uploadResult.secure_url);
  console.log('Format:', uploadResult.format);
  console.log('Duration (s):', uploadResult.duration);
  console.log('Size (Bytes):', uploadResult.bytes);

  // Step 4: Store in Supabase
  console.log('\n=== Step 4: Saving Record to Supabase PostgreSQL Database ===');
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const upsertQuery = `
    INSERT INTO public.media_assets (
      key, name, media_type, cloudinary_public_id, secure_url, url, format, duration, bytes, metadata, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
    )
    ON CONFLICT (key) DO UPDATE SET
      cloudinary_public_id = EXCLUDED.cloudinary_public_id,
      secure_url = EXCLUDED.secure_url,
      url = EXCLUDED.url,
      format = EXCLUDED.format,
      duration = EXCLUDED.duration,
      bytes = EXCLUDED.bytes,
      metadata = EXCLUDED.metadata,
      updated_at = NOW()
    RETURNING *;
  `;

  const values = [
    'main_video',
    'MAINVD.mp4',
    'video',
    uploadResult.public_id,
    uploadResult.secure_url,
    uploadResult.secure_url,
    uploadResult.format,
    uploadResult.duration ? String(uploadResult.duration) : null,
    uploadResult.bytes,
    JSON.stringify({
      width: uploadResult.width,
      height: uploadResult.height,
      resource_type: uploadResult.resource_type,
      original_filename: uploadResult.original_filename
    })
  ];

  const res = await client.query(upsertQuery, values);
  console.log('✅ Record saved in Supabase media_assets table:');
  console.log(res.rows[0]);

  await client.end();

  // Also write local metadata manifest
  const metadataPath = path.resolve(__dirname, '../public/assets/gallary/mainvd_meta.json');
  fs.writeFileSync(metadataPath, JSON.stringify({
    ...res.rows[0],
    uploaded_at: new Date().toISOString()
  }, null, 2));

  console.log('\n✨ ALL DONE! Video is hosted on Cloudinary and registered in Supabase.');
}

main().catch((err) => {
  console.error('\n❌ Execution Error:', err);
  process.exit(1);
});
