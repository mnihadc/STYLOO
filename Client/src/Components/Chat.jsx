import React from "react";
import { FaCircleCheck, FaCircle } from "react-icons/fa6";
import { IoCheckmarkDone } from "react-icons/io5";
import { useSelector } from "react-redux";

const Chat = ({ msg }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser?._id) return null;

  const isMe = String(currentUser._id) === String(msg.senderId);
  const isRead = msg.status === "read";
  const isDelivered = msg.status === "delivered";

  return (
    <div
      className={`flex w-full ${
        isMe ? "justify-end" : "justify-start"
      } mb-3 lg:mb-4 group`}
    >
      <div
        className={`flex flex-col max-w-[85%] lg:max-w-[70%] xl:max-w-[65%] 2xl:max-w-[60%] ${
          isMe ? "mr-2 lg:mr-3 items-end" : "ml-2 lg:ml-20 items-start"
        }`}
      >
        {/* Message Bubble */}
        <div
          className={`relative p-4 text-sm lg:text-base rounded-3xl transition-all duration-300 ${
            isMe
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              : "bg-gray-800 text-white rounded-bl-md hover:bg-gray-750 shadow-lg shadow-gray-900/30"
          } group-hover:scale-[1.02] transform transition-transform`}
        >
          {msg.text}

          {/* Message Tail */}
          <span
            className={`absolute bottom-0 w-3 h-3 bg-inherit rotate-45 rounded-sm ${
              isMe ? "-right-1" : "-left-1"
            }`}
          ></span>
        </div>

        {/* Timestamp and Status */}
        <div
          className={`text-xs lg:text-sm mt-2 flex items-center gap-1.5 transition-colors duration-200 ${
            isMe
              ? "text-blue-300 hover:text-blue-200"
              : "text-gray-500 hover:text-gray-400"
          }`}
        >
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && (
            <div className="flex items-center gap-0.5">
              {isRead ? (
                <IoCheckmarkDone size={16} className="text-blue-400" />
              ) : isDelivered ? (
                <IoCheckmarkDone size={16} className="text-gray-400" />
              ) : (
                <FaCircleCheck size={12} className="text-gray-500" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
