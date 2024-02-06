const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const api = require('./src/api');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established successfully.'))
  .catch((err) => console.log('err', err));

app.use(cors());
app.use(express.json());
app.use('/api', api);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
