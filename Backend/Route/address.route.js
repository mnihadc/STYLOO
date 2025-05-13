import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import {
  createAddress,
  deleteAddress,
  getAddressData,
  selectAddressAsDefault,
} from "../Controller/address.controller.js";

const router = express.Router();

router.post("/create-address", UserVerifyToken, createAddress);
router.get("/get-address", UserVerifyToken, getAddressData);
router.delete("/delete-address/:id", UserVerifyToken, deleteAddress);
router.put("/select-address/:id", UserVerifyToken, selectAddressAsDefault);

export default router;
