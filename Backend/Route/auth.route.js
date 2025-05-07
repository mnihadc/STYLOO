import express from "express";
import { loginUser, registerUser } from "../Controller/auth.controller.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;
