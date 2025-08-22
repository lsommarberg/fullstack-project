const express = require('express');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { userExtractor } = require('../utils/middleware');
const User = require('../models/user');
const router = express.Router();

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024;

router.post('/:id', userExtractor, upload.single('image'), async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided',
    });
  }

  const user = req.user;
  const fileSize = req.file.size;

  if (user.uploadStats + fileSize > MAX_STORAGE_LIMIT) {
    await cloudinary.uploader.destroy(req.file.filename);

    return res.status(413).json({
      success: false,
      message: 'Storage limit exceeded',
      currentUsage: user.uploadStats,
      limit: MAX_STORAGE_LIMIT,
      fileSize: fileSize,
    });
  }

  user.uploadStats += fileSize;
  await user.save();

  const imageUrl = req.file.path;
  const publicId = req.file.filename;

  res.json({
    success: true,
    url: imageUrl,
    secure_url: imageUrl,
    publicId: publicId,
    fileSize: fileSize,
    storageUsed: user.uploadStats,
    storageLimit: MAX_STORAGE_LIMIT,
    message: 'Image uploaded successfully',
  });
});

router.delete('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: 'Public ID is required',
    });
  }

  const user = req.user;

  const imageInfo = await cloudinary.api.resource(publicId);
  const fileSize = imageInfo.bytes;

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok') {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image from storage',
    });
  }

  user.uploadStats = Math.max(0, user.uploadStats - fileSize);
  await user.save();

  res.json({
    success: true,
    fileSize: fileSize,
    storageUsed: user.uploadStats,
    storageLimit: MAX_STORAGE_LIMIT,
    message: 'Image deleted successfully',
  });
});

module.exports = router;
