import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Chat = ({ msg }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser?._id) return null;

  const isMe = String(currentUser._id) === String(msg.senderId);

  return (
    <div
      className={`flex w-full ${
        isMe ? "justify-end" : "justify-start"
      } mb-2 lg:mb-3`}
    >
      <div
        className={`flex flex-col max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[55%] ${
          isMe ? "mr-2 lg:mr-3 items-end" : "ml-2 lg:ml-3 items-start"
        }`}
      >
        {/* Message Bubble */}
        <div
          className={`relative p-3 text-sm lg:text-base rounded-2xl transition-all duration-200 ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none hover:bg-blue-600 shadow-lg shadow-blue-500/20"
              : "bg-gray-800 text-white rounded-bl-none hover:bg-gray-700 shadow-lg shadow-gray-900/20"
          }`}
        >
          {msg.text}

          {/* Message Tail */}
          <span
            className={`absolute bottom-0 w-2.5 h-2.5 bg-inherit rotate-45 rounded-sm ${
              isMe ? "-right-1" : "-left-1"
            }`}
          ></span>
        </div>

        {/* Timestamp and Status */}
        <div
          className={`text-[11px] lg:text-xs mt-1 flex items-center gap-1 transition-colors duration-200 ${
            isMe
              ? "text-blue-300 hover:text-blue-200"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <span className="font-medium">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && (
            <FaCircleCheck
              size={12}
              className="lg:w-3 lg:h-3 flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
