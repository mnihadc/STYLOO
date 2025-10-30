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
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{user.username}</h3>
          <p className="text-gray-400 text-sm">{user.name}</p>
          {user.caption && (
            <p className="text-gray-400 text-xs mt-1">{user.caption}</p>
          )}
          {user.followers && (
            <p className="text-gray-400 text-xs">{user.followers} followers</p>
          )}
        </div>
      </div>
      <button
        className={`px-4 py-1 rounded-lg text-sm font-medium ${
          user.isFollowing ? "bg-gray-800" : "bg-purple-600"
        } text-white`}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search</h1>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-gray-900 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isSearching && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && searchQuery && searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="space-y-4">{searchResults.map(renderUserCard)}</div>
        </div>
      )}

      {/* Recommended Users */}
      {!isSearching && !searchQuery && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recommended for you</h2>
          <div className="space-y-4">{recommended.map(renderUserCard)}</div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No users found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
