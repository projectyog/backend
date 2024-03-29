const {signupController,
    resetPasswordRequestController,
    resetPasswordController,
} = require('../controllers/auth.controller')


const router = require('express').Router();
router.post("/auth/signup",signupController);
router.post("/auth/requestResetPassword",resetPasswordRequestController)
router.post("/auth/resetPassword",resetPasswordController);

module.exports = router;