import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  getOrders,
  placeCashOnDeliveryOrder,
} from "../Controller/Order.controller.js";

const router = express.Router();

router.post("/place-cod-order", UserVerifyToken, placeCashOnDeliveryOrder);
router.get("/get-orders", UserVerifyToken, getOrders);

export default router;
