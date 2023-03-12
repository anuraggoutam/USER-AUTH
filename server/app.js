const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const colors = require('colors');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:4200',
    ],
    credentials: true,
  })
);
app.use('/api/', require('./routes/routes.js'));

app.listen(4000, () => {
  console.log('listening to port 4000');
});
