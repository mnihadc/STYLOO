import React, { useState } from "react";
import SquareStories from "../Components/StorieOutLook";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiMusic,
  FiShare2,
  FiSearch,
} from "react-icons/fi";
import { FaHeart, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

function Post() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "travel_lover",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Bali, Indonesia",
      imageUrl: "https://source.unsplash.com/random/800x800/?travel",
      likes: 1243,
      caption:
        "Exploring the beautiful beaches of Bali! 🌴 #travel #bali #vacation",
      comments: 56,
      timeAgo: "2 hours ago",
      isLiked: false,
      isSaved: false,
      isVideo: false,
      musicTrack: "Sunset Vibes - Tropical Mix",
    },
    {
      id: 2,
      username: "foodie_gram",
      userImage: "https://randomuser.me/api/portraits/women/68.jpg",
      location: "Tokyo, Japan",
      imageUrl: "https://source.unsplash.com/random/800x800/?food",
      likes: 892,
      caption: "Authentic ramen experience in Tokyo! 🍜 #foodie #japan #ramen",
      comments: 42,
      timeAgo: "5 hours ago",
      isLiked: true,
      isSaved: true,
      isVideo: true,
      views: "24.5K",
      musicTrack: "Tokyo Night - Lofi Beats",
    },
  ]);

  const toggleLike = (postId) => {
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
  };

  const toggleSave = (postId) => {
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
  };

  return (
    <div className="bg-black text-white pb-16 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-800">
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

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="border-b border-gray-800 mb-4 lg:mb-6">
          {/* Post Header */}
          <div className="flex items-center justify-between p-3 lg:p-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-pink-500">
                <img
                  src={post.userImage}
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm lg:text-base font-semibold">
                  {post.username}
                </p>
                {post.location && (
                  <p className="text-xs lg:text-sm text-gray-400">
                    {post.location}
                  </p>
                )}
              </div>
            </div>
            <BsThreeDots className="text-lg lg:text-xl" />
          </div>

          {/* Post Media */}
          <div className="relative w-full aspect-square bg-gray-900 lg:max-h-[600px] xl:max-h-[700px]">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover"
            />

            {post.isVideo && (
              <div className="absolute bottom-3 left-3 flex items-center space-x-2 lg:space-x-3">
                <FiMusic className="text-white text-sm lg:text-base" />
                <p className="text-white text-sm lg:text-base">
                  {post.musicTrack}
                </p>
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="p-3 lg:p-4">
            <div className="flex justify-between mb-2 lg:mb-3">
              <div className="flex space-x-4 lg:space-x-5">
                <button
                  className="text-2xl lg:text-2xl xl:text-3xl"
                  onClick={() => toggleLike(post.id)}
                >
                  {post.isLiked ? (
                    <FaHeart className="text-red-500 fill-current" />
                  ) : (
                    <FiHeart />
                  )}
                </button>
                <button className="text-2xl lg:text-2xl xl:text-3xl">
                  <FiMessageCircle />
                </button>
                <button className="text-2xl lg:text-2xl xl:text-3xl">
                  <FiShare2 />
                </button>
              </div>
              <button
                className="text-2xl lg:text-2xl xl:text-3xl"
                onClick={() => toggleSave(post.id)}
              >
                {post.isSaved ? (
                  <FaBookmark className="fill-current" />
                ) : (
                  <FiBookmark />
                )}
              </button>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center space-x-4 text-xs lg:text-sm text-gray-400 mb-3 lg:mb-4">
              {post.isVideo && <span>{post.views} views</span>}
              <span>{post.likes.toLocaleString()} likes</span>
              <span>{post.comments} comments</span>
            </div>

            {/* Caption */}
            <p className="text-sm lg:text-base mb-1 lg:mb-2">
              <span className="font-semibold mr-2 lg:mr-3">
                {post.username}
              </span>
              {post.caption}
            </p>

            {/* Comments Preview */}
            <button className="text-sm lg:text-base text-gray-400 mb-1 lg:mb-2">
              View all {post.comments} comments
            </button>

            {/* Add Comment */}
            <div className="flex items-center justify-between mt-3 lg:mt-4">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-1">
                <BsEmojiSmile className="text-lg lg:text-xl" />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="bg-transparent border-0 focus:ring-0 text-sm lg:text-base w-full placeholder-gray-500"
                />
              </div>
              <button className="text-blue-400 font-semibold text-sm lg:text-base">
                Post
              </button>
            </div>

            {/* Time */}
            <p className="text-xs lg:text-sm text-gray-400 uppercase mt-2 lg:mt-3">
              {post.timeAgo}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Post;
