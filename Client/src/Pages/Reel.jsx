import React, { useState, useRef, useEffect } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiMoreVertical,
  FiMusic,
  FiSearch,
} from "react-icons/fi";
import {
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { BsEmojiSunglasses, BsThreeDots, BsShareFill } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const videoRefs = useRef([]);
  const reelsContainerRef = useRef(null);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  
  const { token } = useSelector((state) => state.user);

  // Fetch reels from backend API
  const fetchReels = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/reels?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const reelsData = response.data.reels.map(reel => ({
          id: reel._id,
          username: reel.user?.username || "unknown_user",
          userImage: reel.user?.avatar || "https://randomuser.me/api/portraits/women/44.jpg",
          videoUrl: reel.media[0]?.url || "",
          likes: reel.likeCount || 0,
          comments: reel.commentCount || 0,
          caption: reel.caption || "",
          music: reel.music?.title || "Original Sound",
          isLiked: reel.likes?.includes(reel.user?._id) || false, // You'll need to pass current user ID
          isSaved: reel.saves?.includes(reel.user?._id) || false, // You'll need to pass current user ID
          isPlaying: false,
          postType: reel.postType,
          aspectRatio: reel.aspectRatio || "9:16"
        }));

        if (page === 1) {
          setReels(reelsData);
        } else {
          setReels(prev => [...prev, ...reelsData]);
        }

        setHasMore(response.data.pagination?.hasNext || false);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
      toast.error("Failed to load reels");
      
      // Fallback to sample data if API fails
      if (page === 1) {
        setReels(getSampleReels());
      }
    } finally {
      setLoading(false);
    }
  };

  // Sample reels data as fallback
  const getSampleReels = () => [
    {
      id: 1,
      username: "dance_queen",
      userImage: "https://randomuser.me/api/portraits/women/44.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-under-neon-lights-1230-large.mp4",
      likes: 12456,
      comments: 423,
      caption: "Friday night vibes! 💃 #dance #party #weekend",
      music: "Nightclub Beats - DJ Mix",
      isLiked: false,
      isSaved: false,
      isPlaying: false,
      postType: "reel",
      aspectRatio: "9:16"
    },
    {
      id: 2,
      username: "adventure_time",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-climbing-a-mountain-3466-large.mp4",
      likes: 8921,
      comments: 312,
      caption: "Reached the summit! ⛰️ #adventure #hiking #nature",
      music: "Mountain Winds - Nature Sounds",
      isLiked: true,
      isSaved: true,
      isPlaying: false,
      postType: "reel",
      aspectRatio: "9:16"
    },
    {
      id: 3,
      username: "coffee_lover",
      userImage: "https://randomuser.me/api/portraits/women/68.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-on-a-table-1761-large.mp4",
      likes: 24567,
      comments: 856,
      caption: "Perfect morning starts with coffee ☕ #coffee #morning #relax",
      music: "Coffee Shop Jazz - Morning Mix",
      isLiked: false,
      isSaved: false,
      isPlaying: false,
      postType: "reel",
      aspectRatio: "9:16"
    }
  ];

  // Load reels on component mount
  useEffect(() => {
    fetchReels(1);
  }, []);

  // Handle like action
  const handleLike = async (id) => {
    try {
      const reel = reels.find(r => r.id === id);
      const newLikedState = !reel.isLiked;
      
      // Optimistic update
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          return {
            ...reel,
            isLiked: newLikedState,
            likes: newLikedState ? reel.likes + 1 : reel.likes - 1,
          };
        }
        return reel;
      }));

      // API call to like/unlike
      await axios.post(`/api/posts/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (error) {
      console.error("Error liking reel:", error);
      // Revert optimistic update on error
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          return {
            ...reel,
            isLiked: !reel.isLiked,
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
          };
        }
        return reel;
      }));
      toast.error("Failed to like reel");
    }
  };

  // Handle save action
  const handleSave = async (id) => {
    try {
      const reel = reels.find(r => r.id === id);
      const newSavedState = !reel.isSaved;
      
      // Optimistic update
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          return {
            ...reel,
            isSaved: newSavedState,
          };
        }
        return reel;
      }));

      // API call to save/unsave
      await axios.post(`/api/posts/${id}/save`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (error) {
      console.error("Error saving reel:", error);
      // Revert optimistic update on error
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          return {
            ...reel,
            isSaved: !reel.isSaved,
          };
        }
        return reel;
      }));
      toast.error("Failed to save reel");
    }
  };

  // Handle scroll for video play/pause and infinite scroll
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    
    // Handle video play/pause based on visibility
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        const rect = videoRef.getBoundingClientRect();
        const isVisible = rect.top >= -100 && rect.bottom <= windowHeight + 100;

        if (isVisible) {
          setCurrentReelIndex(index);
          videoRef.play().catch((e) => console.log("Autoplay prevented:", e));
        } else {
          videoRef.pause();
        }
      }
    });

    // Infinite scroll - load more when near bottom
    const container = reelsContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
        fetchReels(currentPage + 1);
      }
    }
  };

  // Set up scroll listener
  useEffect(() => {
    const container = reelsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loading, currentPage]);

  // Auto-play the first video on mount
  useEffect(() => {
    if (videoRefs.current[0] && reels.length > 0) {
      videoRefs.current[0]
        .play()
        .catch((e) => console.log("Autoplay prevented:", e));
    }
  }, [reels]);

  // Double tap to like
  const handleDoubleTap = (id) => {
    handleLike(id);
    // You can add animation here for the heart popup
  };

  if (loading && reels.length === 0) {
    return (
      <div className="relative bg-black h-screen w-full flex items-center justify-center">
        <div className="text-white text-xl">Loading reels...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-black h-screen w-full overflow-hidden">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151",
          },
        }}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-3 bg-gradient-to-b from-black to-transparent lg:px-8 lg:py-4">
        <h1 className="text-xl font-bold ml-2 lg:text-2xl">Reels</h1>
        <button className="p-2 lg:p-3">
          <FiSearch className="text-white text-xl lg:text-2xl" />
        </button>
      </div>

      {/* Reels Container */}
      <div
        ref={reelsContainerRef}
        className="h-full pt-12 pb-20 overflow-y-scroll snap-y snap-mandatory lg:pb-0"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div className="lg:max-w-2xl lg:mx-auto lg:border-x lg:border-gray-800">
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className="relative h-screen w-full snap-start lg:flex lg:items-center lg:justify-center"
              onDoubleClick={() => handleDoubleTap(reel.id)}
            >
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.videoUrl}
                loop
                muted
                playsInline
                className="w-full h-full object-cover bg-gray-900 lg:max-w-lg lg:max-h-[80vh] lg:rounded-xl"
                onClick={() => {
                  if (videoRefs.current[index].paused) {
                    videoRefs.current[index].play();
                  } else {
                    videoRefs.current[index].pause();
                  }
                }}
              />

              {/* Reel Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent lg:p-6">
                <div className="flex items-start">
                  {/* Left side - User info and caption */}
                  <div className="flex-1 lg:flex-initial lg:max-w-md">
                    <div className="flex items-center mb-2 lg:mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white mr-2 lg:w-10 lg:h-10">
                        <img
                          src={reel.userImage}
                          alt={reel.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-sm lg:text-base">
                        {reel.username}
                      </span>
                      <button className="ml-2 text-xs bg-gray-800 px-2 py-1 rounded lg:text-sm lg:px-3">
                        Follow
                      </button>
                    </div>
                    <p className="text-sm mb-2 line-clamp-2 lg:text-base lg:mb-3">
                      {reel.caption}
                    </p>
                    <div className="flex items-center text-xs lg:text-sm">
                      <FiMusic className="mr-1 lg:w-4 lg:h-4" />
                      <span className="truncate max-w-[180px] lg:max-w-[250px]">
                        {reel.music}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex flex-col items-center space-y-5 ml-2 lg:space-y-6 lg:ml-6">
                    {/* Like button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleLike(reel.id)}
                        className="text-2xl p-1 lg:text-3xl"
                      >
                        {reel.isLiked ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FiHeart />
                        )}
                      </button>
                      <span className="text-xs mt-1 lg:text-sm">
                        {reel.likes.toLocaleString()}
                      </span>
                    </div>

                    {/* Comment button */}
                    <div className="flex flex-col items-center">
                      <button className="text-2xl p-1 lg:text-3xl">
                        <FaRegComment />
                      </button>
                      <span className="text-xs mt-1 lg:text-sm">
                        {reel.comments.toLocaleString()}
                      </span>
                    </div>

                    {/* Share button */}
                    <div className="flex flex-col items-center">
                      <button className="text-2xl p-1 lg:text-3xl">
                        <BsShareFill />
                      </button>
                      <span className="text-xs mt-1 lg:text-sm">Share</span>
                    </div>

                    {/* Save button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleSave(reel.id)}
                        className="text-2xl p-1 lg:text-3xl"
                      >
                        {reel.isSaved ? (
                          <FaBookmark className="text-yellow-400" />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </button>
                      <span className="text-xs mt-1 lg:text-sm">Save</span>
                    </div>

                    {/* More options */}
                    <button className="text-xl p-1 lg:text-2xl">
                      <BsThreeDots />
                    </button>

                    {/* Music disc */}
                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center mt-2 lg:w-10 lg:h-10">
                      <FiMusic className="text-white text-sm lg:text-base" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator for infinite scroll */}
        {loading && reels.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="text-white">Loading more reels...</div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center p-3 z-10 lg:hidden">
        <button className="text-xl p-2">
          <svg
            aria-label="Home"
            className="text-white"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 0 0-2.997-2.996h-1.002a1 1 0 0 0-1 1v5.456a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1 1 0 0 1 .293-.707l8-8a1 1 0 0 1 1.414 0l8 8a1 1 0 0 1 .293.707V22a1 1 0 0 1-1 1Z"></path>
          </svg>
        </button>
        <button className="text-xl p-2">
          <svg
            aria-label="Search"
            className="text-white"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="16.511"
              x2="22"
              y1="16.511"
              y2="22"
            ></line>
          </svg>
        </button>
        <button className="text-xl p-2">
          <svg
            aria-label="New post"
            className="text-white"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="6.545"
              x2="17.455"
              y1="12.001"
              y2="12.001"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="12.003"
              x2="12.003"
              y1="6.545"
              y2="17.455"
            ></line>
          </svg>
        </button>
        <button className="text-xl p-2">
          <svg
            aria-label="Reels"
            className="text-pink-500"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <line
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="2.049"
              x2="21.95"
              y1="7.002"
              y2="7.002"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="13.504"
              x2="16.362"
              y1="2.001"
              y2="7.002"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="7.207"
              x2="10.002"
              y1="2.11"
              y2="7.002"
            ></line>
            <path
              d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.005-1.606-4.944C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <path
              d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
        <button className="w-6 h-6 rounded-full overflow-hidden border border-white">
          <img
            src="https://randomuser.me/api/portraits/women/22.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default ReelsPage;