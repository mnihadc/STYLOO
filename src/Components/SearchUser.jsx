import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Mock recommended profiles (replace with your API data)
  const recommendedProfiles = [
    {
      id: 1,
      username: "travel_lover",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      caption: "Travel enthusiast | Photography",
      followers: "125k",
      isFollowing: false,
    },
    {
      id: 2,
      username: "tech_guru",
      name: "Mike Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      caption: "Tech reviews | Gadgets",
      followers: "89k",
      isFollowing: true,
    },
    {
      id: 3,
      username: "fitness_coach",
      name: "Alex Rivera",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      caption: "Fitness trainer | Nutrition",
      followers: "256k",
      isFollowing: false,
    },
  ];

  // Mock search function (replace with your API call)
  const searchUsers = (query) => {
    if (!query) {
      setSearchResults([]);
      setShowRecommendations(true);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      const mockResults = [
        {
          id: 4,
          username: "fashion_designer",
          name: "Emma Wilson",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          caption: "Fashion designer | Lifestyle",
          followers: "432k",
          isFollowing: false,
        },
        {
          id: 5,
          username: "food_explorer",
          name: "David Kim",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
          caption: "Food blogger | Recipes",
          followers: "187k",
          isFollowing: false,
        },
      ].filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
      setShowRecommendations(false);
      setIsSearching(false);
    }, 800);
  };

  // Auto-search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowRecommendations(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search</h1>

        {/* Search Input */}
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

      {/* Loading Indicator */}
      {isSearching && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="space-y-4">
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-gray-400 text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{user.caption}</p>
                    <p className="text-gray-400 text-xs">
                      {user.followers} followers
                    </p>
                  </div>
                </div>
                <button
                  className={`px-4 py-1 rounded-lg text-sm font-medium ${
                    user.isFollowing
                      ? "bg-gray-800 text-white"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Profiles (shown when no search query) */}
      {!isSearching && showRecommendations && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recommended for you</h2>
          <div className="space-y-4">
            {recommendedProfiles.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-gray-400 text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{user.caption}</p>
                    <p className="text-gray-400 text-xs">
                      {user.followers} followers
                    </p>
                  </div>
                </div>
                <button
                  className={`px-4 py-1 rounded-lg text-sm font-medium ${
                    user.isFollowing
                      ? "bg-gray-800 text-white"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Found */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No users found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
