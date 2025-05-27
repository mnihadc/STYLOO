import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Chat = ({ msg }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser?._id) return null;

  const isMe = String(currentUser._id) === String(msg.senderId);

  return (
    <div
      className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`flex flex-col max-w-[75%] ${
          isMe ? "mr-2 items-end" : "ml-2 items-start"
        }`}
      >
        <div
          className={`relative p-3 text-sm rounded-2xl ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-800 text-white rounded-bl-none"
          }`}
        >
          {msg.text}

          <span
            className={`absolute bottom-0 ${
              isMe ? "-right-1" : "-left-1"
            } w-2.5 h-2.5 bg-inherit rotate-45 rounded-sm`}
          ></span>
        </div>

        <div
          className={`text-[11px] mt-1 flex items-center gap-1 ${
            isMe ? "text-blue-300" : "text-gray-400"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isMe && <FaCircleCheck size={12} />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
