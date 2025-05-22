import axios from "./axios.config";

if (window.location.search.includes("clear=true")) {
  localStorage.clear();
  sessionStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
  window.history.replaceState({}, document.title, window.location.pathname);
}

const authService = {
  clearUserData: () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    localStorage.clear();
    sessionStorage.clear();
  },

  login: async (username, password) => {
    try {
      authService.clearUserData();

      const response = await axios.post("/api/auth/token", {
        username,
        password,
      });

      if (response.data.code === 0 && response.data.result.authenticated) {
        const token = response.data.result.token;
        const role = response.data.result.role;
        const userData = {
          access_token: token,
          username,
          role,
          isAdmin: role === "QuanTriVien",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      throw new Error("Authentication failed");
    } catch (error) {
      authService.clearUserData();
      throw error;
    }
  },

  logout: () => {
    try {
      authService.clearUserData();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      authService.clearUserData();
      return null;
    }
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user?.access_token;
  },

  getAdminInfo: async (username) => {
    try {
      const res = await axios.get("/api/admin-accounts");
      if (res.data && Array.isArray(res.data.result)) {
        return res.data.result.find((acc) => acc.taiKhoan === username);
      }
      return null;
    } catch (error) {
      console.error("Error fetching admin info:", error);
      return null;
    }
  },
};

export default authService;
