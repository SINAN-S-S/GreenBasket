
const express = require('express');
const multer = require('multer');
const path = require('path');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter(req, file, cb) {
    const allowedExtensions = /\.(jpg|jpeg|png|webp|avif)$/i;
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ];

    const validExtension = allowedExtensions.test(
      path.extname(file.originalname)
    );
    const validMimeType = allowedMimeTypes.includes(file.mimetype);

    if (validExtension && validMimeType) {
      return cb(null, true);
    }

    cb(new Error('Only JPG, JPEG, PNG, WEBP and AVIF images are allowed.'));
  },
});

// POST /api/upload — protected: admin only
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image.' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'greenbasket/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    return res.status(200).json({ url: result.secure_url });

  } catch (error) {
    // Multer errors (file too large, wrong type, etc.)
    if (error.name === 'MulterError' || error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({ message: 'Image upload failed. Please try again.' });
  }
});

module.exports = router;
