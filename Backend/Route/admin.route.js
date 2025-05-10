import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { createProduct } from "../Controller/admin.controller.js";
const router = express.Router();

// Use the same endpoint as frontend expects
router.post("/create-new-product", UserVerifyToken, createProduct);

export default router;
