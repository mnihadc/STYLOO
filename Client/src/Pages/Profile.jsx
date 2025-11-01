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
    <div className="bg-black text-white min-h-screen pb-16 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 p-3 lg:p-4 border-b border-gray-800 flex items-center justify-between">
        <Link to="/">
          <button className="text-xl lg:text-2xl">
            <IoMdArrowBack />
          </button>
        </Link>
        <div className="flex items-center">
          <span className="font-bold text-base lg:text-lg xl:text-xl">
            {profileData.username}
          </span>
        </div>
        <button className="text-xl lg:text-2xl">
          <FiMoreVertical />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-4 lg:p-6 xl:p-8">
        <div className="flex items-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full border-2 border-pink-500 p-0.5">
            <img
              src={profileData.avatar || "/default-avatar.jpg"}
              alt={profileData.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex-1 flex justify-around text-center ml-6 lg:ml-8 xl:ml-12">
            <div>
              <div className="font-bold text-base lg:text-lg xl:text-xl">
                {formatNumber(profileData.posts)}
              </div>
              <div className="text-xs lg:text-sm text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-bold text-base lg:text-lg xl:text-xl">
                {formatNumber(profileData.followers)}
              </div>
              <div className="text-xs lg:text-sm text-gray-400">Followers</div>
            </div>
            <div>
              <div className="font-bold text-base lg:text-lg xl:text-xl">
                {formatNumber(profileData.following)}
              </div>
              <div className="text-xs lg:text-sm text-gray-400">Following</div>
            </div>
          </div>
        </div>

        <div className="mt-3 lg:mt-4 xl:mt-5">
          <h2 className="font-bold text-base lg:text-lg xl:text-xl">
            {profileData.username}
          </h2>
          <p className="text-sm lg:text-base mt-1 lg:mt-2">{profileData.bio}</p>
        </div>

        <div className="flex space-x-2 lg:space-x-3 mt-3 lg:mt-4">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-1.5 lg:py-2 xl:py-2.5 rounded-md text-sm lg:text-base font-medium ${
              isFollowing ? "bg-gray-800" : "bg-blue-500"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button className="flex-1 py-1.5 lg:py-2 xl:py-2.5 bg-gray-800 rounded-md text-sm lg:text-base font-medium flex items-center justify-center">
            <FiMessageCircle className="mr-1 lg:mr-2 text-sm lg:text-base" />
            Message
          </button>
          <button className="p-1.5 lg:p-2 xl:p-2.5 bg-gray-800 rounded-md">
            <FiUserPlus className="text-sm lg:text-base" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800 flex">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 lg:py-4 flex items-center justify-center ${
            activeTab === "posts" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsGrid3X3 className="text-lg lg:text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 lg:py-4 flex items-center justify-center ${
            activeTab === "saved" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsBookmark className="text-lg lg:text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={`flex-1 py-3 lg:py-4 flex items-center justify-center ${
            activeTab === "tagged" ? "border-t border-white" : "text-gray-400"
          }`}
        >
          <BsEmojiFrown className="text-lg lg:text-xl" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5 lg:gap-1">
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
                <div className="flex items-center text-white mr-4 lg:mr-6">
                  <BsHeart className="mr-1 lg:mr-2 text-sm lg:text-base" />
                  <span className="font-bold text-sm lg:text-base">0</span>
                </div>
                <div className="flex items-center text-white">
                  <BsChat className="mr-1 lg:mr-2 text-sm lg:text-base" />
                  <span className="font-bold text-sm lg:text-base">0</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
