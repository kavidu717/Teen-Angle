import express from "express";

import { protect } from "../middleware/authMiddleware";
import { getUserProfile, toggleWishlist, getWishlist } from "../controllers/userController";

const router = express.Router();


router.get('/profile', protect, getUserProfile);
router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);


export default router;