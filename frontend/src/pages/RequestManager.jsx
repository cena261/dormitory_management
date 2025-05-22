import { useState, useEffect } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  XCircle,
} from "lucide-react";
import { notificationService } from "../services/notification.service";

function RequestManager() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionTitle, setRejectionTitle] = useState("");
  const [rejectionContent, setRejectionContent] = useState("");
  const [maQL, setMaQL] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.access_token;

        const response = await fetch(
          `http://localhost:8080/api/repair-requests/paged?page=${currentPage}&size=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        if (data.code === 0 && data.result) {
          setRequests(data.result.content);
          setTotalPages(data.result.totalPages);
          setTotalElements(data.result.totalElements);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage]);

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  const filteredRequests = requests.filter((request) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "DangCho" && request.trangThai === "DangCho") ||
      (activeTab === "DangXuLy" && request.trangThai === "DangXuLy") ||
      (activeTab === "HoanThanh" && request.trangThai === "HoanThanh") ||
      (activeTab === "TuChoi" && request.trangThai === "TuChoi");

    const matchesSearch =
      request.maSV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.maPhong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.noiDung?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (maYeuCau, newStatus) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/repair-requests/${maYeuCau}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            trangThai: newStatus,
            ngayXuLy:
              newStatus === "DangXuLy"
                ? new Date().toISOString().split("T")[0]
                : null,
            ngayHoanThanh:
              newStatus === "HoanThanh"
                ? new Date().toISOString().split("T")[0]
                : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      const updatedResponse = await fetch(
        `http://localhost:8080/api/repair-requests/paged?page=${currentPage}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setRequests(updatedData.result.content);
      }

      setIsModalOpen(false);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      console.error("Error updating request status:", error);
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const handleRejectRequest = async (e) => {
    e.preventDefault();
    if (!rejectionTitle.trim() || !rejectionContent.trim()) {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const adminResponse = await fetch(
        "http://localhost:8080/api/admin-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!adminResponse.ok) {
        throw new Error("Failed to get admin information");
      }

      const adminData = await adminResponse.json();
      if (!adminData.result || !Array.isArray(adminData.result)) {
        throw new Error("Invalid admin data format");
      }

      const currentAdmin = adminData.result.find(
        (admin) => admin.taiKhoan === userData.username
      );

      if (!currentAdmin || !currentAdmin.maQL) {
        throw new Error("Không tìm thấy mã quản lý");
      }

      const maQL = currentAdmin.maQL;

      const notificationData = {
        tieuDe: rejectionTitle,
        noiDung: rejectionContent,
        loai: "HE_THONG",
        maQLGui: maQL,
        maSV: selectedRequest.maSV,
      };

      const notificationResponse = await fetch(
        "http://localhost:8080/api/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notificationData),
        }
      );

      const notificationResult = await notificationResponse.json();
      if (notificationResult.code !== 0) {
        throw new Error(
          notificationResult.message || "Failed to send notification"
        );
      }

      const deleteResponse = await fetch(
        `http://localhost:8080/api/repair-requests/${selectedRequest.maYeuCau}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete request");
      }

      const updatedResponse = await fetch(
        `http://localhost:8080/api/repair-requests/paged?page=${currentPage}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setRequests(updatedData.result.content);
      }

      setRejectionTitle("");
      setRejectionContent("");
      setShowRejectionModal(false);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      console.error("Error rejecting request:", error);
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "text-white";
    let statusText = "";
    let icon = null;

    switch (status) {
      case "DangCho":
        bgColor = "bg-yellow-500";
        statusText = "Chờ xử lý";
        icon = <Clock className="w-4 h-4" />;
        break;
      case "DangXuLy":
        bgColor = "bg-blue-500";
        statusText = "Đang xử lý";
        icon = <Clock className="w-4 h-4" />;
        break;
      case "HoanThanh":
        bgColor = "bg-green-500";
        statusText = "Đã duyệt";
        icon = <Check className="w-4 h-4" />;
        break;
      case "TuChoi":
        bgColor = "bg-red-500";
        statusText = "Từ chối";
        icon = <XCircle className="w-4 h-4" />;
        break;
      default:
        bgColor = "bg-gray-500";
        statusText = "Không xác định";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} flex items-center gap-1`}
      >
        {icon}
        {statusText}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    let bgColor = "";
    let textColor = "text-white";
    let priorityText = "";

    switch (priority) {
      case "Cao":
        bgColor = "bg-red-500";
        priorityText = "Cao";
        break;
      case "TrungBinh":
        bgColor = "bg-yellow-500";
        priorityText = "Trung bình";
        break;
      case "Thap":
        bgColor = "bg-green-500";
        priorityText = "Thấp";
        break;
      default:
        bgColor = "bg-gray-500";
        priorityText = "Không xác định";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {priorityText}
      </span>
    );
  };

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="p-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
            Quản lý yêu cầu sửa chữa
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã SV, phòng, nội dung..."
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "DangCho"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("DangCho")}
              >
                Chờ xử lý
              </button>
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "DangXuLy"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("DangXuLy")}
              >
                Đang xử lý
              </button>
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "HoanThanh"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("HoanThanh")}
              >
                Đã duyệt
              </button>
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "TuChoi"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("TuChoi")}
              >
                Từ chối
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Mã yêu cầu</th>
                  <th className="py-3 px-4 text-left">Mã SV</th>
                  <th className="py-3 px-4 text-left">Phòng</th>
                  <th className="py-3 px-4 text-left">Nội dung</th>
                  <th className="py-3 px-4 text-left">Mức độ ưu tiên</th>
                  <th className="py-3 px-4 text-left">Ngày yêu cầu</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.maYeuCau}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{request.maYeuCau}</td>
                      <td className="py-3 px-4">{request.maSV}</td>
                      <td className="py-3 px-4">{request.maPhong}</td>
                      <td className="py-3 px-4">{request.noiDung}</td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={request.mucDoUuTien} />
                      </td>
                      <td className="py-3 px-4">
                        {new Date(request.ngayYeuCau).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={request.trangThai} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="text-primary hover:text-primary/80"
                          >
                            Chi tiết
                          </button>
                          {request.trangThai === "DangCho" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    request.maYeuCau,
                                    "DangXuLy"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Xử lý
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowRejectionModal(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          {request.trangThai === "DangXuLy" && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  request.maYeuCau,
                                  "HoanThanh"
                                )
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-6 text-center text-gray-500">
                      Không tìm thấy yêu cầu nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {currentPage * 20 + 1} đến{" "}
                {Math.min((currentPage + 1) * 20, totalElements)} trong tổng số{" "}
                {totalElements} yêu cầu
              </div>
              <div className="flex gap-2">
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
              </div>
            </div>
          )}
        </div>

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Thao tác thành công!</span>
          </div>
        )}

        {/* Error Notification */}
        {showErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>Đã xảy ra lỗi!</span>
          </div>
        )}

        {/* Detail Modal */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Chi tiết yêu cầu</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã yêu cầu</p>
                    <p className="font-medium">{selectedRequest.maYeuCau}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã sinh viên</p>
                    <p className="font-medium">{selectedRequest.maSV}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phòng</p>
                    <p className="font-medium">{selectedRequest.maPhong}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mức độ ưu tiên</p>
                    <PriorityBadge priority={selectedRequest.mucDoUuTien} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.ngayYeuCau).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <StatusBadge status={selectedRequest.trangThai} />
                  </div>
                  {selectedRequest.ngayXuLy && (
                    <div>
                      <p className="text-sm text-gray-500">Ngày xử lý</p>
                      <p className="font-medium">
                        {new Date(selectedRequest.ngayXuLy).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  )}
                  {selectedRequest.ngayHoanThanh && (
                    <div>
                      <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                      <p className="font-medium">
                        {new Date(
                          selectedRequest.ngayHoanThanh
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Quản lý xử lý</p>
                    <p className="font-medium">{selectedRequest.maQLXuLy}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Nội dung</p>
                  <p className="font-medium">{selectedRequest.noiDung}</p>
                </div>
                {selectedRequest.ghiChu && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Ghi chú</p>
                    <p className="font-medium">{selectedRequest.ghiChu}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  {selectedRequest.trangThai === "DangCho" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            selectedRequest.maYeuCau,
                            "DangXuLy"
                          )
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Bắt đầu xử lý
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedRequest.maYeuCau, "TuChoi")
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {selectedRequest.trangThai === "DangXuLy" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedRequest.maYeuCau,
                          "HoanThanh"
                        )
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Từ chối yêu cầu</h2>
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                className="p-4 overflow-y-auto"
                onSubmit={handleRejectRequest}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề thông báo
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg border-gray-300"
                    placeholder="Nhập tiêu đề thông báo"
                    value={rejectionTitle}
                    onChange={(e) => setRejectionTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung thông báo
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg border-gray-300 min-h-[100px]"
                    placeholder="Nhập nội dung thông báo"
                    value={rejectionContent}
                    onChange={(e) => setRejectionContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRejectionModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Gửi thông báo và từ chối
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default RequestManager;
