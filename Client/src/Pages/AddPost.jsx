import React, { useState, useRef } from "react";
import {
  FiX,
  FiImage,
  FiMusic,
  FiMapPin,
  FiUser,
  FiSmile,
} from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

function AddPost() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("post"); // 'post' or 'reel'
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTaggedUser = () => {
    if (tagInput.trim() && !taggedUsers.includes(tagInput.trim())) {
      setTaggedUsers([...taggedUsers, tagInput.trim()]);
      setTagInput("");
      setShowTagInput(false);
    }
  };

  const removeTaggedUser = (userToRemove) => {
    setTaggedUsers(taggedUsers.filter((user) => user !== userToRemove));
  };

  const handleSubmit = () => {
    // Handle post submission logic here
    console.log({
      image: selectedImage,
      caption,
      location,
      taggedUsers,
      type: activeTab,
    });
    // You would typically upload to your backend here
  };

  return (
    <div className="bg-black text-white min-h-screen max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 p-3 lg:p-4 border-b border-gray-800 flex items-center justify-between">
        <Link to="/profile">
          <button className="text-xl lg:text-2xl">
            <FiX />
          </button>
        </Link>
        <div className="flex items-center">
          <span className="font-bold text-base lg:text-lg xl:text-xl">
            Create {activeTab === "post" ? "Post" : "Reel"}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="text-blue-400 font-semibold text-sm lg:text-base"
        >
          Share
        </button>
      </div>

      {/* Content Type Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("post")}
          className={`flex-1 py-4 text-center font-semibold ${
            activeTab === "post"
              ? "text-white border-b-2 border-white"
              : "text-gray-400"
          }`}
        >
          Post
        </button>
        <button
          onClick={() => setActiveTab("reel")}
          className={`flex-1 py-4 text-center font-semibold ${
            activeTab === "reel"
              ? "text-white border-b-2 border-white"
              : "text-gray-400"
          }`}
        >
          Reel
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Image Upload */}
        <div className="lg:w-1/2 p-4 lg:p-6">
          {!selectedImage ? (
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FiImage className="text-4xl lg:text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg lg:text-xl font-semibold mb-2">
                Drag photos and videos here
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm lg:text-base">
                Select from computer
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected for post"
                className="w-full h-auto rounded-lg max-h-[500px] object-contain"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              >
                <FiX className="text-white text-lg" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Post Details */}
        <div className="lg:w-1/2 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-gray-800">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <FiUser className="text-white text-lg" />
              </div>
            </div>
            <span className="font-semibold">your_username</span>
          </div>

          {/* Caption Input */}
          <div className="mb-6">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-transparent border-0 resize-none focus:ring-0 text-white placeholder-gray-400 text-base lg:text-lg min-h-[120px]"
              rows="4"
            />
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <span>{caption.length}/2,200</span>
              <FiSmile className="text-lg cursor-pointer" />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-lg text-gray-400" />
                <span>Add location</span>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search locations"
                className="bg-transparent border-0 text-right focus:ring-0 text-white placeholder-gray-400 flex-1 ml-4"
              />
            </div>

            {/* Tag People */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiUser className="text-lg text-gray-400" />
                <span>Tag people</span>
              </div>
              {taggedUsers.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 text-sm">
                    {taggedUsers.length} tagged
                  </span>
                  <BsThreeDots className="text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="text-gray-400"
                >
                  Add
                </button>
              )}
            </div>

            {/* Tag Input Modal */}
            {showTagInput && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 w-11/12 max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Tag People</h3>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addTaggedUser()}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={addTaggedUser}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowTagInput(false)}
                      className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tagged Users List */}
            {taggedUsers.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-3">
                <h4 className="text-sm font-semibold mb-2">Tagged Users:</h4>
                <div className="flex flex-wrap gap-2">
                  {taggedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
                    >
                      <span className="text-sm">@{user}</span>
                      <button
                        onClick={() => removeTaggedUser(user)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="flex items-center justify-between">
              <span>Advanced settings</span>
              <BsThreeDots className="text-gray-400" />
            </div>
          </div>

          {/* Reel Specific Options */}
          {activeTab === "reel" && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <FiMusic className="mr-2" />
                Add Music
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Choose a sound for your reel
              </p>
              <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold text-sm transition-colors">
                Browse Music
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        <div className="flex space-x-3">
          <button className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors">
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-colors ${
              selectedImage
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedImage}
          >
            Share {activeTab === "post" ? "Post" : "Reel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
