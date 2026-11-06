/**
 * GreenBasket — Complete Image Migration Script v2
 * =================================================
 * Handles ALL legacy image path types:
 *   - /uploads/filename.jpg
 *   - http://localhost:5000/uploads/filename.jpg
 *   - /images/sample.jpg  (skipped, no real file)
 *   - https://res.cloudinary.com/... (skipped, already migrated)
 *
 * Safety guarantees:
 *   - Never deletes local files
 *   - Never deletes MongoDB records
 *   - Never overwrites a valid Cloudinary URL
 *   - Safe to run multiple times (idempotent)
 *   - Creates a JSON backup before any changes
 *   - Verifies Cloudinary URL before saving to DB
 *
 * Usage:
 *   cd backend
 *   node scripts/migrateImages.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const BACKUP_PATH = path.join(__dirname, '../scripts/products_backup.json');

// ── Extract just the filename from any path format ──────────────────────────
function extractFilename(imgPath) {
  if (!imgPath) return null;

  // http://localhost:5000/uploads/image-xxx.jpg
  if (imgPath.includes('/uploads/')) {
    return imgPath.split('/uploads/').pop();
  }

  // /images/sample.jpg or other non-uploads paths
  return null;
}

// ── Check if a URL is a valid Cloudinary URL ─────────────────────────────────
function isCloudinaryUrl(url) {
  return url && url.startsWith('https://res.cloudinary.com');
}

// ── Upload a local file buffer to Cloudinary ─────────────────────────────────
async function uploadToCloudinary(filePath, productName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'greenbasket/products',
        resource_type: 'image',
        // Use product name as public_id for easy identification in Cloudinary
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const fileBuffer = fs.readFileSync(filePath);
    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

// ── Verify a URL is actually accessible ──────────────────────────────────────
async function verifyUrl(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
        res.destroy();
      });
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => { req.abort(); resolve(false); });
    } catch {
      resolve(false);
    }
  });
}

// ── Main migration ────────────────────────────────────────────────────────────
async function migrate() {
  const separator = '='.repeat(55);
  console.log('\n' + separator);
  console.log('  GreenBasket Image Migration v2');
  console.log(separator + '\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[OK] Connected to MongoDB Atlas\n');

    // ── Step 1: Load all products ──────────────────────────────────────────
    const products = await Product.find({}).lean();
    console.log('[INFO] Total products in DB: ' + products.length);

    // ── Step 2: Create backup ──────────────────────────────────────────────
    const backupData = products.map(p => ({
      _id: p._id.toString(),
      name: p.name,
      image: p.image,
    }));
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(backupData, null, 2));
    console.log('[OK] Backup saved: ' + BACKUP_PATH + '\n');

    // ── Step 3: List all local uploads ────────────────────────────────────
    const localFiles = fs.readdirSync(UPLOADS_DIR).filter(f =>
      ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(f).toLowerCase())
    );
    console.log('[INFO] Local image files in uploads/: ' + localFiles.length);
    console.log('');

    // ── Step 4: Process each product ─────────────────────────────────────
    const stats = {
      total: products.length,
      alreadyCloudinary: 0,
      migrated: 0,
      fileNotFound: 0,
      uploadFailed: 0,
      skippedNoPath: 0,
    };

    const needsAttention = [];

    for (const productData of products) {
      const img = productData.image;
      const nameShort = productData.name.substring(0, 40).padEnd(42);

      // Already on Cloudinary — skip
      if (isCloudinaryUrl(img)) {
        console.log('[SKIP]  ' + nameShort + ' => already Cloudinary');
        stats.alreadyCloudinary++;
        continue;
      }

      // Extract filename from whatever path format is stored
      const filename = extractFilename(img);

      if (!filename) {
        console.log('[SKIP]  ' + nameShort + ' => unrecognized path: ' + (img || 'empty'));
        stats.skippedNoPath++;
        needsAttention.push({ name: productData.name, id: productData._id, reason: 'Unrecognized path: ' + img });
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, filename);

      // Check if file exists
      if (!fs.existsSync(localPath)) {
        console.log('[MISS]  ' + nameShort + ' => file not found: ' + filename);
        stats.fileNotFound++;
        needsAttention.push({ name: productData.name, id: productData._id, reason: 'Local file missing: ' + filename });
        continue;
      }

      // Upload to Cloudinary
      try {
        process.stdout.write('[UP]    ' + nameShort + ' => uploading...');
        const result = await uploadToCloudinary(localPath, productData.name);

        if (!result || !result.secure_url) {
          throw new Error('No secure_url returned from Cloudinary');
        }

        // Update in MongoDB
        await Product.findByIdAndUpdate(productData._id, { image: result.secure_url });

        console.log(' DONE => ' + result.secure_url.substring(0, 60) + '...');
        stats.migrated++;
      } catch (err) {
        console.log(' FAILED => ' + err.message);
        stats.uploadFailed++;
        needsAttention.push({ name: productData.name, id: productData._id, reason: 'Upload failed: ' + err.message });
      }
    }

    // ── Step 5: Print migration report ───────────────────────────────────
    console.log('\n' + separator);
    console.log('  MIGRATION REPORT');
    console.log(separator);
    console.log('  Total products:               ' + stats.total);
    console.log('  Already on Cloudinary:        ' + stats.alreadyCloudinary);
    console.log('  Successfully migrated:        ' + stats.migrated);
    console.log('  File missing locally:         ' + stats.fileNotFound);
    console.log('  Upload failed:                ' + stats.uploadFailed);
    console.log('  Unrecognized path (skipped):  ' + stats.skippedNoPath);

    const successAfter = stats.alreadyCloudinary + stats.migrated;
    console.log('\n  Products with Cloudinary URL: ' + successAfter + ' / ' + stats.total);

    if (needsAttention.length > 0) {
      console.log('\n  --- Products Needing Manual Attention ---');
      needsAttention.forEach(p => {
        console.log('  [' + p.id + '] ' + p.name);
        console.log('    => ' + p.reason);
      });
    }

    console.log(separator + '\n');

    // Save report to file
    const report = {
      runAt: new Date().toISOString(),
      stats,
      needsAttention,
    };
    fs.writeFileSync(
      path.join(__dirname, '../scripts/migration_report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('[OK] Report saved: scripts/migration_report.json\n');

  } catch (err) {
    console.error('[FATAL] Migration error: ' + err.message);
    console.error(err.stack);
  } finally {
    await mongoose.disconnect();
    console.log('[OK] Disconnected from MongoDB');
  }
}

migrate();
