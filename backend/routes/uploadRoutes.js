
const express = require("express");
const multer = require("multer");
const path = require("path");
const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Store uploaded images temporarily in memory
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const allowedExtensions = /\.(jpg|jpeg|png|webp|avif)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  const extname = allowedExtensions.test(
    path.extname(file.originalname)
  );

  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG, WEBP and AVIF images are allowed."));
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Please upload an image.");
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "greenbasket/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).send("Image upload failed.");
        }

        // Return URL as a string to preserve the old API response format
        return res.send(result.secure_url);
      }
    );

    Readable.from(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("Image upload failed.");
  }
});

module.exports = router;
