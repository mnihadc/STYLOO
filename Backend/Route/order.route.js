import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { placeCashOnDeliveryOrder } from "../Controller/Order.controller.js";

const router = express.Router();
router.post(
  "/place-cash-on-delivery",
  UserVerifyToken,
  placeCashOnDeliveryOrder
);
export default router;
