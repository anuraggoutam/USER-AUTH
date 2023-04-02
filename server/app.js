const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Connect = require('./config/db');
const dotenv = require('dotenv').config();
const colors = require('colors');
const userAuth = require('./routes/userAuth');
const port = process.env.PORT || 8080;
const app = express();

Connect();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:4200',
    ],
    credentials: true,
  })
);
app.use('/api/', userAuth);

app.listen(port, () => {
  console.log(`listening to port:${port}`);
});
