import express from "express";
import { GetProfileUser } from "../Controller/user.controller.js";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
const router = express.Router();

// Use the same endpoint as frontend expects
router.get("/profile-user", UserVerifyToken, GetProfileUser);

export default router;
