import { create } from "zustand";

const useUserStore = create((set, get) => ({
  api: import.meta.env.VITE_API_URL,
  user: [],
  loading: false,

  setUser: (userData) => set({ user: userData }),

  clearUser: () => set({ user: null }),

  fetchUser: async () => {
    set({ loading: true });

    try {
      const { api } = get();

      const response = await fetch(`${api}users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      set({ user: data, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      const { api } = get();
      const response = await fetch(`${api}users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      set((state) => ({ user: state.user.filter((u) => u._id !== id) }));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

}));



export default useUserStore;
