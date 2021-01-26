const connectDB = require('./config/db');
const createPerformers = require('./scripts/createPerformers.js');
require('dotenv').config();

const app = require('./server.js');
const PORT = process.env.PORT || 5000;

connectDB();
createPerformers();

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
