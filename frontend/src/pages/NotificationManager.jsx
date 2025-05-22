"use client";

import { useState, useEffect, useRef } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../services/notification.service";
import { websocketService } from "../services/websocket.service";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function NotificationManager() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notificationType, setNotificationType] = useState("broadcast");
  const [notificationCategory, setNotificationCategory] = useState("HE_THONG");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailNotification, setDetailNotification] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [maQL, setMaQL] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    } else {
      fetchNotifications();
      setupWebSocket();
    }
    return () => {
      websocketService.disconnect();
    };
  }, [isAdmin, logout, navigate, currentPage]);

  useEffect(() => {
    if (notificationType === "personal") {
      fetchStudents();
    }
  }, [notificationType]);

  const fetchStudents = async () => {
    try {
      setShowStudentDropdown(true);
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
      const data = await response.json();
      if (data.code === 0 && data.result) {
        setStudents(data.result);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setStudents([]);
    }
  };

  const setupWebSocket = () => {
    websocketService.connect(
      () => {
        websocketService.subscribeToBroadcastNotifications((notification) => {
          setNotifications((prev) => [notification, ...prev]);
        });

        if (user?.username) {
          websocketService.subscribeToPersonalNotifications(
            user.username,
            (notification) => {
              setNotifications((prev) => [notification, ...prev]);
            }
          );
        }

        if (user?.username) {
          websocketService.sendTestMessage(user.username);
        }
      },
      (error) => {
        console.error("WebSocket error:", error);
        setErrorMessage("Lỗi kết nối WebSocket");
        setShowErrorNotification(true);
      }
    );
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications(
        currentPage,
        pageSize
      );
      if (response.code === 0 && response.result) {
        setNotifications(response.result.content || []);
        setTotalPages(response.result.totalPages);
        setTotalElements(response.result.totalElements);
      } else {
        setNotifications([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("Không thể tải danh sách thông báo");
      setShowErrorNotification(true);
      setNotifications([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (notification) => {
    setDetailNotification(notification);
    setShowDetailModal(true);
  };

  const handleOpenModal = async () => {
    if (!maQL && user?.username) {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.access_token;
        const response = await fetch(
          "http://localhost:8080/api/admin-accounts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.result && Array.isArray(data.result)) {
            const admin = data.result.find(
              (acc) => acc.taiKhoan === user.username
            );
            if (admin && admin.maQL) setMaQL(admin.maQL);
          }
        }
      } catch (err) {
        // ko can xu ly e
      }
    }
    setShowModal(true);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo");
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 2500);
      return;
    }
    if (!maQL) {
      setErrorMessage(
        "Không tìm thấy mã quản lý. Vui lòng thử lại hoặc đăng nhập lại."
      );
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 2500);
      return;
    }
    try {
      let notificationData = {};
      if (notificationType === "broadcast") {
        notificationData = {
          tieuDe: title,
          noiDung: content,
          loai: notificationCategory,
          maQLGui: maQL,
        };
      } else if (notificationType === "personal" && selectedStudent) {
        notificationData = {
          tieuDe: title,
          noiDung: content,
          loai: notificationCategory,
          maSV: selectedStudent.maSV,
          maQLGui: maQL,
        };
      } else {
        setErrorMessage("Vui lòng chọn sinh viên để gửi thông báo cá nhân");
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 2500);
        return;
      }
      const response = await notificationService.createNotification(
        notificationData
      );
      if (response.code === 0 && response.result) {
        setNotifications((prev) => [response.result, ...prev]);
        resetForm();
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 2500);
      } else {
        throw new Error(response.message || "Không thể gửi thông báo");
      }
    } catch (error) {
      setErrorMessage("Không thể gửi thông báo");
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 2500);
    }
  };

  const handleDeleteClick = (notification) => {
    setDeletingNotification(notification);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNotification) return;
    try {
      const response = await notificationService.deleteNotification(
        deletingNotification.id
      );
      if (response.code === 0) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== deletingNotification.id)
        );
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 2500);
      } else {
        throw new Error(response.message || "Không thể xóa thông báo");
      }
    } catch (error) {
      setErrorMessage("Không thể xóa thông báo");
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 2500);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingNotification(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setNotificationType("broadcast");
    setSelectedStudent(null);
    setStudentSearch("");
    setShowStudentDropdown(false);
    setShowModal(false);
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filterType === "all") return true;
      return notification.loai === filterType;
    })
    .filter(
      (notification) =>
        (notification.tieuDe &&
          notification.tieuDe
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (notification.noiDung &&
          notification.noiDung.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getNotificationType = (type) => {
    switch (type) {
      case "HE_THONG":
        return "Thông báo hệ thống";
      case "CA_NHAN":
        return "Thông báo cá nhân";
      default:
        return type;
    }
  };

  const getNotificationStatus = (status) => {
    switch (status) {
      case "CHUA_DOC":
        return "Chưa đọc";
      case "DA_DOC":
        return "Đã đọc";
      default:
        return status;
    }
  };

  return (
    <ManagerLayout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
            Quản lý thông báo
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <PlusCircle size={18} />
            <span>Tạo thông báo mới</span>
          </button>
        </div>

        {showSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Thao tác thành công!</span>
          </div>
        )}
        {showErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="broadcast">Thông báo chung</option>
                <option value="personal">Thông báo cá nhân</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Tiêu đề</th>
                  <th className="py-3 px-4 text-left">Loại</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Thời gian gửi</th>
                  <th className="py-3 px-4 text-left">Người nhận</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-500">
                      Không có thông báo nào
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {notification.tieuDe}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            notification.loai === "HE_THONG"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getNotificationType(notification.loai)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            notification.trangThai === "CHUA_DOC"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getNotificationStatus(notification.trangThai)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(notification.thoiGianGui)}
                      </td>
                      <td className="py-3 px-4">
                        {notification.maSV || "Tất cả"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleShowDetail(notification)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Search size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(notification)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {currentPage * pageSize + 1} đến{" "}
                {Math.min((currentPage + 1) * pageSize, totalElements)} trong
                tổng số {totalElements} thông báo
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Đầu
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sau
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cuối
                </button>
              </div>
            </div>
          )}
        </div>

        {showDetailModal && detailNotification && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Chi tiết thông báo</h2>
              <div className="mb-2">
                <strong>Tiêu đề:</strong> {detailNotification.tieuDe}
              </div>
              <div className="mb-2">
                <strong>Nội dung:</strong>
                <div className="whitespace-pre-line mt-1">
                  {detailNotification.noiDung}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Tạo thông báo mới</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                className="p-4 overflow-y-auto"
                onSubmit={handleSendNotification}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề thông báo
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg border-gray-300"
                    placeholder="Nhập tiêu đề thông báo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung thông báo
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg border-gray-300 min-h-[100px]"
                    placeholder="Nhập nội dung thông báo"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại thông báo
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg border-gray-300"
                    value={notificationCategory}
                    onChange={(e) => setNotificationCategory(e.target.value)}
                  >
                    <option value="HE_THONG">Hệ thống</option>
                    <option value="HOC_PHI">Học phí</option>
                    <option value="SUA_CHUA">Sửa chữa</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đối tượng thông báo
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg border-gray-300"
                    value={notificationType}
                    onChange={(e) => {
                      setNotificationType(e.target.value);
                      setSelectedStudent(null);
                      setStudentSearch("");
                    }}
                  >
                    <option value="broadcast">Thông báo chung</option>
                    <option value="personal">Thông báo cá nhân</option>
                  </select>
                </div>
                {notificationType === "personal" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn sinh viên nhận thông báo
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg border-gray-300 mb-2"
                      placeholder="Tìm kiếm theo tên hoặc mã sinh viên"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      onFocus={() => setShowStudentDropdown(true)}
                    />
                    {showStudentDropdown && (
                      <div className="border rounded-lg bg-white max-h-40 overflow-y-auto shadow-md absolute z-50 w-full">
                        {students
                          .filter(
                            (sv) =>
                              sv.hoTen
                                ?.toLowerCase()
                                .includes(studentSearch.toLowerCase()) ||
                              sv.maSV
                                ?.toLowerCase()
                                .includes(studentSearch.toLowerCase())
                          )
                          .slice(0, 20)
                          .map((sv) => (
                            <div
                              key={sv.maSV}
                              className={`p-2 cursor-pointer hover:bg-blue-100 ${
                                selectedStudent?.maSV === sv.maSV
                                  ? "bg-blue-200"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedStudent(sv);
                                setShowStudentDropdown(false);
                                setStudentSearch(
                                  sv.hoTen + " (" + sv.maSV + ")"
                                );
                              }}
                            >
                              {sv.hoTen} ({sv.maSV})
                            </div>
                          ))}
                        {students.filter(
                          (sv) =>
                            sv.hoTen
                              ?.toLowerCase()
                              .includes(studentSearch.toLowerCase()) ||
                            sv.maSV
                              ?.toLowerCase()
                              .includes(studentSearch.toLowerCase())
                        ).length === 0 && (
                          <div className="p-2 text-gray-500">
                            Không tìm thấy sinh viên
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    Gửi thông báo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDeleteConfirm && deletingNotification && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
                Xác nhận xóa thông báo
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa thông báo "
                {deletingNotification.tieuDe}"? Hành động này không thể hoàn
                tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingNotification(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default NotificationManager;
