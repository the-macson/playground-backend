const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const api = require('./src/api');
const sequelize = require('./src/config/db.config');
const { upAndRunCppCompiler } = require('./src/utils/cppDocker');

sequelize
  .authenticate()
  .then(async () => {
    console.log('database connected');
    // await sequelize.sync();
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use('/api', api);

upAndRunCppCompiler().then((res) => {
  console.log(res);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
