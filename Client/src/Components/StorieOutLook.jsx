import React from "react";

const SquareStories = () => {
  // Sample stories data
  const stories = [
    {
      id: 1,
      username: "your_story",
      isYourStory: true,
      hasNewStory: true,
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      username: "travel_lover",
      isYourStory: false,
      hasNewStory: true,
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      username: "foodie_gram",
      isYourStory: false,
      hasNewStory: true,
      imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      username: "fitness_guru",
      isYourStory: false,
      hasNewStory: false,
      imageUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      id: 5,
      username: "tech_geek",
      isYourStory: false,
      hasNewStory: true,
      imageUrl: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
      id: 6,
      username: "art_lover",
      isYourStory: false,
      hasNewStory: false,
      imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  return (
    <div className="bg-black p-4 lg:p-6 border-b border-gray-800 max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex space-x-4 lg:space-x-6 xl:space-x-8 overflow-x-auto pb-2 hide-scrollbar">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-1 lg:space-y-2 flex-shrink-0"
          >
            <div
              className={`relative rounded-lg flex items-center justify-center ${
                story.hasNewStory
                  ? "bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5 lg:p-1"
                  : "bg-gray-700 p-0.5 lg:p-1"
              }`}
              style={{
                width: "clamp(60px, 15vw, 80px)",
                height: "clamp(60px, 15vw, 80px)",
              }}
            >
              <div className="relative w-full h-full rounded-lg bg-black overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.username}
                  className="w-full h-full object-cover"
                />
                {story.isYourStory && (
                  <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 bg-blue-500 rounded-full p-1 lg:p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 lg:h-4 lg:w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <span
              className="text-xs lg:text-sm truncate text-center text-white"
              style={{ width: "clamp(60px, 15vw, 80px)" }}
            >
              {story.isYourStory ? "Your Story" : story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SquareStories;
