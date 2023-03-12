const express = require('express');
const router = express.Router();
const {
  Register,
  Login,
  AuthenticatedUser,
  Refresh,
  Logout,
} = require('../controllers/auth.controller');

router.post('/register', Register);
router.post('/login', Login);
router.get('/user', AuthenticatedUser);
router.post('/refresh', Refresh);
router.post('/logout', Logout);

module.exports = router;
