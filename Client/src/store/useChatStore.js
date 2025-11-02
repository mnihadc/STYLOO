import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [], // Properly initialized
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      // Ensure we always set an array, even if response is malformed
      const users = Array.isArray(res?.data) ? res.data : [];
      set({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
      // Set empty array on error to prevent undefined
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) {
      console.error("No user ID provided for getMessages");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      const messages = Array.isArray(res?.data) ? res.data : [];
      set({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    if (!messageData?.text?.trim()) {
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
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Message send failed.");
    }
  },

  subscribeToMessages: () => {
    try {
      const socket = useAuthStore.getState().socket;
      if (!socket) {
        console.warn("Socket not available for subscription");
        return;
      }

      socket.on("newMessage", (newMessage) => {
        const { selectedUser, users } = get();

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

      // Handle socket errors
      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    } catch (error) {
      console.error("Error subscribing to messages:", error);
    }
  },

  addMessage: (msg) => {
    if (!msg) return;

    set((state) => ({
      messages: [...(state.messages || []), msg],
    }));
  },

  updateUserListWithNewMessage: (msg) => {
    if (!msg) return;

    set((state) => {
      const currentUsers = state.users || [];

      const updatedUsers = currentUsers.map((user) => {
        if (user?._id === msg.senderId) {
          return {
            ...user,
            lastMessage: msg.text,
            unread: (user.unread || 0) + 1,
          };
        }
        return user;
      });

      return { users: updatedUsers };
    });
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  // Utility function to clear store (optional)
  clearStore: () => {
    set({
      messages: [],
      users: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
    });
  },
}));
