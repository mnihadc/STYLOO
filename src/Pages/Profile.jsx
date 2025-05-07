import React, { useState } from "react";
import { FiMoreVertical, FiMessageCircle, FiUserPlus } from "react-icons/fi";
import {
  BsGrid3X3,
  BsBookmark,
  BsEmojiFrown,
  BsHeart,
  BsChat,
} from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample user data
  const user = {
    username: "jane_doe",
    name: "Jane Doe",
    bio: "Digital creator | Photography enthusiast | Travel lover",
    website: "janedoe.art",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    posts: 142,
    followers: 12500,
    following: 843,
    isPrivate: false,
  };

  // Sample posts data
  const posts = [
    {
      id: 1,
      image: "https://source.unsplash.com/random/300x300/?nature",
      likes: 1243,
      comments: 42,
    },
    {
      id: 2,
      image: "https://source.unsplash.com/random/300x300/?travel",
      likes: 892,
      comments: 31,
    },
    {
      id: 3,
      image: "https://source.unsplash.com/random/300x300/?food",
      likes: 2456,
      comments: 85,
    },
    {
      id: 4,
      image: "https://source.unsplash.com/random/300x300/?architecture",
      likes: 1876,
      comments: 93,
    },
    {
      id: 5,
      image: "https://source.unsplash.com/random/300x300/?fashion",
      likes: 3210,
      comments: 124,
    },
    {
      id: 6,
      image: "https://source.unsplash.com/random/300x300/?art",
      likes: 876,
      comments: 42,
    },
  ];

  // Sample saved posts
  const savedPosts = [
    { id: 7, image: "https://source.unsplash.com/random/300x300/?quote" },
    { id: 8, image: "https://source.unsplash.com/random/300x300/?inspiration" },
    { id: 9, image: "https://source.unsplash.com/random/300x300/?design" },
  ];

  // Sample tagged posts
  const taggedPosts = [
    { id: 10, image: "https://source.unsplash.com/random/300x300/?friends" },
    { id: 11, image: "https://source.unsplash.com/random/300x300/?event" },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="bg-black text-white min-h-screen pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 p-3 border-b border-gray-800 flex items-center justify-between">
        <Link to="/shop">
          <button className="text-xl">
            <IoMdArrowBack />
          </button>
        </Link>
        <div className="flex items-center">
          <span className="font-bold">{user.username}</span>
          {user.isPrivate && (
            <span className="ml-1 text-xs bg-gray-700 px-1 rounded">
              Private
            </span>
          )}
        </div>
        <button className="text-xl">
          <FiMoreVertical />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full border-2 border-pink-500 p-0.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex-1 flex justify-around text-center ml-6">
            <div>
              <div className="font-bold">{formatNumber(user.posts)}</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-bold">{formatNumber(user.followers)}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div>
              <div className="font-bold">{formatNumber(user.following)}</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h2 className="font-bold">{user.name}</h2>
          <p className="text-sm mt-1">{user.bio}</p>
          {user.website && (
            <a
              href={`https://${user.website}`}
              className="text-blue-500 text-sm block mt-1"
            >
              {user.website}
            </a>
          )}
        </div>

        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
              isFollowing ? "bg-gray-800 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button className="flex-1 py-1.5 bg-gray-800 rounded-md text-sm font-medium flex items-center justify-center">
            <FiMessageCircle className="mr-1" /> Message
          </button>
          <button className="p-1.5 bg-gray-800 rounded-md">
            <FiUserPlus />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800 flex">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === "posts" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsGrid3X3 className="text-lg" />
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === "saved" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsBookmark className="text-lg" />
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === "tagged" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsEmojiFrown className="text-lg" />
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-0.5">
        {activeTab === "posts" &&
          posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-gray-900 relative group"
            >
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-white mr-4">
                  <BsHeart className="mr-1" />
                  <span className="font-bold">{formatNumber(post.likes)}</span>
                </div>
                <div className="flex items-center text-white">
                  <BsChat className="mr-1" />
                  <span className="font-bold">
                    {formatNumber(post.comments)}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "saved" &&
          savedPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-900">
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}

        {activeTab === "tagged" &&
          taggedPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-900">
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
      </div>

      {/* Empty state for tagged posts */}
      {activeTab === "tagged" && taggedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
            <BsEmojiFrown className="text-2xl" />
          </div>
          <h3 className="text-xl font-bold">No Photos</h3>
          <p className="text-gray-400 mt-1">
            When people tag you in photos, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
