import User from "../Model/User.model.js";
import Message from "../Model/Message.js";
import { getReceiverSocketId, io } from "../Utils/socket.js";

// 🔸 Get sidebar user list (except current)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Sidebar error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔸 Get messages with a user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Optional: Sort by time

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔸 Send message (via API)
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();

    // 🔔 Real-time notify recipient
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
