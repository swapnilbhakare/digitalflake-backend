import Router from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCategory } from "../controllers/category.controller.js";
const router = Router();

router.route("/register").post(upload.single("profileImage"), registerUser);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
