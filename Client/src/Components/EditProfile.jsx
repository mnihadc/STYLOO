import { useState, useEffect } from "react";
import { FiUser, FiEdit, FiArrowLeft, FiUpload, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    tagline: "",
    bio: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/user/profile-user");
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Network error. Please try again.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Replace with your actual API call
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => navigate("/settings"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 lg:p-8 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full h-16 w-16 lg:h-20 lg:w-20 bg-gray-800 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-32 lg:w-40 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-24 lg:w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Header with back button */}
      <header className="mb-8 lg:mb-12 flex items-center">
        <button
          onClick={() => navigate("/settings")}
          className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 lg:p-3"
          aria-label="Go back"
        >
          <FiArrowLeft className="text-xl lg:text-2xl" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-400 text-sm lg:text-base">
            Customize your public profile
          </p>
        </div>
      </header>

      {/* Status messages */}
      <div className="mb-6 lg:mb-8 space-y-3">
        {error && (
          <div className="p-3 lg:p-4 bg-red-900/50 border border-red-700 text-red-100 rounded-lg flex items-center text-sm lg:text-base">
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError("")}
              className="text-red-300 hover:text-white lg:text-lg"
            >
              &times;
            </button>
          </div>
        )}
        {success && (
          <div className="p-3 lg:p-4 bg-green-900/50 border border-green-700 text-green-100 rounded-lg flex items-center text-sm lg:text-base">
            <FiCheck className="mr-2 lg:mr-3 flex-shrink-0 text-lg lg:text-xl" />
            <div className="flex-1">Profile updated successfully!</div>
          </div>
        )}
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Avatar upload */}
        <div className="flex flex-col items-center">
          <div className="relative group mb-3 lg:mb-4">
            <div className="w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="text-4xl lg:text-5xl xl:text-6xl text-white/80" />
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 bg-gradient-to-br from-purple-600 to-pink-600 p-2 lg:p-3 rounded-full cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center"
            >
              <FiUpload className="text-sm lg:text-base" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-gray-400 text-sm lg:text-base">
            JPG, PNG (max 5MB)
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-5 lg:space-y-6">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 lg:px-6 lg:py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent peer text-sm lg:text-base"
              placeholder=" "
              required
              minLength="3"
              maxLength="30"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
            />
            <label
              htmlFor="username"
              className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 px-1 bg-black text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-purple-400 peer-focus:text-sm lg:peer-focus:text-base"
            >
              Username
            </label>
            <div className="mt-1 text-xs lg:text-sm text-gray-500 flex justify-between">
              <span>Your unique identifier</span>
              <span>{profile.username.length}/30</span>
            </div>
          </div>

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 lg:px-6 lg:py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent peer text-sm lg:text-base"
              placeholder=" "
              maxLength="50"
            />
            <label
              htmlFor="name"
              className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 px-1 bg-black text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-purple-400 peer-focus:text-sm lg:peer-focus:text-base"
            >
              Display Name
            </label>
            <div className="mt-1 text-xs lg:text-sm text-gray-500 flex justify-end">
              <span>{profile.name.length}/50</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="relative">
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={profile.tagline}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 lg:px-6 lg:py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent peer text-sm lg:text-base"
              placeholder=" "
              maxLength="100"
            />
            <label
              htmlFor="tagline"
              className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 px-1 bg-black text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-purple-400 peer-focus:text-sm lg:peer-focus:text-base"
            >
              Tagline
            </label>
            <div className="mt-1 text-xs lg:text-sm text-gray-500 flex justify-between">
              <span>Appears under your name</span>
              <span>{profile.tagline.length}/100</span>
            </div>
          </div>

          {/* Bio */}
          <div className="relative">
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 lg:px-6 lg:py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent peer text-sm lg:text-base"
              placeholder=" "
              maxLength="500"
            />
            <label
              htmlFor="bio"
              className="absolute left-3 lg:left-6 top-4 px-1 bg-black text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-purple-400 peer-focus:text-sm lg:peer-focus:text-base"
            >
              Bio
            </label>
            <div className="mt-1 text-xs lg:text-sm text-gray-500 flex justify-between">
              <span>Tell others about yourself</span>
              <span>{profile.bio.length}/500</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 lg:pt-6">
          <button
            type="submit"
            disabled={isLoading || success}
            className={`w-full py-3 lg:py-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300 text-sm lg:text-base ${
              isLoading || success
                ? "bg-purple-800 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30"
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-t-2 border-b-2 border-white mr-2 lg:mr-3"></span>
                Saving...
              </>
            ) : success ? (
              <>
                <FiCheck className="mr-2 lg:mr-3 text-lg lg:text-xl" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
