const app = require('./app');
const config = require('./utils/config');
const mongoose = require('mongoose');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
