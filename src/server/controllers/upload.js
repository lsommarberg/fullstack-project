const express = require('express');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { userExtractor } = require('../utils/middleware');
const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided',
    });
  }

  const imageUrl = req.file.path;
  const publicId = req.file.filename;

  res.json({
    success: true,
    url: imageUrl,
    secure_url: imageUrl,
    publicId: publicId,
    message: 'Image uploaded successfully',
  });
});

router.delete('/', userExtractor, async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(404).json({
      success: false,
      message: 'Image not found',
    });
  }

  const imageInfo = await cloudinary.api.resource(publicId);

  if (!imageInfo) {
    return res.status(404).json({
      success: false,
      message: 'Image not found in storage',
    });
  }
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok') {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image from storage',
    });
  }

  res.json({
    success: true,
    message: 'Image deleted successfully',
  });
});

module.exports = router;
