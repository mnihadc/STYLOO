// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      maxlength: 2200,
      default: "",
    },
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        mediaType: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        thumbnail: String, // For video posts
        duration: Number, // For video posts in seconds
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    location: {
      placeId: String,
      name: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    taggedUsers: [
      {
        type: String,
        default: "",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveCount: {
      type: Number,
      default: 0,
    },
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shareCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    music: {
      trackId: String,
      title: String,
      artist: String,
      coverUrl: String,
    },
    postType: {
      type: String,
      enum: ["post", "reel", "story"],
      default: "post",
    },
    aspectRatio: {
      type: String,
      default: "1:1",
    },
    filters: {
      name: String,
      intensity: {
        type: Number,
        default: 0,
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isCommentsDisabled: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    metadata: {
      fileSize: Number,
      mimeType: String,
      dimensions: {
        width: Number,
        height: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ location: 1 });
postSchema.index({ likes: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for media count
postSchema.virtual("mediaCount").get(function () {
  return this.media.length;
});

// Method to check if user liked the post
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

// Method to check if user saved the post
postSchema.methods.isSavedBy = function (userId) {
  return this.saves.includes(userId);
};

// Pre-save middleware to update counts
postSchema.pre("save", function (next) {
  this.likeCount = this.likes.length;
  this.commentCount = this.comments.length;
  this.saveCount = this.saves.length;
  this.shareCount = this.shares.length;
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
