import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
} from "../controllers/product.controller.js";
import Router from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/add-product")
  .post(upload.single("productImage"), verifyJWT, addProduct);
router
  .route("/update-product/:_id")
  .put(upload.single("productImage"), verifyJWT, updateProduct);
router.route("/delete-product/:_id").delete(verifyJWT, deleteProduct);
router.route("/fetch-products").get(verifyJWT, fetchProducts);
export default router;
