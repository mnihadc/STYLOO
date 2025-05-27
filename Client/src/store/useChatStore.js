import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!messageData?.text) {
      console.error("No text sent!");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Message send failed.");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const selectedUser = get().selectedUser;

      // Add to messages if it's from or to the selected chat user
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        get().addMessage(newMessage);
      }

      // Update chat list preview and unread count
      get().updateUserListWithNewMessage(newMessage);
    });
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updateUserListWithNewMessage: (msg) =>
    set((state) => {
      const updatedUsers = state.users.map((user) => {
        if (user._id === msg.senderId) {
          return {
            ...user,
            lastMessage: msg.text,
            unread: (user.unread || 0) + 1,
          };
        }
        return user;
      });

      return { users: updatedUsers };
    }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
