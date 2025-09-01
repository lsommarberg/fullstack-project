const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Database reset controller for testing environments.
 * Provides functionality to clear all collections for clean test states.
 * Only available in test environment for security.
 */

/**
 * Reset all database collections by deleting all documents.
 * This endpoint is only available in test environment for safety.
 *
 * @route POST /api/testing/reset
 * @returns {void} 204 - Successfully reset database
 * @returns {Object} 403 - Forbidden (not in test environment)
 */
router.post('/reset', async (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).send('Forbidden');
  }
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  res.status(204).end();
});

module.exports = router;
