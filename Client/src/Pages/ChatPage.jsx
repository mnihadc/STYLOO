import React, { useState } from "react";
import { FiSearch, FiMoreVertical, FiVideo, FiSend } from "react-icons/fi";
import { BsCheck2All, BsThreeDots, BsFilter } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";
const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const recentChats = [
    {
      id: 1,
      username: "john_doe",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      lastMessage: "Hey, are we still meeting tomorrow?",
      time: "2h ago",
      unread: 3,
      online: true,
    },
    {
      id: 2,
      username: "alex_wilson",
      name: "Alex Wilson",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      lastMessage: "Sent you those files 📁",
      time: "5h ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      username: "sarah_smith",
      name: "Sarah Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      lastMessage: "The party was amazing!",
      time: "1d ago",
      unread: 1,
      online: true,
    },
    {
      id: 4,
      username: "mike_johnson",
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "Thanks for the help!",
      time: "2d ago",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      username: "emily_clark",
      name: "Emily Clark",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      lastMessage: "Check out this reel 👀",
      time: "3d ago",
      unread: 0,
      online: true,
    },
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: "them",
        text: "Hey, how are you doing?",
        time: "10:30 AM",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "I'm good! Just working on some projects.",
        time: "10:32 AM",
        read: true,
      },
      {
        id: 3,
        sender: "them",
        text: "Are we still meeting tomorrow?",
        time: "2:15 PM",
        read: true,
      },
      {
        id: 4,
        sender: "me",
        text: "Yes, at the coffee shop at 3pm",
        time: "2:17 PM",
        read: true,
      },
      {
        id: 5,
        sender: "them",
        text: "Perfect! See you then",
        time: "2:18 PM",
        read: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: "them",
        text: "I sent you those files we discussed",
        time: "9:45 AM",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "Got them, thanks!",
        time: "10:00 AM",
        read: true,
      },
      {
        id: 3,
        sender: "them",
        text: "Let me know if you need anything else",
        time: "10:01 AM",
        read: true,
      },
    ],
    3: [
      {
        id: 1,
        sender: "them",
        text: "The party was amazing last night!",
        time: "11:30 PM",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "Right? We should do it again soon",
        time: "11:32 PM",
        read: true,
      },
      {
        id: 3,
        sender: "them",
        text: "Definitely! Next weekend?",
        time: "11:33 PM",
        read: false,
      },
    ],
  };

  const handleSend = () => {
    if (newMessage.trim() === "" || !activeChat) return;

    const newMsg = {
      id: messages[activeChat.id].length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    const updatedMessages = {
      ...messages,
      [activeChat.id]: [...messages[activeChat.id], newMsg],
    };

    setNewMessage("");
  };

  const filteredChats = recentChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black text-white h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-3 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="flex space-x-4">
            <button>
              <BsFilter className="text-xl" />
            </button>
            <button>
              <FiMoreVertical className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-900 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {activeChat ? (
        /* Active Chat View */
        <>
          {/* Chat header */}
          <Link to="/chat">
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <div className="flex items-center">
                <button onClick={() => setActiveChat(null)} className="mr-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h2 className="font-semibold">{activeChat.username}</h2>
                  <p
                    className={`text-xs ${
                      activeChat.online ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {activeChat.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FiVideo className="cursor-pointer" />
                <BsThreeDots className="cursor-pointer" />
              </div>
            </div>
          </Link>
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900 bg-opacity-50">
            {messages[activeChat.id]?.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.sender === "me" ? "bg-blue-600" : "bg-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs text-gray-300">
                      {message.time}
                    </span>
                    {message.sender === "me" && (
                      <BsCheck2All
                        className={`text-xs ${
                          message.read ? "text-blue-300" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Message..."
                className="flex-1 bg-gray-800 rounded-full py-2 px-4 mx-2 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="p-2 text-xl text-blue-500"
                onClick={handleSend}
              >
                {newMessage.trim() ? <IoMdSend /> : <FiSend />}
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Chat List View */
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-3 hover:bg-gray-900 cursor-pointer border-b border-gray-800"
              onClick={() => setActiveChat(chat)}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{chat.username}</h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-400 truncate flex-1">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
