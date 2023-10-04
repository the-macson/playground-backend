const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const authApi = require('./src/api/authApi');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established successfully."))
  .catch((err) => console.log("err", err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authApi);
// app.use('/',(req,res)=>{
//     res.send('Hello World')
//     })

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});