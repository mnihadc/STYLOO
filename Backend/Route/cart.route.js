import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { addToCart, getCart } from "../Controller/cart.controller.js";
import UserOnlyMiddleware from "../Middleware/UserOnly.js";
const router = express.Router();

router.post("/addtocart", UserVerifyToken, addToCart);
router.get("/user-cart", UserVerifyToken, getCart);

export default router;
