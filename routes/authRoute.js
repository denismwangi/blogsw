const express = require('express');
const router = express.Router();
const { admin,protect } = require('../middleware/authMiddleware');

const { 
    authUser,
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    passwordCode,
    resetPassword,
    updatePassword,
} = require('../controllers/auth/AuthController');

router.post('/logout',protect,logoutUser);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.post('/verify_user',verifyUser);
router.post('/update_password',updatePassword);
router.post('/reset_password',resetPassword);
router.post('/password_code',passwordCode);







module.exports =  router;