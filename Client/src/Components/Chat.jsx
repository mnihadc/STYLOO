import React, { useState } from "react";
import { FiSearch, FiMoreVertical, FiVideo, FiSend } from "react-icons/fi";
import {
  BsCheck2All,
  BsEmojiSmile,
  BsCamera,
  BsThreeDots,
} from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

const Chat = () => {
  const [messages, setMessages] = useState([
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
      text: "That sounds interesting! What kind of projects?",
      time: "10:33 AM",
      read: true,
    },
    {
      id: 4,
      sender: "me",
      text: "Building a React app with a dark theme UI",
      time: "10:35 AM",
      read: true,
    },
    {
      id: 5,
      sender: "them",
      text: "Nice! Send me some screenshots when you can",
      time: "10:36 AM",
      read: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const activeChat = {
    username: "jane_doe",
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: true,
  };

  const recentChats = [
    {
      username: "john_smith",
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "See you tomorrow!",
      time: "2h ago",
      unread: 3,
    },
    {
      username: "alex_wong",
      name: "Alex Wong",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      lastMessage: "Thanks for the help",
      time: "5h ago",
      unread: 0,
    },
    {
      username: "sara_miller",
      name: "Sara Miller",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastMessage: "Did you see that post?",
      time: "1d ago",
      unread: 1,
    },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left sidebar - Chat list */}
      <div className="hidden md:block w-80 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">username</h1>
        </div>

        <div className="p-3 border-b border-gray-800">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-900 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-110px)]">
          {recentChats.map((chat, index) => (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-900 cursor-pointer border-b border-gray-800"
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
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
                <p className="text-sm text-gray-400 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Active chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <div className="flex items-center">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h2 className="font-semibold">{activeChat.username}</h2>
              <p className="text-xs text-green-500">
                {activeChat.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xl">
            <FiVideo className="cursor-pointer" />
            <FiMoreVertical className="cursor-pointer" />
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900 bg-opacity-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  message.sender === "me" ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs text-gray-300">{message.time}</span>
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
            <button className="p-2 text-xl">
              <BsEmojiSmile />
            </button>
            <button className="p-2 text-xl">
              <BsCamera />
            </button>
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 bg-gray-800 rounded-full py-2 px-4 mx-2 focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="p-2 text-xl text-blue-500" onClick={handleSend}>
              {newMessage.trim() ? <IoMdSend /> : <FiSend />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
