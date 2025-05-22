import { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import DashboardLogo from "../../assets/img/sv_logo_dashboard.png";

function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định */}
      <Header onToggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="flex flex-grow pt-[85px]">
        {/* Sidebar cho mobile */}
        <div
          className={`fixed top-0 left-0 z-50 bg-white w-[250px] h-full transform transition-transform duration-300 md:hidden ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <img
            src={DashboardLogo}
            alt="Logo"
            className="w-44 object-contain ml-4 mt-6 z-20"
          />
          <Sidebar />
        </div>

        {/* Sidebar cố định cho desktop */}
        <div className="hidden md:block fixed left-0 top-[85px] w-[250px] h-[calc(100vh-85px)] bg-white z-10 overflow-y-visible">
          <Sidebar />
        </div>

        {/* Nội dung chính */}
        <div className="w-full md:ml-[250px] p-2">{children}</div>
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
    </div>
  );
}

export default DashboardLayout;
