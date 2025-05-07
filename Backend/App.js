import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import authRoutes from "./Route/auth.route"; // ⬅️ Import the auth routes

dotenv.config();
const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/Client/dist")));

// Routes
app.use("/api/auth", authRoutes); // ⬅️ Use the /api/auth route

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
