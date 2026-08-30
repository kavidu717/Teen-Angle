import express from "express";
import { createCategory, getAllCategories } from "../controller/categoryController";
import upload from "../middleware/uploadMiddleware";




const router = express.Router();


router.post('/', upload.single('image'), createCategory);

router.get('/', getAllCategories);



export default router;