import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  createAddress,
  deleteAddress,
  getAddressData,
} from "../Controller/address.controller.js";

const router = express.Router();

router.post("/create-address", UserVerifyToken, createAddress);
router.get("/get-address", UserVerifyToken, getAddressData);
router.delete("/delete-address/:id", UserVerifyToken, deleteAddress);

export default router;
