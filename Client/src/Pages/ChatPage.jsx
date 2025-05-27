import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import Chat from "../Components/Chat.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { IoArrowBack } from "react-icons/io5";
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
  } = useChatStore();

  const { currentUser } = useAuthStore();
  const [text, setText] = useState("");
  const [showChatList, setShowChatList] = useState(true); // for mobile
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getUsers();
    const activeChat = localStorage.getItem("activeChat");
    if (activeChat) {
      const user = JSON.parse(activeChat);
      setSelectedUser(user);
      getMessages(user._id);
      setShowChatList(false); // auto switch to chat view on mobile
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (
        selectedUser &&
        (message.senderId === selectedUser._id ||
          message.receiverId === selectedUser._id)
      ) {
        useChatStore.getState().addMessage(message);
      }
      useChatStore.getState().updateUserListWithNewMessage(message);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    getMessages(user._id);
    localStorage.setItem("activeChat", JSON.stringify(user));
    setShowChatList(false);
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;
    await sendMessage({ text });
    setText("");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setShowChatList(true);
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-[calc(100vh-56px)] bg-black text-white">
      {/* Chat List */}
      <div
        className={`w-full md:w-[30%] border-r border-gray-800 overflow-y-auto ${
          showChatList ? "block" : "hidden md:block"
        }`}
      >
        {users.map((user) => (
          <div
            key={user._id}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-900 ${
              selectedUser?._id === user._id ? "bg-gray-900" : ""
            }`}
            onClick={() => handleUserClick(user)}
          >
            <img
              src={user.profilePic}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col flex-1">
              <span className="font-semibold">{user.username}</span>
              <span className="text-sm text-gray-400 truncate">
                {user.lastMessage || "No messages yet."}
              </span>
            </div>
            {user.unread > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2">
                {user.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat View */}
      <div
        className={`w-full md:w-[70%] flex flex-col relative pb-16 ${
          showChatList ? "hidden md:flex" : "flex"
        }`}
      >
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-black">
              {/* Back button for mobile */}
              <button onClick={handleBack} className="md:hidden text-white">
                <IoArrowBack size={24} />
              </button>
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">{selectedUser.username}</h2>
                <p className="text-sm text-gray-400">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
              {(messages || []).map((msg) => (
                <Chat key={msg._id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 flex items-center gap-3 border-t border-gray-800 bg-black">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-2 rounded-xl bg-gray-900 text-white placeholder-gray-500 outline-none border border-gray-700"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
