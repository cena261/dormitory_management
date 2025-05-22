import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/auth.service";
import DashboardLogo from "../assets/img/sv_logo_dashboard.png";
import SearchLogo from "../assets/icons/search-normal.png";
import Homepage from "../assets/icons/home-page.png";
import Notification from "../assets/icons/Bell.png";
import DownArrow from "../assets/icons/down-arrow.png";
import { useNavigate } from "react-router-dom";

function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (user?.username) {
        const info = await authService.getAdminInfo(user.username);
        setAdminInfo(info);
      }
    };
    fetchAdminInfo();
  }, [user]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white w-full h-[85px] flex justify-between items-center border-b border-b-lightgrey z-10">
      <img
        src={DashboardLogo}
        alt="Logo"
        className="w-44 object-contain ml-4 md:w-[250px] md:h-[54px] z-20"
      />
      <div className="relative hidden md:block">
        <input
          className="w-[430px] h-[44px] bg-lightgrey opacity-70 rounded-lg"
          type="text"
          placeholder="  Tìm kiếm"
        />
        <button className="cursor-pointer">
          <img
            className="absolute right-[20px] top-[50%] transform -translate-y-1/2"
            src={SearchLogo}
            alt="Search logo"
          />
        </button>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer flex"
      >
        <img src={Homepage} alt="Homepage logo" />
        <p className="hidden md:block md:ml-2.5">Trang chủ</p>
      </button>
      <button className="cursor-pointer flex">
        <img src={Notification} alt="Noti logo" />
        <p className="hidden md:block md:ml-2.5">Thông báo</p>
      </button>
      <div className="hidden mr-4 md:block md:flex md:gap-2 md:mr-12">
        <div className="">
          <h4 className="leading-none mb-1">
            {adminInfo?.hoTen || user?.username || "Admin User"}
          </h4>
          <h6 className="text-sm opacity-50 leading-none">
            {adminInfo?.email || user?.email || "admin@gmail.com"}
          </h6>
        </div>
        <button className="cursor-pointer px-1 py-1">
          <img src={DownArrow} alt="Arrow" />
        </button>
      </div>
      <div
        className="cursor-pointer text-2xl text-primary mr-4 md:hidden"
        onClick={onToggleSidebar}
      >
        <i className="bx bx-menu"></i>
      </div>
    </div>
  );
}

export default Header;
