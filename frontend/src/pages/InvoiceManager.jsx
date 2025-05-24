"use client";

import { useState, useEffect, useCallback } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Download,
  Printer,
  X,
  Loader,
} from "lucide-react";

function InvoiceManager() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [studentIdMap, setStudentIdMap] = useState(new Map());

  const [maQL, setMaQL] = useState("");

  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    loaiHoaDon: "TienPhong",
    ngayLap: new Date().toISOString().split("T")[0],
    kyThanhToan: "",
    soTien: "",
    hanThanhToan: "",
    maHopDong: "",
  });
  const [invoiceErrors, setInvoiceErrors] = useState({});
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [showCreateSuccessNotification, setShowCreateSuccessNotification] =
    useState(false);
  const [showCreateErrorNotification, setShowCreateErrorNotification] =
    useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
  });
  const [sortBy, setSortBy] = useState("createdDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [loadingActionId, setLoadingActionId] = useState(null);

  useEffect(() => {
    const fetchMaQL = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.access_token;
        const username = userData?.username;
        if (!token || !username) return;
        const response = await fetch(
          "https://dormitory-management-backend.onrender.com/api/admin-accounts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.result && Array.isArray(data.result)) {
          const admin = data.result.find((acc) => acc.taiKhoan === username);
          if (admin && admin.maQL) setMaQL(admin.maQL);
        }
      } catch (err) {}
    };
    fetchMaQL();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      if (!token) {
        throw new Error("No token found");
      }

      const queryParams = new URLSearchParams();

      queryParams.append("page", page);
      queryParams.append("size", size);

      if (filters.status) {
        queryParams.append("trangThai", filters.status);
      }
      if (filters.searchTerm) {
        queryParams.append("search", filters.searchTerm);
      }

      if (sortBy) {
        queryParams.append("sortBy", sortBy);
        queryParams.append("sortDirection", sortDirection);
      }

      const response = await fetch(
        `https://dormitory-management-backend.onrender.com/api/invoices?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch invoices: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.code === 0 && data.result) {
        const invoiceList = data.result.content || [];
        setInvoices(invoiceList);
        setTotalPages(data.result.totalPages || 0);
        setTotalElements(data.result.totalElements || 0);

        await fetchStudentIds(invoiceList);
      } else {
        setInvoices([]);
        setTotalPages(0);
        setTotalElements(0);
        throw new Error(data.message || "Failed to fetch invoices");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(
        err.message || "Không thể tải danh sách hóa đơn. Vui lòng thử lại sau."
      );
      setInvoices([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    size,
    filters.status,
    filters.searchTerm,
    sortBy,
    sortDirection,
    logout,
    navigate,
  ]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    window.searchTimeout = setTimeout(() => {
      setPage(0);
      setFilters((prev) => ({
        ...prev,
        searchTerm: searchValue,
      }));
    }, 500);
  };

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  const fetchStudentIds = async (invoices) => {
    const newStudentIdMap = new Map();

    for (const invoice of invoices) {
      if (!invoice.maHopDong) continue;

      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.access_token;

        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `https://dormitory-management-backend.onrender.com/api/contracts/${invoice.maHopDong}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Failed to fetch contract for ${invoice.maHopDong}: ${response.status}`
          );
          continue;
        }

        const data = await response.json();
        if (data.code === 0 && data.result) {
          newStudentIdMap.set(invoice.maHopDong, data.result.maSV);
        }
      } catch (err) {
        console.error(`Error fetching contract for ${invoice.maHopDong}:`, err);
      }
    }

    setStudentIdMap(newStudentIdMap);
  };

  const handleFilterChange = (e) => {
    setPage(0);
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setIsActionLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `https://dormitory-management-backend.onrender.com/api/invoices/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }

      await fetchInvoices();

      setShowSuccessNotification(true);
      setNotificationMessage("Cập nhật trạng thái hóa đơn thành công!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating invoice status:", err);
      setShowErrorNotification(true);
      setNotificationMessage(
        err.message || "Không thể cập nhật trạng thái hóa đơn"
      );
      setTimeout(() => {
        setShowErrorNotification(false);
        setNotificationMessage("");
      }, 3000);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DaThanhToan":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case "ChuaThanhToan":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case "QuaHan":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Quá hạn
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getInvoiceType = (type) => {
    switch (type) {
      case "TienPhong":
        return "Tiền phòng";
      case "TienDienNuoc":
        return "Tiền điện nước";
      case "TongHop":
        return "Tổng hợp";
      case "Khac":
        return "Khác";
      default:
        return type;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const fetchContracts = async () => {
    setIsLoadingContracts(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch("https://dormitory-management-backend.onrender.com/api/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }

      const data = await response.json();
      if (data.code === 0 && data.result) {
        setContracts(data.result.content);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setShowCreateErrorNotification(true);
    } finally {
      setIsLoadingContracts(false);
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateInvoiceModal(true);
    fetchContracts();
  };

  const handleInvoiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (invoiceErrors[name]) {
      setInvoiceErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateInvoiceForm = () => {
    const newErrors = {};

    if (!newInvoice.maHopDong) {
      newErrors.maHopDong = "Vui lòng chọn hợp đồng";
    }

    if (!newInvoice.kyThanhToan) {
      newErrors.kyThanhToan = "Vui lòng nhập kỳ thanh toán";
    }

    if (!newInvoice.soTien) {
      newErrors.soTien = "Vui lòng nhập số tiền";
    } else if (isNaN(newInvoice.soTien) || Number(newInvoice.soTien) <= 0) {
      newErrors.soTien = "Số tiền không hợp lệ";
    }

    if (!newInvoice.hanThanhToan) {
      newErrors.hanThanhToan = "Vui lòng chọn hạn thanh toán";
    }

    setInvoiceErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!validateInvoiceForm()) {
      return;
    }

    setIsSubmittingInvoice(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const invoiceData = {
        ...newInvoice,
        maQLThu: maQL,
        soTien: Number(newInvoice.soTien),
      };

      console.log(
        "[DEBUG] Dữ liệu gửi lên API tạo hóa đơn:",
        JSON.stringify(invoiceData, null, 2)
      );

      const response = await fetch("https://dormitory-management-backend.onrender.com/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      await fetchInvoices();

      setShowCreateInvoiceModal(false);
      setNewInvoice({
        loaiHoaDon: "TienPhong",
        ngayLap: new Date().toISOString().split("T")[0],
        kyThanhToan: "",
        soTien: "",
        hanThanhToan: "",
        maHopDong: "",
      });

      setShowCreateSuccessNotification(true);
      setTimeout(() => {
        setShowCreateSuccessNotification(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating invoice:", error);
      setShowCreateErrorNotification(true);
      setTimeout(() => {
        setShowCreateErrorNotification(false);
      }, 3000);
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const contractOptions = contracts.map((contract) => ({
    value: contract.maHopDong,
    label: `${contract.maSV} - ${contract.maPhong}`,
    maHopDong: contract.maHopDong,
  }));

  return (
    <ManagerLayout>
      <div className="p-4">
        {/* Success notification */}
        {showSuccessNotification && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {notificationMessage}
          </div>
        )}

        {/* Error notification */}
        {showErrorNotification && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {notificationMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
            Quản lý hóa đơn
          </h1>
          <button
            onClick={handleCreateInvoice}
            className="mt-2 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2" />
            Tạo hóa đơn mới
          </button>
        </div>

        {/* Create Invoice Modal */}
        {showCreateInvoiceModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Tạo hóa đơn mới</h2>
                <button
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleInvoiceSubmit}
                className="p-4 overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="loaiHoaDon"
                      value={newInvoice.loaiHoaDon}
                      onChange={handleInvoiceInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="TienPhong">Tiền phòng</option>
                      <option value="TienDienNuoc">Tiền điện nước</option>
                      <option value="TongHop">Tiền phòng + điện nước</option>
                      <option value="Khac">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hợp đồng <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="maHopDong"
                      value={
                        contractOptions.find(
                          (option) => option.value === newInvoice.maHopDong
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        handleInvoiceInputChange({
                          target: {
                            name: "maHopDong",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        });
                      }}
                      options={contractOptions}
                      isDisabled={isLoadingContracts}
                      isLoading={isLoadingContracts}
                      placeholder="Chọn hợp đồng..."
                      noOptionsMessage={() => "Không tìm thấy hợp đồng"}
                      loadingMessage={() => "Đang tải..."}
                      isClearable
                      isSearchable
                      className={`${
                        invoiceErrors.maHopDong ? "border-red-500" : ""
                      }`}
                      classNamePrefix="select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: invoiceErrors.maHopDong
                            ? "#ef4444"
                            : state.isFocused
                            ? "#3b82f6"
                            : "#d1d5db",
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #3b82f6"
                            : "none",
                          "&:hover": {
                            borderColor: invoiceErrors.maHopDong
                              ? "#ef4444"
                              : "#3b82f6",
                          },
                        }),
                      }}
                    />
                    {invoiceErrors.maHopDong && (
                      <p className="text-red-500 text-xs mt-1">
                        {invoiceErrors.maHopDong}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kỳ thanh toán <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="kyThanhToan"
                      value={newInvoice.kyThanhToan}
                      onChange={handleInvoiceInputChange}
                      placeholder="MM-YYYY"
                      className={`w-full p-2 border rounded-lg ${
                        invoiceErrors.kyThanhToan
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {invoiceErrors.kyThanhToan && (
                      <p className="text-red-500 text-xs mt-1">
                        {invoiceErrors.kyThanhToan}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="soTien"
                      value={newInvoice.soTien}
                      onChange={handleInvoiceInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        invoiceErrors.soTien
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {invoiceErrors.soTien && (
                      <p className="text-red-500 text-xs mt-1">
                        {invoiceErrors.soTien}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hạn thanh toán <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="hanThanhToan"
                      value={newInvoice.hanThanhToan}
                      onChange={handleInvoiceInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        invoiceErrors.hanThanhToan
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {invoiceErrors.hanThanhToan && (
                      <p className="text-red-500 text-xs mt-1">
                        {invoiceErrors.hanThanhToan}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateInvoiceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingInvoice}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmittingInvoice ? "Đang xử lý..." : "Tạo hóa đơn"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Success Notification */}
        {showCreateSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Tạo hóa đơn thành công!</span>
          </div>
        )}

        {/* Create Error Notification */}
        {showCreateErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <XCircle className="w-5 h-5" />
            <span>Không thể tạo hóa đơn!</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hóa đơn, mã sinh viên"
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative">
              <select
                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-pointer"
                value={filters.status}
                onChange={handleFilterChange}
                name="status"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="DaThanhToan">Đã thanh toán</option>
                <option value="ChuaThanhToan">Chờ thanh toán</option>
                <option value="QuaHan">Quá hạn</option>
              </select>
              <Filter
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
                    onClick={() => handleSort("maHoaDon")}
                  >
                    <div className="flex items-center">Mã hóa đơn</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => handleSort("loaiHoaDon")}
                  >
                    <div className="flex items-center">Loại hóa đơn</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => handleSort("maSV")}
                  >
                    <div className="flex items-center">Mã sinh viên</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => handleSort("soTien")}
                  >
                    <div className="flex items-center">Số tiền</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => handleSort("hanThanhToan")}
                  >
                    <div className="flex items-center">Hạn thanh toán</div>
                  </th>
                  <th
                    className="py-3 px-4 text-left cursor-pointer"
                    onClick={() => handleSort("trangThai")}
                  >
                    <div className="flex items-center">Trạng thái</div>
                  </th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500">
                      Không có hóa đơn nào
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.maHoaDon}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {invoice.maHoaDon}
                      </td>
                      <td className="py-3 px-4">
                        {getInvoiceType(invoice.loaiHoaDon)}
                      </td>
                      <td className="py-3 px-4">
                        {studentIdMap.get(invoice.maHopDong) || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(invoice.soTien)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(invoice.hanThanhToan)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(invoice.trangThai)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            className={`p-1 rounded-full ${
                              invoice.trangThai === "DaThanhToan"
                                ? "bg-green-100 text-green-800"
                                : "hover:bg-green-100 text-gray-500"
                            }`}
                            disabled={
                              invoice.trangThai === "DaThanhToan" ||
                              loadingActionId === invoice.maHoaDon
                            }
                            title="Đã thanh toán"
                            onClick={async () => {
                              setLoadingActionId(invoice.maHoaDon);
                              try {
                                const userData = JSON.parse(
                                  localStorage.getItem("user")
                                );
                                const token = userData?.access_token;
                                const trangThai = "DaThanhToan";
                                const ngayThanhToan = new Date()
                                  .toISOString()
                                  .split("T")[0];
                                const res = await fetch(
                                  `https://dormitory-management-backend.onrender.com/api/invoices/${invoice.maHoaDon}/status`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                      trangThai,
                                      ngayThanhToan,
                                      maQLThu: maQL,
                                    }),
                                  }
                                );
                                if (!res.ok)
                                  throw new Error(
                                    "Cập nhật trạng thái thất bại"
                                  );
                                await fetchInvoices();
                                setShowSuccessNotification(true);
                                setNotificationMessage(
                                  "Cập nhật trạng thái hóa đơn thành công!"
                                );
                                setTimeout(
                                  () => setShowSuccessNotification(false),
                                  2000
                                );
                              } catch (err) {
                                setShowErrorNotification(true);
                                setNotificationMessage(
                                  "Không thể cập nhật trạng thái hóa đơn!"
                                );
                                setTimeout(
                                  () => setShowErrorNotification(false),
                                  2000
                                );
                              } finally {
                                setLoadingActionId(null);
                              }
                            }}
                          >
                            {loadingActionId === invoice.maHoaDon ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            className={`p-1 rounded-full ${
                              invoice.trangThai === "ChuaThanhToan"
                                ? "bg-yellow-100 text-yellow-800"
                                : "hover:bg-yellow-100 text-gray-500"
                            }`}
                            disabled={
                              invoice.trangThai === "ChuaThanhToan" ||
                              loadingActionId === invoice.maHoaDon
                            }
                            title="Chờ thanh toán"
                            onClick={async () => {
                              setLoadingActionId(invoice.maHoaDon);
                              try {
                                const userData = JSON.parse(
                                  localStorage.getItem("user")
                                );
                                const token = userData?.access_token;
                                const trangThai = "ChuaThanhToan";
                                const res = await fetch(
                                  `https://dormitory-management-backend.onrender.com/api/invoices/${invoice.maHoaDon}/status`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ trangThai }),
                                  }
                                );
                                if (!res.ok)
                                  throw new Error(
                                    "Cập nhật trạng thái thất bại"
                                  );
                                await fetchInvoices();
                                setShowSuccessNotification(true);
                                setNotificationMessage(
                                  "Cập nhật trạng thái hóa đơn thành công!"
                                );
                                setTimeout(
                                  () => setShowSuccessNotification(false),
                                  2000
                                );
                              } catch (err) {
                                setShowErrorNotification(true);
                                setNotificationMessage(
                                  "Không thể cập nhật trạng thái hóa đơn!"
                                );
                                setTimeout(
                                  () => setShowErrorNotification(false),
                                  2000
                                );
                              } finally {
                                setLoadingActionId(null);
                              }
                            }}
                          >
                            {loadingActionId === invoice.maHoaDon ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            className={`p-1 rounded-full ${
                              invoice.trangThai === "QuaHan"
                                ? "bg-red-100 text-red-800"
                                : "hover:bg-red-100 text-gray-500"
                            }`}
                            disabled={
                              invoice.trangThai === "QuaHan" ||
                              loadingActionId === invoice.maHoaDon
                            }
                            title="Quá hạn"
                            onClick={async () => {
                              setLoadingActionId(invoice.maHoaDon);
                              try {
                                const userData = JSON.parse(
                                  localStorage.getItem("user")
                                );
                                const token = userData?.access_token;
                                const trangThai = "QuaHan";
                                const res = await fetch(
                                  `https://dormitory-management-backend.onrender.com/api/invoices/${invoice.maHoaDon}/status`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ trangThai }),
                                  }
                                );
                                if (!res.ok)
                                  throw new Error(
                                    "Cập nhật trạng thái thất bại"
                                  );
                                await fetchInvoices();
                                setShowSuccessNotification(true);
                                setNotificationMessage(
                                  "Cập nhật trạng thái hóa đơn thành công!"
                                );
                                setTimeout(
                                  () => setShowSuccessNotification(false),
                                  2000
                                );
                              } catch (err) {
                                setShowErrorNotification(true);
                                setNotificationMessage(
                                  "Không thể cập nhật trạng thái hóa đơn!"
                                );
                                setTimeout(
                                  () => setShowErrorNotification(false),
                                  2000
                                );
                              } finally {
                                setLoadingActionId(null);
                              }
                            }}
                          >
                            {loadingActionId === invoice.maHoaDon ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {invoices.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {page * size + 1} đến{" "}
                {Math.min((page + 1) * size, totalElements)} trong tổng số{" "}
                {totalElements} hóa đơn
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className={`px-3 py-1 rounded ${
                    page === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        page === pageNum
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page >= totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    page >= totalPages - 1
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

        {/* Add loading overlay for actions */}
        {isActionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Chi tiết hóa đơn</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Mã hóa đơn
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedInvoice.maHoaDon}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Trạng thái
                  </h3>
                  <div>{getStatusBadge(selectedInvoice.trangThai)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Sinh viên
                  </h3>
                  <p>{selectedInvoice.studentName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Phòng
                  </h3>
                  <p>{selectedInvoice.maPhong}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Ngày tạo
                  </h3>
                  <p>{formatDate(selectedInvoice.createdDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Hạn thanh toán
                  </h3>
                  <p>{formatDate(selectedInvoice.hanThanhToan)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Chi tiết thanh toán
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tiền phòng</span>
                    <span>{formatCurrency(1200000)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tiền điện</span>
                    <span>{formatCurrency(200000)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tiền nước</span>
                    <span>{formatCurrency(100000)}</span>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(selectedInvoice.soTien)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center">
                  <Printer className="w-4 h-4 mr-2" />
                  In hóa đơn
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}

export default InvoiceManager;
