import { useState, useEffect } from "react";
import { FiUser, FiEdit, FiArrowLeft } from "react-icons/fi";
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
        setError("Network error. Please try again.");
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

    try {
      // Replace with your actual API call
      const response = await fetch("/api/profile", {
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

      // Redirect back to settings after successful update
      navigate("/settings");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header with back button */}
      <header className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/settings")}
          className="mr-4 p-2 rounded-full hover:bg-gray-800"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-gray-400">Update your profile information</p>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar upload */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-600">
                  <FiUser className="text-3xl" />
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700"
            >
              <FiEdit className="text-sm" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-gray-400 text-sm">Click to change photo</p>
        </div>

        {/* Username */}
        <div className="bg-gray-900 rounded-xl p-4">
          <label
            htmlFor="username"
            className="block text-gray-300 text-sm mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            minLength="3"
            maxLength="30"
            pattern="[a-zA-Z0-9_]+"
            title="Username can only contain letters, numbers, and underscores"
          />
          <p className="text-gray-500 text-xs mt-1">
            This will be your unique identifier
          </p>
        </div>

        {/* Name */}
        <div className="bg-gray-900 rounded-xl p-4">
          <label htmlFor="name" className="block text-gray-300 text-sm mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            maxLength="50"
          />
        </div>

        {/* Tagline */}
        <div className="bg-gray-900 rounded-xl p-4">
          <label htmlFor="tagline" className="block text-gray-300 text-sm mb-2">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={profile.tagline}
            onChange={handleChange}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            maxLength="100"
          />
          <p className="text-gray-500 text-xs mt-1">
            A short description that appears under your name
          </p>
        </div>

        {/* Bio */}
        <div className="bg-gray-900 rounded-xl p-4">
          <label htmlFor="bio" className="block text-gray-300 text-sm mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            maxLength="500"
          />
          <p className="text-gray-500 text-xs mt-1">
            Tell others about yourself (max 500 characters)
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
