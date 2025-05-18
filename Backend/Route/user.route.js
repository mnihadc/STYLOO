import express from "express";
import {
  getAllUsers,
  GetProfileUser,
  updateUserProfile,
} from "../Controller/user.controller.js";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
const router = express.Router();

router.get("/profile-user", UserVerifyToken, GetProfileUser);
router.put("/update-profile", UserVerifyToken, updateUserProfile);
router.get("/get-users-chat", getAllUsers);

export default router;
