import express from "express";
import { createCategory, getAllCategories } from "../controller/categoryController";
import upload from "../middleware/uploadMiddleware";
import { protect, admin } from "../middleware/authMiddleware";




const router = express.Router();


router.post('/',protect,admin, upload.single('image'), createCategory);

router.get('/', getAllCategories);



export default router;