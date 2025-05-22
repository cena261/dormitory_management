import axios from "./axios.config";

const studentService = {
  getStudentInfo: async () => {
    try {
      const response = await axios.get("/api/students/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContractInfo: async () => {
    try {
      const response = await axios.get("/api/contracts/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomInfo: async () => {
    try {
      const response = await axios.get("/api/rooms/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomStudents: async (maPhong) => {
    try {
      const response = await axios.get(`/api/rooms/${maPhong}/students`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInvoices: async () => {
    try {
      const response = await axios.get("/api/invoices/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createRepairRequest: async (data) => {
    try {
      const response = await axios.post("/api/repair-requests", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNotifications: async () => {
    try {
      const response = await axios.get("/api/notifications/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      const response = await axios.put(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyPassword: async (username, password) => {
    try {
      const response = await axios.post("/api/auth/token", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === "Unauthenticated") {
          throw new Error("Mật khẩu hiện tại không đúng");
        }
        throw new Error(error.response.data.message || "Mật khẩu không đúng");
      } else if (error.request) {
        throw new Error("Không thể kết nối đến máy chủ");
      } else {
        throw new Error("Có lỗi xảy ra khi xác thực mật khẩu");
      }
    }
  },

  changePassword: async (username, newPassword) => {
    try {
      const response = await axios.put(`/api/student-accounts/${username}`, {
        taiKhoan: username,
        matKhau: newPassword,
        maSV: username,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error("Bạn không có quyền thay đổi mật khẩu");
        }
        throw new Error(
          error.response.data.message || "Không thể thay đổi mật khẩu"
        );
      } else if (error.request) {
        throw new Error("Không thể kết nối đến máy chủ");
      } else {
        throw new Error("Có lỗi xảy ra khi thay đổi mật khẩu");
      }
    }
  },
};

export default studentService;
