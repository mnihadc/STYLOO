import Post from "../Model/Post.model.js";
import User from "../Model/User.model.js";

// Helper function to process direct links
const processDirectLinks = (mediaArray) => {
  const mediaUploads = [];

  for (const mediaItem of mediaArray) {
    try {
      const { url, mediaType, thumbnail, duration } = mediaItem;

      // Validate URL
      if (!isValidUrl(url)) {
        throw new Error(`Invalid URL: ${url}`);
      }

      // Determine media type from URL if not provided
      let detectedMediaType = mediaType;
      if (!detectedMediaType) {
        detectedMediaType = detectMediaTypeFromUrl(url);
      }

      mediaUploads.push({
        url: url,
        mediaType: detectedMediaType,
        thumbnail: thumbnail || "",
        duration: duration || 0,
        order: mediaUploads.length,
        metadata: {
          fileSize: 0,
          mimeType: detectedMediaType,
          dimensions: { width: 0, height: 0 },
        },
        isDirectLink: true,
      });
    } catch (error) {
      console.error("Error processing direct link:", error);
      throw new Error(`Failed to process media URL: ${error.message}`);
    }
  }

  return mediaUploads;
};

// Helper function to process file uploads
const processFileUploads = (files) => {
  const mediaUploads = [];

  for (const file of files) {
    try {
      // Local storage
      const fileUrl = `/uploads/posts/${file.filename}`;

      // Determine media type from mimetype
      let mediaType = "image";
      if (file.mimetype.startsWith("video/")) {
        mediaType = "video";
      }

      mediaUploads.push({
        url: fileUrl,
        mediaType: mediaType,
        thumbnail: mediaType === "video" ? "" : fileUrl,
        duration: 0,
        order: mediaUploads.length,
        metadata: {
          fileSize: file.size,
          mimeType: file.mimetype,
          dimensions: { width: 0, height: 0 },
        },
        isDirectLink: false,
        fileName: file.filename,
      });
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      throw new Error("Error processing uploaded file");
    }
  }

  return mediaUploads;
};

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to detect media type from URL
const detectMediaTypeFromUrl = (url) => {
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

  const lowerUrl = url.toLowerCase();

  if (videoExtensions.some((ext) => lowerUrl.includes(ext))) {
    return "video";
  }
  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
    return "image";
  }

  // Default to image if cannot determine
  return "image";
};

// @desc    Create a new post with file upload OR direct links
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const {
      caption,
      postType,
      filters,
      location,
      taggedUsers,
      music,
      useDirectLinks,
    } = req.body;

    let parsedMedia = [];
    let parsedLocation = location ? JSON.parse(location) : {};
    let parsedFilters = filters ? JSON.parse(filters) : {};
    let parsedTaggedUsers = taggedUsers ? JSON.parse(taggedUsers) : [];
    // 🖼️ If direct links are used
    if (useDirectLinks === "true") {
      parsedMedia = JSON.parse(req.body.media).map((m, i) => ({
        url: m.url,
        mediaType: m.type === "video" ? "video" : "image",
        thumbnail: "",
        duration: 0,
        order: i,
      }));
    }
    // 📁 If file uploads are used
    else if (req.files && req.files.length > 0) {
      parsedMedia = req.files.map((file, i) => ({
        url: `/uploads/${file.originalname}`, // replace with cloud URL in future
        mediaType: file.mimetype.startsWith("video") ? "video" : "image",
        thumbnail: "",
        duration: 0,
        order: i,
      }));
    }

    // ✅ Create and save post
    const post = new Post({
      user: req.user.userId,
      caption,
      media: parsedMedia,
      location: parsedLocation,
      taggedUsers: parsedTaggedUsers,
      postType: postType || "post",
      filters: parsedFilters,
      music: music ? JSON.parse(music) : {},
    });

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Other controller functions (getUserPosts, getPostById, likePost, etc.) remain the same...
// Simple version - get all posts
// Get all posts for feed
// Get all posts from all users (latest first)
export const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all posts from all users (no filtering by following)
    const posts = await Post.find({
      isHidden: false,
      isArchived: false,
    })
      .populate("user", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .sort({ createdAt: -1 }) // Latest posts first
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      isHidden: false,
      isArchived: false,
    });

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};
