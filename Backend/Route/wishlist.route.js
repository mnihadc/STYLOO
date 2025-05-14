import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  addToWishList,
  deleteWishList,
  getWishList,
} from "../Controller/wishlist.controller.js";
const router = express.Router();

router.post("/addtowishlist", UserVerifyToken, addToWishList);
router.get("/get-wishlist", UserVerifyToken, getWishList);
router.delete("/remove-wishlist/:productId", UserVerifyToken, deleteWishList);

export default router;
