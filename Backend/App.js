import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import authRoutes from "./Route/auth.route.js"; // ⬅️ Import the auth routes
import userRoutes from "./Route/user.route.js";
import adminRoutes from "./Route/admin.route.js";
import cartRoutes from "./Route/cart.route.js";
import addressRoutes from "./Route/address.route.js";
import orderRoutes from "./Route/order.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static(path.join(__dirname, "/Client/dist")));

// Then your routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is Running on port ${port}!!!`);
});
