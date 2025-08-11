const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
    required: false,
  },
  startedAt: {
    type: Date,
  },
  finishedAt: {
    type: Date,
    default: null,
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
  rowTrackers: [
    {
      section: String,
      currentRow: Number,
      totalRows: Number,
    },
  ],
  logEntries: [
    {
      date: { type: Date, default: Date.now },
      note: String,
      images: [String],
    },
  ],
});

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
