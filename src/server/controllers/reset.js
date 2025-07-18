const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
