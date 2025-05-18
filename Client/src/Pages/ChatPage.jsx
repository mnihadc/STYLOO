import React, { useEffect, useState } from "react";
import { FiSearch, FiMoreVertical, FiVideo, FiSend } from "react-icons/fi";
import { BsCheck2All, BsThreeDots, BsFilter } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user/get-users-chat");
      const usersWithMockData = res.data.map((user, idx) => ({
        ...user,
        id: user._id,
        avatar: `https://randomuser.me/api/portraits/${
          idx % 2 === 0 ? "men" : "women"
        }/${idx + 1}.jpg`,
        lastMessage: "Hello! Let's chat ✨",
        time: "Now",
        unread: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
        online: Math.random() > 0.5,
      }));

      setUsers(usersWithMockData);

      const dummyMessages = {};
      usersWithMockData.forEach((user) => {
        dummyMessages[user._id] = [
          {
            id: 1,
            sender: "them",
            text: `Hey ${user.username}, welcome to Styloo!`,
            time: "10:00 AM",
            read: true,
          },
        ];
      });
      setMessages(dummyMessages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;

    const newMsg = {
      id: messages[activeChat.id]?.length + 1 || 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    setNewMessage("");
  };

  const filteredChats = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Search */}
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

      {/* Active Chat */}
      {activeChat ? (
        <>
          {/* Chat Header */}
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
                  alt={activeChat.username}
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

          {/* Message Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900 bg-opacity-50">
            {messages[activeChat.id]?.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    msg.sender === "me" ? "bg-blue-600" : "bg-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs text-gray-300">{msg.time}</span>
                    {msg.sender === "me" && (
                      <BsCheck2All
                        className={`text-xs ${
                          msg.read ? "text-blue-300" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Message..."
                className="flex-1 bg-gray-800 rounded-full py-2 px-4 mx-2 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
        // Chat List View
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-3 hover:bg-gray-900 cursor-pointer border-b border-gray-800"
              onClick={() => setActiveChat(user)}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
                {user.unread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {user.unread}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{user.username}</h3>
                  <span className="text-xs text-gray-400">{user.time}</span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-400 truncate flex-1">
                    {user.lastMessage}
                  </p>
                  {user.unread > 0 && (
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
