import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { addToWishList } from "../Controller/wishlist.controller.js";
const router = express.Router();

router.post("/addtowishlist", UserVerifyToken, addToWishList);

export default router;
