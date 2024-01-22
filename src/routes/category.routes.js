import {
  addCategory,
  updateCategory,
  deleteCategory,
  fetchCategory,
} from "../controllers/category.controller.js";
import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
// Category routes

// Category routes
router.route("/add-category").post(verifyJWT, addCategory);
router.route("/update-category/:_id").put(verifyJWT, updateCategory);
router.route("/delete-category/:_id").delete(verifyJWT, deleteCategory);
router.route("/fetch-category").get(verifyJWT, fetchCategory);
export default router;
