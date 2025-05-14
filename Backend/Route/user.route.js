import express from "express";
import {
  GetProfileUser,
  updateUserProfile,
} from "../Controller/user.controller.js";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
const router = express.Router();

router.get("/profile-user", UserVerifyToken, GetProfileUser);
router.put("/update-profile", UserVerifyToken, updateUserProfile);

export default router;
