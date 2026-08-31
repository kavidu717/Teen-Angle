import express from "express";

import { admin, protect } from "../middleware/authMiddleware";
import { getUserProfile, toggleWishlist, getWishlist, getAllUsers, deleteUser } from "../controllers/userController";

const router = express.Router();


router.get('/profile', protect, getUserProfile);
router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

router.get('/', protect,admin,getAllUsers);
router.delete("/:id",protect,admin,deleteUser);


export default router;