import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  createAddress,
  getAddressData,
} from "../Controller/address.controller.js";

const router = express.Router();

router.post("/create-address", UserVerifyToken, createAddress);
router.get("/get-address", UserVerifyToken, getAddressData);

export default router;
