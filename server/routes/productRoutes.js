import express from "express";
const router = express.Router();
import { getProductById,getProducts,createProduct,updateProduct,deleteProduct, createProductReview , getTopProducts} from "../controllers/productControllers.js";
import {admin, auth} from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js"

router.route('/').get(getProducts).post(auth,admin,createProduct);
router.get('/top',getTopProducts);
router.route('/:id').get(checkObjectId,getProductById).put(auth,admin,checkObjectId,updateProduct).delete(auth, admin,checkObjectId,deleteProduct);
router.route('/:id/reviews').post(auth,checkObjectId,createProductReview);

 
export default router;