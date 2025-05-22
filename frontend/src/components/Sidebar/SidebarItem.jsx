import { cloneElement } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/auth.service";

const SidebarItem = ({ item }) => {
  const { label, icon, path } = item;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path;

  const handleClick = async () => {
    if (label === "Đăng xuất") {
      try {
        authService.clearUserData();
        logout();
        window.location.href = "/";
      } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "/";
      }
    } else if (path) {
      navigate(path);
    }
  };

  const styledIcon =
    icon &&
    cloneElement(icon, {
      className: `${icon.props.className || ""} ${
        isActive ? "text-primary" : ""
      }`,
    });

  return (
    <li
      className={`flex items-center ml-4 text-lg cursor-pointer px-4 py-2 rounded-lg ${
        isActive ? "bg-primaryBlur" : ""
      }`}
      onClick={handleClick}
    >
      {styledIcon}
      <h5 className={`ml-3 ${isActive ? "text-primary" : ""}`}>{label}</h5>
    </li>
  );
};

export default SidebarItem;
