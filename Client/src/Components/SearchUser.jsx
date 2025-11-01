import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import axios from "axios";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recommended, setRecommended] = useState([]);

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/user/get-users-chat", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const users = res.data;
        setAllUsers(users);

        // Shuffle and take 10 random users
        const shuffled = users.sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  // Search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const filtered = allUsers.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Simulate API delay to show loading spinner
      setTimeout(() => {
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, allUsers]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const renderUserCard = (user) => (
    <div key={user._id} className="flex items-center justify-between">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-sm lg:text-base xl:text-lg">
            {user.username}
          </h3>
          <p className="text-gray-400 text-sm lg:text-base">{user.name}</p>
          {user.caption && (
            <p className="text-gray-400 text-xs lg:text-sm mt-1">
              {user.caption}
            </p>
          )}
          {user.followers && (
            <p className="text-gray-400 text-xs lg:text-sm">
              {user.followers} followers
            </p>
          )}
        </div>
      </div>
      <button
        className={`px-4 py-1 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-lg text-sm lg:text-base font-medium ${
          user.isFollowing ? "bg-gray-800" : "bg-purple-600"
        } text-white hover:bg-purple-700 transition-colors`}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 xl:p-8 max-w-md mx-auto lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl">
      {/* Search Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-4">
          Search
        </h1>
        <div className="relative">
          <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
            <FiSearch className="text-gray-400 text-sm lg:text-base" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-gray-900 rounded-lg py-3 lg:py-4 xl:py-4 pl-10 lg:pl-12 xl:pl-12 pr-10 lg:pr-12 xl:pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base xl:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm lg:text-base"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isSearching && (
        <div className="flex justify-center py-4 lg:py-6">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && searchQuery && searchResults.length > 0 && (
        <div className="mb-8 lg:mb-10">
          <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4 lg:mb-6">
            Results
          </h2>
          <div className="space-y-4 lg:space-y-5 xl:space-y-6">
            {searchResults.map(renderUserCard)}
          </div>
        </div>
      )}

      {/* Recommended Users */}
      {!isSearching && !searchQuery && (
        <div>
          <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4 lg:mb-6">
            Recommended for you
          </h2>
          <div className="space-y-4 lg:space-y-5 xl:space-y-6">
            {recommended.map(renderUserCard)}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8 lg:py-12 xl:py-16 text-gray-400">
          <p className="text-sm lg:text-base xl:text-lg">
            No users found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
