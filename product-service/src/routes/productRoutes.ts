import express from 'express';
import { createProduct, getAllProducts } from '../controller/productController';
import { protect, admin } from '../middleware/authMiddleware';
import  upload  from '../middleware/uploadMiddleware';



const router = express.Router();



router.get('/', getAllProducts);
router.post('/', protect, admin, upload.array('images', 3), createProduct);

export default router;