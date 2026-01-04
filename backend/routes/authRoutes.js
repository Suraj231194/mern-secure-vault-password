const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const { authLimiter } = require('../middlewares/rateLimit');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);

module.exports = router;
