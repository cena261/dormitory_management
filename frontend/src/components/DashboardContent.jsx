"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Home,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  PenTool as Tool,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/DashboardContent.css";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [studentCount, setStudentCount] = useState(0);
  const [roomOccupancy, setRoomOccupancy] = useState(0);
  const [pendingRepairCount, setPendingRepairCount] = useState(0);
  const [contractRoomMap, setContractRoomMap] = useState({});
  const [roomStats, setRoomStats] = useState({
    P2: { current: 0, max: 0, percentage: 0 },
    P4: { current: 0, max: 0, percentage: 0 },
    P6: { current: 0, max: 0, percentage: 0 },
    P8: { current: 0, max: 0, percentage: 0 },
    P12: { current: 0, max: 0, percentage: 0 },
    P16: { current: 0, max: 0, percentage: 0 },
  });
  const [allRooms, setAllRooms] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [showPaymentsOverlay, setShowPaymentsOverlay] = useState(false);
  const [repairRequests, setRepairRequests] = useState([]);
  const [showRepairOverlay, setShowRepairOverlay] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated || !user) {
          return;
        }

        const token = user.access_token;

        if (!token) {
          return;
        }

        const studentsResponse = await fetch(
          "http://localhost:8080/api/student-accounts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          if (studentsData.code === 0 && studentsData.result) {
            setStudentCount(studentsData.result.length);
          }
        }

        const roomsResponse = await fetch("http://localhost:8080/api/rooms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          if (roomsData.code === 0 && roomsData.result) {
            setAllRooms(roomsData.result);
            calculateRoomStats(roomsData.result);
          }
        }

        const fetchRepairRequests = async (status) => {
          const response = await fetch(
            `http://localhost:8080/api/repair-requests/paged?page=0&size=20&trangThai=${status}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.code === 0 && data.result) {
              return data.result.content || [];
            }
          }
          return [];
        };

        const pendingRequests = await fetchRepairRequests("DangCho");
        const inProgressRequests = await fetchRepairRequests("DangXuLy");

        const allRequests = [...pendingRequests, ...inProgressRequests];
        setRepairRequests(allRequests);
        setPendingRepairCount(allRequests.length);

        const fetchPayments = async () => {
          const response = await fetch(
            `http://localhost:8080/api/invoices?page=0&size=20&trangThai=ChuaThanhToan`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.code === 0 && data.result) {
              return data.result.content || [];
            }
          }
          return [];
        };

        const unpaidPayments = await fetchPayments();

        const today = new Date();
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);

        const upcoming = unpaidPayments.filter((payment) => {
          const dueDate = new Date(payment.hanThanhToan);
          return dueDate >= today && dueDate <= sevenDaysLater;
        });

        setUpcomingPayments(upcoming);

        setIsLoadingContracts(true);
        try {
          const contractsResponse = await fetch(
            "http://localhost:8080/api/contracts",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (contractsResponse.ok) {
            const contractsData = await contractsResponse.json();
            if (
              contractsData.code === 0 &&
              contractsData.result &&
              contractsData.result.content
            ) {
              const contractToRoomMapping = {};
              contractsData.result.content.forEach((contract) => {
                contractToRoomMapping[contract.maHopDong] = contract.maPhong;
              });
              setContractRoomMap(contractToRoomMapping);
            }
          } else {
            console.error(
              "Failed to fetch contracts:",
              contractsResponse.status
            );
          }
        } catch (error) {
          console.error("Error fetching contracts:", error);
        } finally {
          setIsLoadingContracts(false);
        }
      } catch (error) {
        setStudentCount(0);
        setRoomOccupancy(0);
        setPendingRepairCount(0);
        setRoomStats({
          P2: { current: 0, max: 0, percentage: 0 },
          P4: { current: 0, max: 0, percentage: 0 },
          P6: { current: 0, max: 0, percentage: 0 },
          P8: { current: 0, max: 0, percentage: 0 },
          P12: { current: 0, max: 0, percentage: 0 },
          P16: { current: 0, max: 0, percentage: 0 },
        });
        setAllRooms([]);
        setUpcomingPayments([]);
        setRepairRequests([]);
      }
    };

    if (isAuthenticated && user) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const calculateRoomStats = (rooms) => {
    const stats = {
      P2: { current: 0, max: 0, percentage: 0 },
      P4: { current: 0, max: 0, percentage: 0 },
      P6: { current: 0, max: 0, percentage: 0 },
      P8: { current: 0, max: 0, percentage: 0 },
      P12: { current: 0, max: 0, percentage: 0 },
      P16: { current: 0, max: 0, percentage: 0 },
    };

    let totalCurrentOccupants = 0;
    let totalMaxOccupants = 0;

    rooms.forEach((room) => {
      const roomType = room.maLoaiPhong;
      if (stats[roomType]) {
        stats[roomType].current += room.soNguoiHienTai;
        stats[roomType].max += parseInt(roomType.substring(1));
      }
      totalCurrentOccupants += room.soNguoiHienTai;
      const maxOccupants = parseInt(room.maLoaiPhong.substring(1));
      totalMaxOccupants += maxOccupants;
    });

    Object.keys(stats).forEach((key) => {
      if (stats[key].max > 0) {
        stats[key].percentage = Math.round(
          (stats[key].current * 100) / stats[key].max
        );
      }
    });

    setRoomStats(stats);
    const occupancyPercentage = Math.round(
      (totalCurrentOccupants * 100) / totalMaxOccupants
    );
    setRoomOccupancy(parseFloat(occupancyPercentage));
  };

  const getFilteredRoomStats = () => {
    if (activeTab === "all") {
      return roomStats;
    }

    const areaCode = activeTab === "toaA" ? "A" : "B";
    const filteredRooms = allRooms.filter((room) => room.maKhu === areaCode);

    const filteredStats = {
      P2: { current: 0, max: 0, percentage: 0 },
      P4: { current: 0, max: 0, percentage: 0 },
      P6: { current: 0, max: 0, percentage: 0 },
      P8: { current: 0, max: 0, percentage: 0 },
      P12: { current: 0, max: 0, percentage: 0 },
      P16: { current: 0, max: 0, percentage: 0 },
    };

    filteredRooms.forEach((room) => {
      const roomType = room.maLoaiPhong;
      if (filteredStats[roomType]) {
        filteredStats[roomType].current += room.soNguoiHienTai;
        filteredStats[roomType].max += parseInt(roomType.substring(1));
      }
    });

    Object.keys(filteredStats).forEach((key) => {
      if (filteredStats[key].max > 0) {
        filteredStats[key].percentage = Math.round(
          (filteredStats[key].current * 100) / filteredStats[key].max
        );
      }
    });

    return filteredStats;
  };

  const currentStats = getFilteredRoomStats();

  // Add debug logs
  // useEffect(() => {
  //   console.log("Active Tab:", activeTab);
  //   console.log("All Rooms:", allRooms);
  //   console.log("Current Stats:", currentStats);
  // }, [activeTab, allRooms, currentStats]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "bg-red-100 text-red-600";
      case "TrungBinh":
        return "bg-yellow-100 text-yellow-600";
      case "Thap":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "Cao":
        return "Khẩn cấp";
      case "TrungBinh":
        return "Trung bình";
      case "Thap":
        return "Thấp";
      default:
        return priority;
    }
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Students Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-500">Tổng số sinh viên</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{studentCount}</h2>
          <p className="text-sm text-gray-500">đang thuê</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
              +1.5%
            </span>
            <span className="text-xs text-gray-500 ml-1">
              so với tháng trước
            </span>
          </div>
        </div>

        {/* Room Occupancy Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-500">Số phòng đã thuê</h3>
            <div className="p-2 bg-indigo-50 rounded-full">
              <Home className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{roomOccupancy}%</h2>
          <p className="text-sm text-gray-500">trên tổng số phòng</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
              +2.1%
            </span>
            <span className="text-xs text-gray-500 ml-1">
              so với tháng trước
            </span>
          </div>
        </div>

        {/* Maintenance Requests Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-500">Yêu cầu bảo trì</h3>
            <div className="p-2 bg-yellow-50 rounded-full">
              <Tool className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{pendingRepairCount}</h2>
          <p className="text-sm text-gray-500">Yêu cầu chưa được duyệt</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
              +8.3%
            </span>
            <span className="text-xs text-gray-500 ml-1">
              so với tháng trước
            </span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-500">Doanh thu quý</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">$128,450</h2>
          <p className="text-sm text-gray-500">từ tất cả các nguồn</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
              +12.5%
            </span>
            <span className="text-xs text-gray-500 ml-1">so với quý trước</span>
          </div>
        </div>
      </div>

      {/* Room Status and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Room Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Tình trạng phòng</h2>
            <div className="text-sm text-gray-500">
              Số phòng đã cho thuê các tòa
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "all"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "toaA"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("toaA")}
            >
              Tòa A
            </button>
            <button
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "toaB"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("toaB")}
            >
              Tòa B
            </button>
          </div>

          {/* Room Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng đôi</span>
                <span className="text-sm font-medium">
                  {currentStats.P2.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P2.current}/{currentStats.P2.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P2.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng 4</span>
                <span className="text-sm font-medium">
                  {currentStats.P4.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P4.current}/{currentStats.P4.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P4.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng 6</span>
                <span className="text-sm font-medium">
                  {currentStats.P6.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P6.current}/{currentStats.P6.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P6.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng 8</span>
                <span className="text-sm font-medium">
                  {currentStats.P8.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P8.current}/{currentStats.P8.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P8.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng 12</span>
                <span className="text-sm font-medium">
                  {currentStats.P12.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P12.current}/{currentStats.P12.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P12.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phòng 16</span>
                <span className="text-sm font-medium">
                  {currentStats.P16.percentage}%{" "}
                  <span className="text-xs text-gray-500">
                    {currentStats.P16.current}/{currentStats.P16.max}
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentStats.P16.percentage}%`,
                    transform: "translateX(0)",
                    animation: "slideIn 1s ease-out",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="text-sm">Tình trạng tòa</div>
            <button className="text-sm text-primary">Xem chi tiết</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Home className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Tòa A</div>
                <div className="text-xs text-gray-500">95% đã thuê</div>
              </div>
            </div>

            <div className="border rounded-lg p-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Home className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Tòa B</div>
                <div className="text-xs text-gray-500">88% đã thuê</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Hoạt động gần đây</h2>
            <div className="text-sm text-gray-500">
              Thông tin về các thay đổi gần đây
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Người thuê mới</div>
                <div className="text-xs text-gray-600">
                  +1 người phòng B4.304
                </div>
                <div className="text-xs text-gray-500">3 tiếng trước</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Tool className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Yêu cầu bảo trì</div>
                <div className="text-xs text-gray-600">
                  Vấn đề về điện nước phòng B2.202
                </div>
                <div className="text-xs text-gray-500">3 tiếng trước</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Thanh toán tiền phòng</div>
                <div className="text-xs text-gray-600">
                  Nhận tiền phòng quý 1 tòa 305
                </div>
                <div className="text-xs text-gray-500">5 tiếng trước</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Báo trì hoàn tất</div>
                <div className="text-xs text-gray-600">
                  Sửa máy lạnh phòng A17.509
                </div>
                <div className="text-xs text-gray-500">Hôm qua</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Home className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Đổi phòng</div>
                <div className="text-xs text-gray-600">
                  1 người từ B4.205 sang A1.109
                </div>
                <div className="text-xs text-gray-500">Hôm qua</div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 text-sm text-primary py-2 border border-gray-200 rounded-lg">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>

      {/* Upcoming Payments and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Tiền phòng sắp tới</h2>
            <div className="text-sm text-gray-500">
              Tiền phòng sắp đến hạn trong 7 ngày tới
            </div>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.slice(0, 3).map((payment) => (
                <div
                  key={payment.maHoaDon}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Phòng{" "}
                        {isLoadingContracts
                          ? "Đang tải..."
                          : contractRoomMap[payment.maHopDong] ||
                            "Đang cập nhật"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Đến hạn:{" "}
                        {new Date(payment.hanThanhToan).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatNumber(payment.soTien)} VNĐ
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                Không có phòng nào sắp đến hạn trả tiền phòng trong 7 ngày tới
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPaymentsOverlay(true)}
            className="w-full mt-4 text-sm text-primary py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Yêu cầu bảo trì</h2>
            <div className="text-sm text-gray-500">Yêu cầu bảo trì gần đây</div>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {repairRequests.length > 0 ? (
              repairRequests.slice(0, 3).map((request) => (
                <div
                  key={request.maYeuCau}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <Tool className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {request.noiDung}
                      </div>
                      <div className="text-xs text-gray-500">
                        Phòng {request.maPhong}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      request.mucDoUuTien
                    )}`}
                  >
                    {getPriorityText(request.mucDoUuTien)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                Không có yêu cầu bảo trì nào đang chờ xử lý
              </div>
            )}
          </div>

          <button
            onClick={() => setShowRepairOverlay(true)}
            className="w-full mt-4 text-sm text-primary py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Payments Overlay */}
      {showPaymentsOverlay && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300 ease-in-out overlay-enter"
          onClick={() => setShowPaymentsOverlay(false)}
        >
          <div
            className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[80vh] flex flex-col shadow-xl transform transition-all duration-300 ease-in-out scale-100 modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Danh sách tiền phòng sắp đến hạn
              </h2>
              <button
                onClick={() => setShowPaymentsOverlay(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {upcomingPayments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div
                      key={payment.maHoaDon}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            Phòng{" "}
                            {isLoadingContracts
                              ? "Đang tải..."
                              : contractRoomMap[payment.maHopDong] ||
                                "Đang cập nhật"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Đến hạn:{" "}
                            {new Date(
                              payment.hanThanhToan
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatNumber(payment.soTien)} VNĐ
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Không có phòng nào sắp đến hạn trả tiền phòng trong 7 ngày tới
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Repair Requests Overlay */}
      {showRepairOverlay && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300 ease-in-out overlay-enter"
          onClick={() => setShowRepairOverlay(false)}
        >
          <div
            className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[80vh] flex flex-col shadow-xl transform transition-all duration-300 ease-in-out scale-100 modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Danh sách yêu cầu bảo trì</h2>
              <button
                onClick={() => setShowRepairOverlay(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {repairRequests.length > 0 ? (
                <div className="space-y-3">
                  {repairRequests.map((request) => (
                    <div
                      key={request.maYeuCau}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <Tool className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {request.noiDung}
                          </div>
                          <div className="text-xs text-gray-500">
                            Phòng {request.maPhong}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          request.mucDoUuTien
                        )}`}
                      >
                        {getPriorityText(request.mucDoUuTien)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Không có yêu cầu bảo trì nào đang chờ xử lý
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardContent;
