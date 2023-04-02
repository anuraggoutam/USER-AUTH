const USER = require('../models/user.module');
const jwt = require('jsonwebtoken');
const Token = require('../models/token.module');
const sgMail = require('@sendgrid/mail');
const bcryptjs = require('bcryptjs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const refresh_secret = process.env.refresh_secret;
const access_secret = process.env.access_secret;
const CLIENT_URL = process.env.CLIENT_URL;
const Register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await USER.create({
    name,
    email,
    password: await bcryptjs.hash(password, 12),
  });

  res.send(user.name);
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await USER.findOne({ email });

  if (!user) {
    return res.status(400).send({
      message: 'Invalid credentials',
    });
  }

  if (!(await bcryptjs.compare(password, user.password))) {
    return res.status(400).send({
      message: 'Invalid credentials',
    });
  }

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    'refresh_secret',
    { expiresIn: '1w' }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });

  const expired_at = new Date();
  expired_at.setDate(expired_at.getDate() + 7);

  await Token.create({
    user_id: user.id,
    token: refreshToken,
    expired_at,
  });

  const token = jwt.sign(
    {
      id: user.id,
    },
    'access_secret',
    { expiresIn: '30s' }
  );

  res.send({
    token,
  });
};

const AuthenticatedUser = async (req, res) => {
  try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';

    const payload = jwt.verify(accessToken, 'access_secret');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const user = await USER.findOne(payload.id).select('-password');

    if (!user) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    res.send(user);
  } catch (e) {
    return res.status(401).send({
      message: 'unauthenticated',
    });
  }
};

const Refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    const payload = jwt.verify(refreshToken, 'refresh_secret');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const dbToken = await Token.findOne({
      user_id: payload.id,
      expired_at: { $gte: new Date() },
    });

    if (!dbToken) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const token = jwt.sign(
      {
        id: payload.id,
      },
      'access_secret',
      { expiresIn: '30s' }
    );

    res.send({
      token,
    });
  } catch (e) {
    return res.status(401).send({
      message: 'unauthenticated',
    });
  }
};

const Logout = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];

  await Token.deleteOne({ token: refreshToken });

  res.cookie('refreshToken', '', { maxAge: 0 });

  res.send({
    message: 'success',
  });
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await USER.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'This email does not exist.' });

    const access_token = jwt.sign(
      {
        id: user.id,
      },
      'access_secret'
    );

    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    const msg = {
      to: email, // Change to your recipient
      from: 'anuraggoutam01@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<h1>hello</h1><br/>for resetting your password <a href=${url}>Click here</a>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });

    res.json({ msg: 'Re-send the password, please check your email.' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
// reset password
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);

    await USER.findOneAndUpdate(
      { _id: user.id },
      {
        password: await bcryptjs.hash(password, 12),
      }
    );

    res.json({ msg: 'Password successfully changed!' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
module.exports = {
  Register,
  Login,
  AuthenticatedUser,
  Refresh,
  Logout,
  forgotPassword,
  resetPassword,
};
