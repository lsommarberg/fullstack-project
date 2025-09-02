const mongoose = require('mongoose');

/**
 * Pattern model schema for storing knitting patterns and instructions.
 * Contains pattern details, metadata, user association, and file attachments.
 * Supports tagging, external links, and user notes for pattern organization.
 */
const patternSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  tags: {
    type: [String],
  },
  notes: {
    type: String,
  },
  files: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      size: { type: Number },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

patternSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;
