import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { addToCart } from "../Controller/cart.controller.js";
const router = express.Router();

router.post("/addtocart", UserVerifyToken, addToCart);

export default router;
