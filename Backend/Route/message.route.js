import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../Controller/message.controller.js";
import UserVerifyToken from "../Middleware/UserVerifyToken.js";

const router = express.Router();

router.get("/users", UserVerifyToken, getUsersForSidebar);
router.get("/:id", UserVerifyToken, getMessages);

router.post("/send/:id", UserVerifyToken, sendMessage);

export default router;
