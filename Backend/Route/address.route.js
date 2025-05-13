import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  createAddress,
  deleteAddress,
  getAddressData,
  getDefaultAddress,
  selectAddressAsDefault,
} from "../Controller/address.controller.js";

const router = express.Router();

router.post("/create-address", UserVerifyToken, createAddress);
router.get("/get-address", UserVerifyToken, getAddressData);
router.delete("/delete-address/:id", UserVerifyToken, deleteAddress);
router.put("/select-address/:id", UserVerifyToken, selectAddressAsDefault);
router.get("/get-default-address", UserVerifyToken, getDefaultAddress);

export default router;
