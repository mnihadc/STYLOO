import User from "../Model/User.model.js";
import ProfileUser from "../Model/userProfile.model.js";

export const GetProfileUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user and profile in parallel
    const [user, profile] = await Promise.all([
      User.findById(userId).select("username avatar email role"),
      ProfileUser.findOne({ userId })
        .populate("followers.users", "username avatar")
        .populate("following.users", "username avatar"),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });

    const profileData = {
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      role: user.role,
      tagline: profile?.tagline || "",
      bio: profile?.bio || "",
      name: profile?.name || "",
      followers: profile?.followers?.count || 0,
      following: profile?.following?.count || 0,
      posts: profile?.posts?.count || 0,
      postItems:
        profile?.posts?.items?.map((post) => ({
          id: post._id,
          caption: post.caption,
          imageUrl: post.image?.url || "",
          createdAt: post.createdAt,
        })) || [],
    };

    return res.status(200).json(profileData);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { username, avatar, name, tagline, bio } = req.body;

    // 1. Update the User model
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    // 2. Update the ProfileUser model
    let profile = await ProfileUser.findOne({ userId });
    if (!profile) {
      profile = new ProfileUser({ userId });
    }

    profile.name = name || profile.name;
    profile.tagline = tagline || profile.tagline;
    profile.bio = bio || profile.bio;

    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        avatar: user.avatar,
      },
      profile: {
        name: profile.name,
        tagline: profile.tagline,
        bio: profile.bio,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
