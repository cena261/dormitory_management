"use client";

import { useState, useEffect } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ContractList from "../components/Contract/ContractList.jsx";
import ContractForm from "../components/Contract/ContractForm.jsx";
import ContractDetails from "../components/Contract/ContractDetail.jsx";
import {
  PlusCircle,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function ContractManager() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingContract, setDeletingContract] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessNotification, setShowDeleteSuccessNotification] =
    useState(false);
  const [showDeleteErrorNotification, setShowDeleteErrorNotification] =
    useState(false);

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        const userData = localStorage.getItem("user");

        if (!userData) {
          logout();
          navigate("/login");
          return;
        }

        const { access_token, isAdmin } = JSON.parse(userData);

        if (!access_token || !isAdmin) {
          logout();
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/api/contracts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("user");
          logout();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch contracts: ${response.status}`);
        }

        const data = await response.json();

        if (
          data &&
          data.result &&
          data.result.content &&
          Array.isArray(data.result.content)
        ) {
          const validContracts = data.result.content.filter(
            (contract) => contract !== null
          );
          setContracts(validContracts);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Không thể tải danh sách hợp đồng. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [logout, navigate]);

  const handleAddContract = async (newContract) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch("http://localhost:8080/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContract),
      });

      if (!response.ok) {
        throw new Error("Failed to create contract");
      }

      const data = await response.json();
      if (data.code === 0) {
        const updatedResponse = await fetch(
          "http://localhost:8080/api/contracts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        if (
          updatedData.code === 0 &&
          updatedData.result &&
          updatedData.result.content
        ) {
          setContracts(
            updatedData.result.content.filter((contract) => contract !== null)
          );
        }

        setView("list");
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      } else {
        throw new Error(data.message || "Failed to create contract");
      }
    } catch (error) {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const handleEditContract = async (updatedContract) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/contracts/${updatedContract.maHopDong}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedContract),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update contract");
      }

      const data = await response.json();
      if (data.code === 0) {
        const updatedResponse = await fetch(
          "http://localhost:8080/api/contracts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        if (
          updatedData.code === 0 &&
          updatedData.result &&
          updatedData.result.content
        ) {
          setContracts(
            updatedData.result.content.filter((contract) => contract !== null)
          );
        }

        setView("list");
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      } else {
        throw new Error(data.message || "Failed to update contract");
      }
    } catch (error) {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const handleEndContract = async (contract) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/contracts/${contract.maHopDong}/end`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ngayKetThucThucTe: new Date().toISOString().split("T")[0], // Ngày hiện tại
            status: "DaHuy",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to end contract");
      }

      const data = await response.json();
      if (data.code === 0) {
        const updatedResponse = await fetch(
          "http://localhost:8080/api/contracts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        if (
          updatedData.code === 0 &&
          updatedData.result &&
          updatedData.result.content
        ) {
          setContracts(
            updatedData.result.content.filter((contract) => contract !== null)
          );
        }

        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      } else {
        throw new Error(data.message || "Failed to end contract");
      }
    } catch (error) {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const handleDeleteContract = (contract) => {
    setDeletingContract(contract);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingContract) return;

    setIsDeleting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/contracts/${deletingContract.maHopDong}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete contract");
      }

      const updatedResponse = await fetch(
        "http://localhost:8080/api/contracts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setContracts(
          updatedData.result.filter((contract) => contract !== null)
        );
      }

      setShowDeleteConfirm(false);
      setDeletingContract(null);
      setShowDeleteSuccessNotification(true);
      setTimeout(() => setShowDeleteSuccessNotification(false), 3000);
    } catch (error) {
      setShowDeleteErrorNotification(true);
      setTimeout(() => setShowDeleteErrorNotification(false), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.maHopDong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.maSV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.maPhong?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || contract.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

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
            Quản lý hợp đồng
          </h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setView("add")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm hợp đồng mới</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên sinh viên, phòng..."
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
                <option value="DangHieuLuc">Đang hiệu lực</option>
                <option value="HetHan">Hết hạn</option>
                <option value="DaHuy">Đã hủy</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {view === "list" && (
            <ContractList
              contracts={filteredContracts}
              onView={(contract) => {
                setSelectedContract(contract);
                setView("details");
              }}
              onEdit={(contract) => {
                setSelectedContract(contract);
                setView("edit");
              }}
              onEnd={handleEndContract}
              onDelete={handleDeleteContract}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          )}

          {view === "add" && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Thêm hợp đồng mới</h2>
                  <button
                    onClick={() => setView("list")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <ContractForm
                    onSubmit={handleAddContract}
                    onCancel={() => setView("list")}
                  />
                </div>
              </div>
            </div>
          )}

          {view === "edit" && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Chỉnh sửa hợp đồng</h2>
                  <button
                    onClick={() => setView("list")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <ContractForm
                    contract={selectedContract}
                    onSubmit={handleEditContract}
                    onCancel={() => setView("list")}
                  />
                </div>
              </div>
            </div>
          )}

          {view === "details" && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Chi tiết hợp đồng</h2>
                  <button
                    onClick={() => setView("list")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <ContractDetails
                    contract={selectedContract}
                    onEdit={() => setView("edit")}
                    onBack={() => setView("list")}
                  />
                </div>
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

        {/* Delete Success Notification */}
        {showDeleteSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Xóa hợp đồng thành công!</span>
          </div>
        )}

        {/* Delete Error Notification */}
        {showDeleteErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>Không thể xóa hợp đồng!</span>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && deletingContract && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
                Xác nhận xóa hợp đồng
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa hợp đồng của sinh viên{" "}
                {deletingContract.maSV} (Mã hợp đồng:{" "}
                {deletingContract.maHopDong})? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingContract(null);
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

export default ContractManager;
