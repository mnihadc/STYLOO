import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../Controller/cart.controller.js";
import UserOnlyMiddleware from "../Middleware/UserOnly.js";
const router = express.Router();

router.post("/addtocart", UserVerifyToken, addToCart);
router.get("/user-cart", UserVerifyToken, getCart);
router.delete("/remove-product", UserVerifyToken, removeFromCart);
router.put("/update-product", UserVerifyToken, updateCartItem);

export default router;
