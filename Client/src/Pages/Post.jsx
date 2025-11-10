import React, { useState, useEffect } from "react";
import SquareStories from "../Components/StorieOutLook";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiMusic,
  FiShare2,
  FiSearch,
} from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const { token, currentUser } = useSelector((state) => state.user);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Transform the API data to match the frontend structure
        const transformedPosts = response.data.posts.map((post) => ({
          id: post._id,
          username: post.user?.username || "unknown_user",
          userImage:
            post.user?.avatar ||
            "https://randomuser.me/api/portraits/men/32.jpg",
          location: post.location?.name || "",
          imageUrl:
            post.media[0]?.url ||
            "https://source.unsplash.com/random/800x800/?social",
          likes: post.likeCount || 0,
          caption: post.caption || "",
          comments: post.commentCount || 0,
          timeAgo: getTimeAgo(post.createdAt),
          isLiked: post.likes?.includes(currentUser?._id) || false,
          isSaved: post.saves?.includes(currentUser?._id) || false,
          isVideo: post.media[0]?.mediaType === "video",
          views: post.views?.toLocaleString() || "0",
          musicTrack: post.music?.title || "Original Sound",
          _id: post._id,
          media: post.media,
          user: post.user,
          createdAt: post.createdAt,
        }));

        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);

      if (error.response?.status === 404) {
        toast.error("Posts endpoint not found. Please check backend routes.");
      } else {
        toast.error("Failed to load posts");
      }
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const toggleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const isCurrentlyLiked = post.isLiked;

      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        })
      );

      // API call
      const response = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        // Revert on error
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: isCurrentlyLiked,
                likes: isCurrentlyLiked ? post.likes : post.likes - 1,
              };
            }
            return post;
          })
        );
        toast.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like post");
    }
  };

  const toggleSave = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const isCurrentlySaved = post.isSaved;

      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isSaved: !post.isSaved,
            };
          }
          return post;
        })
      );

      // API call
      const response = await axios.post(
        `/api/posts/${postId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        // Revert on error
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                isSaved: isCurrentlySaved,
              };
            }
            return post;
          })
        );
        toast.error("Failed to save post");
      } else {
        toast.success(post.isSaved ? "Post saved!" : "Post unsaved!");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to save post");
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const submitComment = async (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    try {
      const response = await axios.post(
        `/api/posts/${postId}/comment`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update post comments count
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments + 1,
              };
            }
            return post;
          })
        );

        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));

        toast.success("Comment added!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleShare = async (postId) => {
    try {
      const postLink = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postLink);
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error("Failed to share post");
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white pb-16 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151",
          },
        }}
      />

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-800 lg:p-4">
        <Link to="/user-search">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-sm lg:text-base" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-900 rounded-lg py-2 lg:py-3 pl-10 pr-3 text-sm lg:text-base focus:outline-none"
            />
          </div>
        </Link>
      </div>

      {/* Stories */}
      <SquareStories />

      {/* Posts from all users */}
      {posts.length === 0 ? (
        <div className="text-center py-12 lg:py-16">
          <p className="text-gray-400 text-lg lg:text-xl">No posts yet</p>
          <p className="text-gray-500 text-sm lg:text-base mt-2">
            Be the first to create a post!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border-b border-gray-800 mb-4 lg:mb-8">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3 lg:p-4 xl:p-5">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-pink-500 flex-shrink-0">
                  <img
                    src={post.userImage}
                    alt={post.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://randomuser.me/api/portraits/men/32.jpg";
                    }}
                  />
                </div>
                <div>
                  <Link to={`/profile/${post.user?._id || post.username}`}>
                    <p className="text-sm lg:text-base xl:text-lg font-semibold hover:underline">
                      {post.username}
                    </p>
                  </Link>
                  {post.location && (
                    <p className="text-xs lg:text-sm xl:text-base text-gray-400">
                      {post.location}
                    </p>
                  )}
                </div>
              </div>
              <BsThreeDots className="text-lg lg:text-xl xl:text-2xl cursor-pointer" />
            </div>

            {/* Post Media - Updated for better responsiveness */}
            <div className="relative bg-gray-900">
              <div className="flex justify-center items-center bg-black">
                {post.isVideo ? (
                  <div className="w-full max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] mx-auto">
                    <video
                      src={post.media[0]?.url}
                      controls
                      className="w-full h-auto max-h-[80vh] object-contain"
                      poster={post.media[0]?.thumbnail}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="w-full max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] mx-auto">
                    <img
                      src={post.media[0]?.url || post.imageUrl}
                      alt={post.caption}
                      className="w-full h-auto max-h-[80vh] object-contain"
                      onError={(e) => {
                        e.target.src =
                          "https://source.unsplash.com/random/800x800/?social";
                      }}
                    />
                  </div>
                )}
              </div>

              {post.isVideo && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 lg:space-x-3 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  <FiMusic className="text-white text-sm lg:text-base" />
                  <p className="text-white text-sm lg:text-base">
                    {post.musicTrack}
                  </p>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-3 lg:p-4 xl:p-5">
              <div className="flex justify-between mb-2 lg:mb-3 xl:mb-4">
                <div className="flex space-x-4 lg:space-x-5 xl:space-x-6">
                  <button
                    className="text-2xl lg:text-2xl xl:text-3xl transition-transform hover:scale-110"
                    onClick={() => toggleLike(post.id)}
                  >
                    {post.isLiked ? (
                      <FaHeart className="text-red-500 fill-current" />
                    ) : (
                      <FiHeart className="hover:text-red-400" />
                    )}
                  </button>
                  <button className="text-2xl lg:text-2xl xl:text-3xl hover:text-blue-400 transition-transform hover:scale-110">
                    <FiMessageCircle />
                  </button>
                  <button
                    className="text-2xl lg:text-2xl xl:text-3xl hover:text-green-400 transition-transform hover:scale-110"
                    onClick={() => handleShare(post.id)}
                  >
                    <FiShare2 />
                  </button>
                </div>
                <button
                  className="text-2xl lg:text-2xl xl:text-3xl transition-transform hover:scale-110"
                  onClick={() => toggleSave(post.id)}
                >
                  {post.isSaved ? (
                    <FaBookmark className="fill-current text-yellow-400" />
                  ) : (
                    <FiBookmark className="hover:text-yellow-400" />
                  )}
                </button>
              </div>

              {/* Engagement Metrics */}
              <div className="flex items-center space-x-4 text-xs lg:text-sm xl:text-base text-gray-400 mb-3 lg:mb-4 xl:mb-5">
                {post.isVideo && <span>{post.views} views</span>}
                <span>{post.likes.toLocaleString()} likes</span>
                <span>{post.comments} comments</span>
              </div>

              {/* Caption */}
              <div className="mb-1 lg:mb-2 xl:mb-3">
                <p className="text-sm lg:text-base xl:text-lg">
                  <Link to={`/profile/${post.user?._id || post.username}`}>
                    <span className="font-semibold mr-2 lg:mr-3 xl:mr-4 hover:underline">
                      {post.username}
                    </span>
                  </Link>
                  {post.caption}
                </p>
              </div>

              {/* Comments Preview */}
              <button className="text-sm lg:text-base xl:text-lg text-gray-400 mb-1 lg:mb-2 xl:mb-3 hover:text-white">
                View all {post.comments} comments
              </button>

              {/* Add Comment */}
              <div className="flex items-center justify-between mt-3 lg:mt-4 xl:mt-5">
                <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4 flex-1">
                  <BsEmojiSmile className="text-lg lg:text-xl xl:text-2xl text-gray-400 cursor-pointer flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && submitComment(post.id)
                    }
                    className="bg-transparent border-0 focus:ring-0 text-sm lg:text-base xl:text-lg w-full placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  className={`text-blue-400 font-semibold text-sm lg:text-base xl:text-lg flex-shrink-0 ml-2 ${
                    !commentInputs[post.id]?.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-blue-300"
                  }`}
                  onClick={() => submitComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  Post
                </button>
              </div>

              {/* Time */}
              <p className="text-xs lg:text-sm xl:text-base text-gray-400 uppercase mt-2 lg:mt-3 xl:mt-4">
                {post.timeAgo}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Post;
