/**
 * db-audit.js - Check current image status in MongoDB
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function audit() {
  await mongoose.connect(process.env.MONGO_URI);
  const all = await Product.find({}).lean();
  
  const cloudinary = all.filter(p => p.image && p.image.includes('res.cloudinary.com'));
  const local = all.filter(p => p.image && p.image.startsWith('/uploads/'));
  const sample = all.filter(p => p.image === '/images/sample.jpg');
  const localhost = all.filter(p => p.image && p.image.startsWith('http://localhost'));
  const otherHttps = all.filter(p => p.image && p.image.startsWith('https://') && !p.image.includes('res.cloudinary.com'));
  const noImage = all.filter(p => !p.image);

  console.log('=== DATABASE IMAGE AUDIT ===');
  console.log('Total products:', all.length);
  console.log('  Cloudinary URLs (good):', cloudinary.length);
  console.log('  Local /uploads/ paths (need migration):', local.length);
  console.log('  localhost: URLs (broken):', localhost.length);
  console.log('  Other https:// URLs:', otherHttps.length);
  console.log('  Sample /images/sample.jpg:', sample.length);
  console.log('  No image:', noImage.length);
  console.log('');
  
  if (local.length > 0) {
    console.log('--- Local /uploads/ products ---');
    local.forEach(p => console.log('  [' + p._id + '] ' + p.name + ' => ' + p.image));
  }

  if (localhost.length > 0) {
    console.log('--- localhost: URL products ---');
    localhost.forEach(p => console.log('  [' + p._id + '] ' + p.name + ' => ' + p.image));
  }

  if (otherHttps.length > 0) {
    console.log('--- Other https: URL products ---');
    otherHttps.forEach(p => console.log('  [' + p._id + '] ' + p.name + ' => ' + p.image));
  }

  await mongoose.disconnect();
}

audit().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
