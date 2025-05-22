import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLogo from "@/assets/img/sv_logo_dashboard.png";
import SearchLogo from "@/assets/icons/search-normal.png";
import Homepage from "@/assets/icons/home-page.png";
import Notification from "@/assets/icons/Bell.png";
import DownArrow from "@/assets/icons/down-arrow.png";
import PasswordChangeModal from "@/components/sv_components/ChangePassword";
import studentService from "@/services/student.service";

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await studentService.getStudentInfo();
        if (response.code === 0) {
          setStudentInfo(response.result);
        }
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    fetchStudentInfo();
  }, []);

  const handlePasswordChange = () => {
    setDropdownOpen(false);
    setPasswordModalOpen(true);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white w-full h-[85px] flex justify-between items-center border-b border-b-gray-200 px-4 z-10">
        <img
          src={DashboardLogo}
          alt="Logo"
          className="h-[54px] object-contain"
        />

        <div className="relative hidden md:block">
          <input
            className="w-[430px] h-[44px] bg-gray-100 opacity-70 rounded-lg pl-10"
            type="text"
            placeholder="Tìm kiếm"
          />
          <div className="absolute left-3 top-[50%] transform -translate-y-1/2 text-gray-500 w-5 h-5">
            <img src={SearchLogo} alt="Search" className="w-5 h-5" />
          </div>
        </div>

        <button
          onClick={() => navigate("/personal-info")}
          className="cursor-pointer flex items-center"
        >
          <img src={Homepage} alt="Home" className="w-5 h-5" />
          <p className="hidden md:block md:ml-2.5">Trang chủ</p>
        </button>

        <button
          onClick={() => navigate("/notifications")}
          className="cursor-pointer flex items-center"
        >
          <img src={Notification} alt="Bell" className="w-5 h-5" />
          <p className="hidden md:block md:ml-2.5">Thông báo</p>
        </button>

        <div className="mr-4 md:flex md:items-center md:gap-2 md:mr-12 relative">
          <div>
            <h4 className="leading-none">
              {studentInfo?.hoTen || "Loading..."}
            </h4>
            <h6 className="text-sm opacity-50 leading-none">
              {studentInfo?.email || "Loading..."}
            </h6>
          </div>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="cursor-pointer p-2"
          >
            <img src={DownArrow} alt="Dropdown" className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[60px] bg-white shadow-lg rounded-lg w-48 mt-2 z-50">
              <ul>
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handlePasswordChange}
                  >
                    Đổi mật khẩu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className=" w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}

export default Header;
