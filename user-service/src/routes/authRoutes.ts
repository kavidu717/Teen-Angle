import express from "express";

import { registerUser,
forgotPassword,
 resetPassword,
  verifyOtp ,
   loginUser,
    resendOtp} from "../controllers/authController";




const router = express.Router();


router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;