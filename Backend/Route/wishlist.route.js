import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  addToWishList,
  getWishList,
} from "../Controller/wishlist.controller.js";
const router = express.Router();

router.post("/addtowishlist", UserVerifyToken, addToWishList);
router.get("/get-wishlist", UserVerifyToken, getWishList);

export default router;
