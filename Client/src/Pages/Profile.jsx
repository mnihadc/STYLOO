import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile-user", {
        withCredentials: true,
      });
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Profile fetch error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 p-3 border-b border-gray-800 flex items-center justify-between">
        <Link to="/">
          <button className="text-xl">
            <IoMdArrowBack />
          </button>
        </Link>
        <div className="flex items-center">
          <span className="font-bold">{profileData.username}</span>
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
              src={profileData.avatar || "/default-avatar.jpg"}
              alt={profileData.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex-1 flex justify-around text-center ml-6">
            <div>
              <div className="font-bold">{formatNumber(profileData.posts)}</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-bold">
                {formatNumber(profileData.followers)}
              </div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div>
              <div className="font-bold">
                {formatNumber(profileData.following)}
              </div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h2 className="font-bold">{profileData.username}</h2>
          <p className="text-sm mt-1">{profileData.bio}</p>
        </div>

        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
              isFollowing ? "bg-gray-800" : "bg-blue-500"
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

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {activeTab === "posts" &&
          profileData.postItems?.map((post, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-900 relative group"
            >
              <img
                src={post?.image?.url || "/default-image.jpg"}
                alt="Post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-white mr-4">
                  <BsHeart className="mr-1" />
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center text-white">
                  <BsChat className="mr-1" />
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
