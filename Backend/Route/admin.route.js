import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  createProduct,
  getProducts,
  getUpdateProduct,
} from "../Controller/admin.controller.js";
const router = express.Router();

router.post("/create-new-product", UserVerifyToken, createProduct);
router.get("/get-your-product", UserVerifyToken, getUpdateProduct);
router.get("/get-products", getProducts);

export default router;
