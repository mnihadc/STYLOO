import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: String,
  image: {
    url: String,
    public_id: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    tagline: String,
    bio: String,
    followers: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    following: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    posts: {
      count: { type: Number, default: 0 },
      items: [postSchema],
    },
  },
  { timestamps: true }
);

const ProfileUser = mongoose.model("ProfileUser", userProfileSchema);
export default ProfileUser;
