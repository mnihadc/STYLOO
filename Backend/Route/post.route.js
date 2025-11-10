import express from "express";
import { createPost } from "../Controller/post.controller.js";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import multer from "multer";

const router = express.Router();

// Multer setup (for file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST route — handles both upload & direct links
router.post(
  "/create-posting",
  UserVerifyToken,
  upload.array("media"),
  createPost
);

export default router;
