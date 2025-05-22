"use client";

import { useState, useEffect } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  UserPlus,
  UserMinus,
  X,
  Check,
  Building,
  Bed,
  Home,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function RoomManager() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBuilding, setFilterBuilding] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showManageStudentsModal, setShowManageStudentsModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const buildings = ["Tòa A", "Tòa B"];

  const [rooms, setRooms] = useState([]);

  const [studentsInRoom, setStudentsInRoom] = useState([]);

  const [availableStudents, setAvailableStudents] = useState([]);

  const [roomForm, setRoomForm] = useState({
    maPhong: "",
    maKhu: "A",
    maLoaiPhong: "P4",
    giaPhong: 1000000,
    trangThai: "Trong",
    moTa: "",
    dienTich: 25.0,
    tang: 1,
    soNguoiHienTai: 0,
  });

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCapacityFromRoomType = (maLoaiPhong) => {
    const match = maLoaiPhong.match(/P(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getBuildingName = (maKhu) => {
    return `Tòa ${maKhu}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case "Trong":
        return "bg-green-100 text-green-800";
      case "DangO":
        return "bg-blue-100 text-blue-800";
      case "Day":
        return "bg-yellow-100 text-yellow-800";
      case "BaoTri":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 0 && data.result) {
        setRooms(data.result);
      } else {
        throw new Error(data.message || "Failed to fetch rooms");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsInRoom = async (maPhong) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/rooms/${maPhong}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students in room");
      }

      const data = await response.json();
      if (data.code === 0 && data.result) {
        setStudentsInRoom(data.result);
      }
    } catch (err) {
      console.error("Error fetching students in room:", err);
      setShowErrorNotification(true);
      setNotificationMessage("Không thể tải danh sách sinh viên trong phòng");
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        "http://localhost:8080/api/student-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available students");
      }

      const data = await response.json();
      if (data.code === 0 && data.result) {
        const studentsWithoutRoom = data.result.filter(
          (student) => !student.maPhong
        );
        setAvailableStudents(studentsWithoutRoom);
      }
    } catch (err) {
      console.error("Error fetching available students:", err);
      setShowErrorNotification(true);
      setNotificationMessage("Không thể tải danh sách sinh viên có thể thêm");
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const sortedRooms = [...rooms];
  if (sortConfig.key) {
    sortedRooms.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const filteredRooms = sortedRooms.filter((room) => {
    const matchesSearch = room.maPhong
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || room.trangThai === filterStatus;

    const matchesBuilding =
      filterBuilding === "all" ||
      getBuildingName(room.maKhu) === filterBuilding;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const filteredAvailableStudents = availableStudents.filter(
    (student) =>
      student.hoTen.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.maSV.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const filteredStudentsInRoom = studentsInRoom.filter(
    (student) =>
      student.hoTen.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.maSV.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleAddRoom = () => {
    setRoomForm({
      maPhong: "",
      maKhu: "A",
      maLoaiPhong: "P4",
      giaPhong: 1000000,
      trangThai: "Trong",
      moTa: "",
      dienTich: 25.0,
      tang: 1,
      soNguoiHienTai: 0,
    });
    setShowAddRoomModal(true);
  };

  const handleMaPhongChange = (e) => {
    const maPhong = e.target.value;
    const tang = maPhong.length >= 2 ? parseInt(maPhong[1]) : 1;
    setRoomForm((prev) => ({
      ...prev,
      maPhong,
      tang,
    }));
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      if (!token) {
        throw new Error("No token found");
      }

      if (roomForm.id) {
        const currentRoom = rooms.find(
          (room) => room.maPhong === roomForm.maPhong
        );
        if (currentRoom) {
          const newCapacity = getCapacityFromRoomType(roomForm.maLoaiPhong);
          if (currentRoom.soNguoiHienTai > newCapacity) {
            throw new Error(
              `Không thể thay đổi loại phòng vì phòng đang có ${currentRoom.soNguoiHienTai} sinh viên. Loại phòng mới chỉ chứa được ${newCapacity} sinh viên.`
            );
          }
        }
      }

      const method = roomForm.id ? "PUT" : "POST";
      const url = roomForm.id
        ? `http://localhost:8080/api/rooms/${roomForm.maPhong}`
        : "http://localhost:8080/api/rooms";

      const roomData = {
        maPhong: roomForm.maPhong,
        tang: roomForm.tang,
        soNguoiHienTai: roomForm.id ? roomForm.soNguoiHienTai : 0,
        trangThai: roomForm.trangThai,
        giaPhong: roomForm.giaPhong,
        dienTich: roomForm.dienTich,
        moTa: roomForm.moTa,
        maLoaiPhong: roomForm.maLoaiPhong,
        maKhu: roomForm.maKhu,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save room");
      }

      const data = await response.json();
      if (data.code === 0) {
        await fetchRooms();
        setShowAddRoomModal(false);
        setShowSuccessNotification(true);
        setNotificationMessage(
          roomForm.id
            ? "Cập nhật phòng thành công!"
            : "Thêm phòng mới thành công!"
        );
        setTimeout(() => {
          setShowSuccessNotification(false);
          setNotificationMessage("");
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to save room");
      }
    } catch (err) {
      console.error("Error saving room:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message ||
          (roomForm.id
            ? "Không thể cập nhật phòng. Vui lòng thử lại sau."
            : "Không thể thêm phòng mới. Vui lòng thử lại sau.")
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const handleDeleteRoom = (room) => {
    setDeletingRoom(room);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;

    try {
      if (deletingRoom.soNguoiHienTai > 0) {
        throw new Error("Không thể xóa phòng đang có sinh viên ở");
      }

      setIsDeleting(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/rooms/${deletingRoom.maPhong}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }

      await fetchRooms();

      setShowDeleteConfirm(false);
      setDeletingRoom(null);

      setShowSuccessNotification(true);
      setNotificationMessage("Xóa phòng thành công!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting room:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message || "Không thể xóa phòng. Vui lòng thử lại sau."
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateRoomStatusAutomatically = (room) => {
    const capacity = getCapacityFromRoomType(room.maLoaiPhong);
    let newStatus = room.trangThai;

    if (room.soNguoiHienTai === 0) {
      newStatus = "Trong";
    } else if (room.soNguoiHienTai === capacity) {
      newStatus = "Day";
    } else if (room.soNguoiHienTai > 0 && room.soNguoiHienTai < capacity) {
      newStatus = "DangO";
    }

    if (newStatus !== room.trangThai) {
      handleUpdateRoomStatus(room.maPhong, newStatus);
    }
  };

  useEffect(() => {
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        updateRoomStatusAutomatically(room);
      });
    }
  }, [rooms]);

  const handleUpdateRoomStatus = async (maPhong, newStatus) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/rooms/${maPhong}/status?trangThai=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }

      await fetchRooms();

      setShowSuccessNotification(true);
      setNotificationMessage("Cập nhật trạng thái phòng thành công!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating room status:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message || "Không thể cập nhật trạng thái phòng"
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const handleEditRoom = (room) => {
    setRoomForm({
      ...room,
      id: room.maPhong,
    });
    setShowAddRoomModal(true);
  };

  const handleAddStudentToRoom = async (student) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      if (
        currentRoom.soNguoiHienTai >=
        getCapacityFromRoomType(currentRoom.maLoaiPhong)
      ) {
        throw new Error("Phòng đã đầy");
      }

      if (currentRoom.trangThai === "BaoTri") {
        throw new Error("Phòng đang trong trạng thái bảo trì");
      }

      const response = await fetch(
        `http://localhost:8080/api/rooms/${currentRoom.maPhong}/add-student/${student.maSV}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }

      await fetchStudentsInRoom(currentRoom.maPhong);
      await fetchAvailableStudents();
      await fetchRooms();

      setShowSuccessNotification(true);
      setNotificationMessage("Thêm sinh viên vào phòng thành công!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error adding student to room:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message || "Không thể thêm sinh viên vào phòng"
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const handleRemoveStudentFromRoom = async (student) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/rooms/${currentRoom.maPhong}/remove-student/${student.maSV}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }

      await fetchStudentsInRoom(currentRoom.maPhong);
      await fetchAvailableStudents();
      await fetchRooms();

      setShowSuccessNotification(true);
      setNotificationMessage("Xóa sinh viên khỏi phòng thành công!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error removing student from room:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message || "Không thể xóa sinh viên khỏi phòng"
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    }
  };

  const handleManageStudents = async (room) => {
    setCurrentRoom(room);
    setShowManageStudentsModal(true);
    await Promise.all([
      fetchStudentsInRoom(room.maPhong),
      fetchAvailableStudents(),
    ]);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <ManagerLayout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
            Quản lý phòng
          </h1>
          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <PlusCircle size={18} />
            <span>Thêm phòng</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã phòng"
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative">
              <select
                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Trong">Trống</option>
                <option value="DangO">Đang ở</option>
                <option value="Day">Đầy</option>
                <option value="BaoTri">Bảo trì</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative">
              <select
                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-pointer"
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
              >
                <option value="all">Tất cả tòa nhà</option>
                <option value="Tòa A">Tòa A</option>
                <option value="Tòa B">Tòa B</option>
              </select>
              <Building
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => requestSort("maPhong")}
                  >
                    <div className="flex items-center">
                      Mã phòng
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => requestSort("toaNha")}
                  >
                    <div className="flex items-center">Tòa nhà</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => requestSort("sucChua")}
                  >
                    <div className="flex items-center">Sức chứa</div>
                  </th>
                  <th className="py-3 px-4 text-left">Số lượng hiện tại</th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => requestSort("giaPhong")}
                  >
                    <div className="flex items-center">
                      Giá phòng
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => requestSort("trangThai")}
                  >
                    <div className="flex items-center">
                      Trạng thái
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {currentRooms.length > 0 ? (
                  currentRooms.map((room) => (
                    <tr
                      key={room.maPhong}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{room.maPhong}</td>
                      <td className="py-3 px-4">
                        {getBuildingName(room.maKhu)}
                      </td>
                      <td className="py-3 px-4">
                        {getCapacityFromRoomType(room.maLoaiPhong)}
                      </td>
                      <td className="py-3 px-4">{room.soNguoiHienTai}</td>
                      <td className="py-3 px-4">
                        {formatCurrency(room.giaPhong)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRoomStatusColor(
                            room.trangThai
                          )}`}
                        >
                          {room.trangThai === "DangO"
                            ? "Đang ở"
                            : room.trangThai === "Trong"
                            ? "Trống"
                            : room.trangThai}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleManageStudents(room)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="Quản lý sinh viên"
                          >
                            <Users size={18} />
                          </button>
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room)}
                            className={`${
                              room.soNguoiHienTai > 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900 cursor-pointer"
                            }`}
                            title="Xóa"
                            disabled={room.soNguoiHienTai > 0}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-6 text-center text-gray-500">
                      Không tìm thấy phòng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {filteredRooms.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstRoom + 1} đến{" "}
                {Math.min(indexOfLastRoom, filteredRooms.length)} trong tổng số{" "}
                {filteredRooms.length} phòng
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[9999] animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>{notificationMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {showErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[9999] animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>{notificationMessage}</span>
          </div>
        )}

        {/* Modal thêm/sửa phòng */}
        {showAddRoomModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold text-primary">
                  {roomForm.id ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
                </h2>
                <button
                  onClick={() => setShowAddRoomModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveRoom} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.maPhong}
                      onChange={handleMaPhongChange}
                      placeholder="Ví dụ: A101, B203"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tòa nhà <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.maKhu}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, maKhu: e.target.value })
                      }
                    >
                      <option value="A">Tòa A</option>
                      <option value="B">Tòa B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.maLoaiPhong}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          maLoaiPhong: e.target.value,
                        })
                      }
                    >
                      <option value="P2">Phòng đôi (2 người)</option>
                      <option value="P4">Phòng 4 người</option>
                      <option value="P6">Phòng 6 người</option>
                      <option value="P8">Phòng 8 người</option>
                      <option value="P12">Phòng 12 người</option>
                      <option value="P16">Phòng 16 người</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá phòng (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100000"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.giaPhong}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          giaPhong: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diện tích (m²) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.dienTich}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          dienTich: Number.parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={roomForm.trangThai}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, trangThai: e.target.value })
                      }
                    >
                      <option value="Trong">Trống</option>
                      <option value="DangO">Đang ở</option>
                      <option value="Day">Đầy</option>
                      <option value="BaoTri">Bảo trì</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="3"
                      value={roomForm.moTa}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, moTa: e.target.value })
                      }
                      placeholder="Nhập mô tả về phòng (nếu có)"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddRoomModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {roomForm.id ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal quản lý sinh viên trong phòng */}
        {showManageStudentsModal && currentRoom && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b p-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    Quản lý sinh viên - Phòng {currentRoom.maPhong}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Sức chứa: {currentRoom.soNguoiHienTai}/
                    {getCapacityFromRoomType(currentRoom.maLoaiPhong)} sinh viên
                  </p>
                </div>
                <button
                  onClick={() => setShowManageStudentsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sinh viên..."
                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Danh sách sinh viên trong phòng */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Users size={20} className="mr-2" />
                      Sinh viên trong phòng ({filteredStudentsInRoom.length})
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      {filteredStudentsInRoom.length > 0 ? (
                        <div className="divide-y">
                          {filteredStudentsInRoom.map((student) => (
                            <div
                              key={student.maSV}
                              className="p-3 hover:bg-gray-50 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{student.hoTen}</p>
                                <p className="text-sm text-gray-500">
                                  MSSV: {student.maSV} | Lớp: {student.lop}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveStudentFromRoom(student)
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Xóa khỏi phòng"
                                disabled={currentRoom.trangThai === "BaoTri"}
                              >
                                <UserMinus size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Không có sinh viên nào trong phòng
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Danh sách sinh viên có thể thêm */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <UserPlus size={20} className="mr-2" />
                      Sinh viên có thể thêm ({filteredAvailableStudents.length})
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      {filteredAvailableStudents.length > 0 ? (
                        <div className="divide-y">
                          {filteredAvailableStudents.map((student) => (
                            <div
                              key={student.maSV}
                              className="p-3 hover:bg-gray-50 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{student.hoTen}</p>
                                <p className="text-sm text-gray-500">
                                  MSSV: {student.maSV} | Lớp: {student.lop}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddStudentToRoom(student)}
                                className={`${
                                  currentRoom.soNguoiHienTai >=
                                    getCapacityFromRoomType(
                                      currentRoom.maLoaiPhong
                                    ) || currentRoom.trangThai === "BaoTri"
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-green-500 hover:text-green-700"
                                }`}
                                title="Thêm vào phòng"
                                disabled={
                                  currentRoom.soNguoiHienTai >=
                                    getCapacityFromRoomType(
                                      currentRoom.maLoaiPhong
                                    ) || currentRoom.trangThai === "BaoTri"
                                }
                              >
                                <UserPlus size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Không có sinh viên nào có thể thêm
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cập nhật trạng thái phòng */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium mb-3">
                    Cập nhật trạng thái phòng
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleUpdateRoomStatus(currentRoom.maPhong, "Trong")
                      }
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        currentRoom.trangThai === "Trong"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 hover:bg-green-50 text-gray-800"
                      }`}
                      disabled={currentRoom.soNguoiHienTai > 0}
                    >
                      <Home size={18} />
                      Trống
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRoomStatus(currentRoom.maPhong, "DangO")
                      }
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        currentRoom.trangThai === "DangO"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 hover:bg-blue-50 text-gray-800"
                      }`}
                      disabled={
                        currentRoom.soNguoiHienTai === 0 ||
                        currentRoom.soNguoiHienTai >=
                          getCapacityFromRoomType(currentRoom.maLoaiPhong)
                      }
                    >
                      <Users size={18} />
                      Đang ở
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRoomStatus(currentRoom.maPhong, "Day")
                      }
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        currentRoom.trangThai === "Day"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          : "bg-gray-100 hover:bg-yellow-50 text-gray-800"
                      }`}
                      disabled={
                        currentRoom.soNguoiHienTai <
                        getCapacityFromRoomType(currentRoom.maLoaiPhong)
                      }
                    >
                      <Check size={18} />
                      Đầy
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRoomStatus(currentRoom.maPhong, "BaoTri")
                      }
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        currentRoom.trangThai === "BaoTri"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-gray-100 hover:bg-red-50 text-gray-800"
                      }`}
                    >
                      <Bed size={18} />
                      Bảo trì
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={() => setShowManageStudentsModal(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && deletingRoom && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Xác nhận xóa phòng</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa phòng {deletingRoom.maPhong}? Hành
                động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingRoom(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Đang xử lý..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default RoomManager;
