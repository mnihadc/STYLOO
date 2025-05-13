import express from "express";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";
import { createAddress } from "../Controller/address.controller.js";

const router = express.Router();

router.post("/create-address", UserVerifyToken, createAddress);

export default router;
