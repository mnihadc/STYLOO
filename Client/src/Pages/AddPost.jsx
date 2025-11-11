import React, { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiImage,
  FiMusic,
  FiMapPin,
  FiUser,
  FiSmile,
  FiLink,
  FiUpload,
  FiVideo,
} from "react-icons/fi";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function AddPost() {
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("post");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [mediaLinks, setMediaLinks] = useState([{ url: "", type: "image" }]);
  const [music, setMusic] = useState({ trackId: "", title: "", artist: "" });
  const [showMusicModal, setShowMusicModal] = useState(false);
  const fileInputRef = useRef(null);
  const { currentUser, token } = useSelector((state) => state.user);

  // Reset media when switching between post/reel
  useEffect(() => {
    if (activeTab === "reel") {
      // Default to video type for reels
      setMediaLinks([{ url: "", type: "video" }]);
      setSelectedMedia(null);
    } else {
      setMediaLinks([{ url: "", type: "image" }]);
      setSelectedMedia(null);
    }
  }, [activeTab]);

  // Handle file upload method
  const handleMediaSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type based on active tab
      if (activeTab === "reel") {
        if (!file.type.startsWith("video/")) {
          toast.error("Please select a video file for reels");
          return;
        }
        // Validate video duration (max 90 seconds for reels)
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 90) {
            toast.error("Reels must be 90 seconds or shorter");
            return;
          }
          const mediaUrl = URL.createObjectURL(file);
          setSelectedMedia({ url: mediaUrl, type: "video", file });
        };
        video.src = URL.createObjectURL(file);
      } else {
        // For posts, accept both images and videos
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        const mediaUrl = URL.createObjectURL(file);
        setSelectedMedia({ url: mediaUrl, type: mediaType, file });
      }
      setUploadMethod("file");
    }
  };

  // Handle direct link method
  const handleLinkAdd = () => {
    const defaultType = activeTab === "reel" ? "video" : "image";
    setMediaLinks([...mediaLinks, { url: "", type: defaultType }]);
  };

  const handleLinkRemove = (index) => {
    const newLinks = mediaLinks.filter((_, i) => i !== index);
    setMediaLinks(newLinks);
    if (newLinks.length > 0 && newLinks[0].url) {
      setSelectedMedia({ url: newLinks[0].url, type: newLinks[0].type });
    } else {
      setSelectedMedia(null);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...mediaLinks];
    newLinks[index][field] = value;
    setMediaLinks(newLinks);

    // Update preview with first valid URL
    const firstValidLink = newLinks.find((link) => link.url);
    if (firstValidLink) {
      setSelectedMedia({ url: firstValidLink.url, type: firstValidLink.type });
    } else {
      setSelectedMedia(null);
    }
  };

  // Mock music selection (you'll integrate with your music API)
  const handleMusicSelect = (track) => {
    setMusic(track);
    setShowMusicModal(false);
    toast.success(`"${track.title}" by ${track.artist} selected`);
  };

  const addTaggedUser = () => {
    if (tagInput.trim() && !taggedUsers.includes(tagInput.trim())) {
      setTaggedUsers([...taggedUsers, tagInput.trim()]);
      setTagInput("");
      setShowTagInput(false);
      toast.success(`@${tagInput.trim()} tagged successfully!`);
    }
  };

  const removeTaggedUser = (userToRemove) => {
    setTaggedUsers(taggedUsers.filter((user) => user !== userToRemove));
    toast.success(`@${userToRemove} removed from tags`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (uploadMethod === "file" && !selectedMedia) {
      toast.error(
        `Please select ${activeTab === "reel" ? "a video" : "media"} to post`
      );
      return;
    }

    if (uploadMethod === "link" && !mediaLinks.some((link) => link.url)) {
      toast.error("Please add at least one media URL");
      return;
    }

    // Validate URLs if using links
    if (uploadMethod === "link") {
      const invalidLinks = mediaLinks.filter(
        (link) => link.url && !isValidUrl(link.url)
      );
      if (invalidLinks.length > 0) {
        toast.error("Please fix invalid URLs before posting");
        return;
      }

      // For reels, ensure at least one video URL
      if (
        activeTab === "reel" &&
        !mediaLinks.some((link) => link.type === "video")
      ) {
        toast.error("Reels must contain at least one video");
        return;
      }
    }

    try {
      const loadingToast = toast.loading(`Creating your ${activeTab}...`);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("postType", activeTab); // "post" or "reel"
      formData.append("useDirectLinks", uploadMethod === "link");

      if (location) {
        formData.append("location", JSON.stringify({ name: location }));
      }

      if (taggedUsers.length > 0) {
        formData.append("taggedUsers", JSON.stringify(taggedUsers));
      }

      if (music.trackId) {
        formData.append("music", JSON.stringify(music));
      }

      if (uploadMethod === "link") {
        formData.append("media", JSON.stringify(mediaLinks));
      } else {
        // Handle file upload
        if (selectedMedia.file) {
          formData.append("media", selectedMedia.file);
        }
      }

      const res = await axios.post("/api/posts/create-posting", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success(
        `${activeTab === "post" ? "Post" : "Reel"} created successfully! 🎉`
      );

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/post");
      }, 1500);
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message || "Failed to create post!";
      toast.error(errorMessage);
    }
  };

  // Helper function to validate URLs in frontend
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Mock music data
  const mockMusicTracks = [
    { trackId: "1", title: "Summer Vibes", artist: "DJ Ocean", coverUrl: "" },
    {
      trackId: "2",
      title: "Urban Dreams",
      artist: "Metro Beats",
      coverUrl: "",
    },
    {
      trackId: "3",
      title: "Sunset Boulevard",
      artist: "Coastal Waves",
      coverUrl: "",
    },
    { trackId: "4", title: "Night Drive", artist: "Synth City", coverUrl: "" },
  ];

  return (
    <div className="bg-black text-white min-h-screen max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151",
          },
          success: {
            style: {
              background: "#065f46",
              color: "white",
              border: "1px solid #047857",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
              color: "white",
              border: "1px solid #dc2626",
            },
          },
          loading: {
            style: {
              background: "#1f2937",
              color: "white",
            },
          },
        }}
      />

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

      {/* Upload Method Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setUploadMethod("file")}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            uploadMethod === "file" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <FiUpload className="inline mr-2" />
          Upload File
        </button>
        <button
          onClick={() => setUploadMethod("link")}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            uploadMethod === "link" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <FiLink className="inline mr-2" />
          Use Link
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Media Input */}
        <div className="lg:w-1/2 p-4 lg:p-6">
          {uploadMethod === "file" ? (
            // File Upload Section
            !selectedMedia ? (
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {activeTab === "reel" ? (
                  <FiVideo className="text-4xl lg:text-5xl text-gray-400 mx-auto mb-4" />
                ) : (
                  <FiImage className="text-4xl lg:text-5xl text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-lg lg:text-xl font-semibold mb-2">
                  {activeTab === "reel"
                    ? "Drag videos here"
                    : "Drag photos and videos here"}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {activeTab === "reel"
                    ? "MP4, MOV • 90 seconds max"
                    : "JPEG, PNG, MP4, MOV"}
                </p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm lg:text-base">
                  Select from computer
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaSelect}
                  accept={activeTab === "reel" ? "video/*" : "image/*,video/*"}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-auto rounded-lg max-h-[500px] object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt="Selected for post"
                    className="w-full h-auto rounded-lg max-h-[500px] object-contain"
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedMedia(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    toast.success("Media removed");
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                >
                  <FiX className="text-white text-lg" />
                </button>
              </div>
            )
          ) : (
            // Direct Links Section
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Add Media URLs</h3>
                <button
                  onClick={handleLinkAdd}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Add More
                </button>
              </div>

              {mediaLinks.map((link, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex space-x-2">
                    <select
                      value={link.type}
                      onChange={(e) =>
                        handleLinkChange(index, "type", e.target.value)
                      }
                      className="bg-gray-800 rounded px-3 py-2 text-sm"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(index, "url", e.target.value)
                      }
                      placeholder={`Paste ${link.type} URL here...`}
                      className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm placeholder-gray-400"
                    />
                    {mediaLinks.length > 1 && (
                      <button
                        onClick={() => handleLinkRemove(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded text-sm"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                  {link.url && (
                    <div className="text-xs text-gray-400">
                      {isValidUrl(link.url) ? (
                        <span className="text-green-400">✓ Valid URL</span>
                      ) : (
                        <span className="text-red-400">✗ Invalid URL</span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Preview */}
              {selectedMedia && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Preview:</h4>
                  {selectedMedia.type === "video" ? (
                    <video
                      src={selectedMedia.url}
                      controls
                      className="w-full h-auto rounded-lg max-h-[300px] object-contain border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = "none";
                        toast.error("Failed to load preview video");
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedMedia.url}
                      alt="Preview"
                      className="w-full h-auto rounded-lg max-h-[300px] object-contain border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = "none";
                        toast.error("Failed to load preview image");
                      }}
                    />
                  )}
                </div>
              )}
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
              placeholder={`Write a caption for your ${activeTab}...`}
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

            {/* Music for Reels */}
            {activeTab === "reel" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiMusic className="text-lg text-gray-400" />
                  <span>Add Music</span>
                </div>
                {music.trackId ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 text-sm truncate max-w-[120px]">
                      {music.title}
                    </span>
                    <BsThreeDots className="text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMusicModal(true)}
                    className="text-gray-400"
                  >
                    Add
                  </button>
                )}
              </div>
            )}

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

            {/* Music Selection Modal */}
            {showMusicModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 w-11/12 max-w-md max-h-[80vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Select Music</h3>
                  <div className="space-y-2">
                    {mockMusicTracks.map((track) => (
                      <button
                        key={track.trackId}
                        onClick={() => handleMusicSelect(track)}
                        className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors"
                      >
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-gray-400">
                          {track.artist}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowMusicModal(false)}
                    className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
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
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        <div className="flex space-x-3">
          <button
            onClick={() => toast.success("Draft saved successfully!")}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-colors ${
              (uploadMethod === "file" && selectedMedia) ||
              (uploadMethod === "link" && mediaLinks.some((link) => link.url))
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={
              (uploadMethod === "file" && !selectedMedia) ||
              (uploadMethod === "link" && !mediaLinks.some((link) => link.url))
            }
          >
            Share {activeTab === "post" ? "Post" : "Reel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
