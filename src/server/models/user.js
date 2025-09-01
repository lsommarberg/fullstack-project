const mongoose = require('mongoose');

/**
 * User model schema for knitting pattern management application.
 * Stores user authentication data, profile information, and upload statistics.
 * Includes virtual properties for related patterns and projects.
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
  uploadStats: {
    type: Number,
    default: 0,
    min: 0,
  },
  patterns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pattern',
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
