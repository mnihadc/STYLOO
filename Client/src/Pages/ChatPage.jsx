import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import Chat from "../Components/Chat.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  IoArrowBack,
  IoSearch,
  IoEllipsisVertical,
  IoSend,
  IoImage,
  IoHappy,
  IoChatbubble,
} from "react-icons/io5";
import { getSocket } from "../lib/socket.js";

const ChatPage = () => {
  const {
    users,
    messages,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    markAsRead,
  } = useChatStore();

  const { currentUser } = useAuthStore();
  const [text, setText] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    getUsers();
    const activeChat = localStorage.getItem("activeChat");
    if (activeChat) {
      const user = JSON.parse(activeChat);
      setSelectedUser(user);
      getMessages(user._id);
      setShowChatList(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (
        selectedUser &&
        (message.senderId === selectedUser._id ||
          message.receiverId === selectedUser._id)
      ) {
        useChatStore.getState().addMessage(message);
        // Mark as read if it's from selected user
        if (message.senderId === selectedUser._id) {
          markAsRead(message._id);
        }
      }
      useChatStore.getState().updateUserListWithNewMessage(message);
    };

    const handleUserTyping = (data) => {
      if (data.userId === selectedUser?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.userId === selectedUser?._id) {
        setIsTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser, markAsRead]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    getMessages(user._id);
    localStorage.setItem("activeChat", JSON.stringify(user));
    setShowChatList(false);
    // Mark all messages as read when opening chat
    if (useChatStore.getState().markAllAsRead) {
      useChatStore.getState().markAllAsRead(user._id);
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("stopTyping", { userId: selectedUser._id });
    }

    try {
      await sendMessage({ text });
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleBack = () => {
    setSelectedUser(null);
    setShowChatList(true);
    localStorage.removeItem("activeChat");
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    const socket = getSocket();
    if (socket && selectedUser) {
      if (e.target.value.trim()) {
        socket.emit("typing", { userId: selectedUser._id });
      } else {
        socket.emit("stopTyping", { userId: selectedUser._id });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Recently active";

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

    if (diffMinutes < 1) return "Online";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="w-full h-full bg-black text-white lg:ml-30">
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black">
        {/* Chat List */}
        <div
          className={`w-full lg:w-96 xl:w-[420px] border-r border-gray-800 flex flex-col transition-all duration-300 ${
            showChatList ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Messages
              </h1>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <IoEllipsisVertical size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <IoSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-2xl text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 group ${
                    selectedUser?._id === user._id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-r-2 border-blue-500"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/default-avatar.png"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white truncate">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {user.lastMessageTime &&
                          formatLastSeen(user.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 truncate">
                        {user.lastMessage || "Start a conversation"}
                      </span>
                      {user.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center flex-shrink-0">
                          {user.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat View */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            showChatList ? "hidden lg:flex" : "flex"
          }`}
        >
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <IoChatbubble size={40} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-gray-400 text-center max-w-sm">
                Send private messages to start a conversation.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <IoArrowBack size={20} />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedUser.profilePic || "/default-avatar.png"}
                      alt={selectedUser.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      {selectedUser.username}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {isTyping
                        ? "Typing..."
                        : selectedUser.isOnline
                        ? "Online"
                        : formatLastSeen(selectedUser.lastSeen)}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <IoEllipsisVertical size={20} />
                </button>
              </div>

              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-b from-gray-900 to-black">
                <div className="max-w-4xl mx-auto">
                  {messages && messages.length > 0 ? (
                    messages.map((msg) => <Chat key={msg._id} msg={msg} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm">Start a conversation!</p>
                    </div>
                  )}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-800 rounded-3xl rounded-bl-md px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 lg:p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                  <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition-all">
                    <IoImage size={22} />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition-all">
                    <IoHappy size={22} />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Message..."
                      value={text}
                      onChange={handleTyping}
                      onKeyDown={handleKeyPress}
                      className="w-full pl-4 pr-12 py-3 bg-gray-800 rounded-2xl text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-blue-500 transition-colors text-base"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!text.trim()}
                    className={`p-3 rounded-2xl transition-all ${
                      text.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <IoSend size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
