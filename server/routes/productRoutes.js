import express from "express";
const router = express.Router();
import { getProductById,getProducts,createProduct,updateProduct,deleteProduct, createProductReview , getTopProducts} from "../controllers/productControllers.js";
import {admin, auth} from "../middleware/authMiddleware.js";

router.route('/').get(getProducts).post(auth,admin,createProduct);
router.get('/top',getTopProducts);
router.route('/:id').get(getProductById).put(auth,admin,updateProduct).delete(auth, admin,deleteProduct);
router.route('/:id/reviews').post(auth,createProductReview);

 
export default router;