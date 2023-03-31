const express = require('express');
const router = express.Router();
const {
  Register,
  Login,
  AuthenticatedUser,
  Refresh,
  Logout,
} = require('../controllers/auth.controller');
const { reset_pass, Reset } = require('../controllers/reset');
router.post('/register', Register);
router.post('/login', Login);
router.get('/user', AuthenticatedUser);
router.post('/refresh', Refresh);
router.post('/logout', Logout);

//reset
router.post('/password-reset', Reset);
router.post('/password-reset/:userId/:token', reset_pass);


module.exports = router;
