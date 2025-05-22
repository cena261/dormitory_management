import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarData = [
  { title: "Thông tin cá nhân", path: "/personal-info", items: [] },
  { title: "Thông tin phòng", path: "/room-info", items: [] },
  {
    title: "Hóa đơn",
    items: [{ name: "Tra cứu thông tin hóa đơn", path: "/bill" }],
  },
  {
    title: "Hỗ trợ và yêu cầu",
    items: [
      { name: "Gửi yêu cầu đến quản lý", path: "/report" },
      { name: "Hỗ trợ khẩn cấp", path: "/emergency-support" },
    ],
  },
  {
    title: "Khác",
    items: [
      { name: "Quy định ký túc xá", path: "/rules" },
      { name: "Thông báo", path: "/notifications" },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let found = false;
    sidebarData.forEach((section, sectionIdx) => {
      if (section.path === location.pathname) {
        setActiveItem(`section-${sectionIdx}`);
        found = true;
      }
      section.items.forEach((item, itemIdx) => {
        if (item.path === location.pathname) {
          setActiveItem(`item-${sectionIdx}-${itemIdx}`);
          found = true;
        }
      });
    });
    if (!found) {
      setActiveItem(null);
    }
  }, [location.pathname]);

  const handleItemClick = (path, sectionIdx, itemIdx) => {
    setActiveItem(`item-${sectionIdx}-${itemIdx}`);
    navigate(path);
  };

  const handleSectionClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="sidebar flex pt-[85px] w-[300px] h-auto min-h-screen">
      <div className="w-full">
        <ul className="list-disc pl-10 pt-5 pb-5 border-b border-r border-gray-300">
          {sidebarData.slice(0, 2).map((section, idx) => (
            <li
              key={idx}
              className={`cursor-pointer hover:text-blue-600 ${
                activeItem === `section-${idx}` ? "text-blue-600" : ""
              }`}
              onClick={() => handleSectionClick(section.path || "/")}
            >
              {section.title}
            </li>
          ))}
        </ul>

        <div className="p-2 border-r border-gray-300 h-full">
          <ul className="list-none pl-1">
            {sidebarData.slice(2).map((section, idx) => {
              const sectionIdx = 2 + idx;
              return (
                <li
                  key={sectionIdx}
                  className="pt-5 text-gray-400 font-medium text-sm"
                >
                  {section.title}
                  <ul className="list-none pt-5 text-black">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className={`px-4 py-2 rounded-xl mt-1 hover:bg-[#2F80ED] hover:text-white cursor-pointer ${
                          activeItem === `item-${sectionIdx}-${itemIdx}`
                            ? "bg-[#2F80ED] text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleItemClick(item.path, sectionIdx, itemIdx)
                        }
                      >
                        <button className="cursor-pointer w-full text-left">
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
