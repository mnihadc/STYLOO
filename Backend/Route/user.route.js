const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  image: {
    url: {
      type: String,
      required: true, // Cloud image URL
    },
    public_id: {
      type: String,
      required: true, // For cloudinary or similar storage
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Auth", // Or whichever auth/user base model you use
    },
    tagline: {
      type: String,
      default: "",
    },
    followers: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    posts: {
      count: {
        type: Number,
        default: 0,
      },
      items: [postSchema],
    },
  },
  {
    timestamps: true,
  }
);

const profileUser = mongoose.model("profileUser", userSchema);
module.exports = profileUser;
