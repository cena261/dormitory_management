import axios from "axios";

const API_URL = "https://dormitory-management-backend.onrender.com/api";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.access_token
    ? { Authorization: `Bearer ${user.access_token}` }
    : {};
};

export const notificationService = {
  getAllNotifications: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: getAuthHeader(),
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/me`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications`,
        notificationData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
