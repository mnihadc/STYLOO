import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { addToCart } from "../Controller/cart.controller.js";
import UserOnlyMiddleware from "../Middleware/UserOnly.js";
const router = express.Router();

router.post("/addtocart", UserVerifyToken, addToCart);

export default router;
