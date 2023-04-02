const express = require('express');
const router = express.Router();
const {
  Register,
  Login,
  AuthenticatedUser,
  Refresh,
  Logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

router.post('/register', Register);
router.post('/login', Login);
router.get('/user', AuthenticatedUser);
router.post('/refresh', Refresh);
router.post('/logout', Logout);
//reset
router.post('/password-reset', forgotPassword);
router.post('/password-reset/:userId/:token', AuthenticatedUser, resetPassword);

module.exports = router;
