import User from "../Model/User.model.js";
import ProfileUser from "../Model/userProfile.model.js";
import jwt from "jsonwebtoken";

export const GetProfileUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [user, profile] = await Promise.all([
      User.findById(userId).select("username avatar email role"),
      ProfileUser.findOne({ userId })
        .populate("followers.users", "username avatar")
        .populate("following.users", "username avatar"),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const profileData = {
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      role: user.role,
      tagline: profile.tagline || "",
      bio: profile.bio || "",
      followers: profile.followers.count,
      following: profile.following.count,
      posts: profile.posts.count,
      postItems: profile.posts.items.map((post) => ({
        id: post._id,
        caption: post.caption,
        imageUrl: post.image.url,
        createdAt: post.createdAt,
      })),
    };

    res.status(200).json(profileData);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
