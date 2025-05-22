"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ContractList from "./ContractList";
import ContractForm from "./ContractForm";
import ContractDetails from "./ContractDetail";

const ContractManager = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch("http://localhost:8080/api/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }

      const data = await response.json();
      if (data.code === 0 && data.result && data.result.content) {
        setContracts(data.result.content);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError("Không thể tải danh sách hợp đồng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleAddContract = async (contractData) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch("http://localhost:8080/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        throw new Error("Failed to create contract");
      }

      await fetchContracts();
      setShowAddForm(false);
      setSuccessMessage("Thêm hợp đồng thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error creating contract:", error);
      setErrorMessage("Lỗi khi thêm hợp đồng: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditContract = async (contractData) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/contracts/${selectedContract.maHopDong}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contractData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update contract");
      }

      await fetchContracts();
      setShowEditForm(false);
      setSelectedContract(null);
      setSuccessMessage("Cập nhật hợp đồng thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating contract:", error);
      setErrorMessage("Lỗi khi cập nhật hợp đồng: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteContract = async (contractId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/contracts/${contractId}`,
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

      await fetchContracts();
      setShowDeleteConfirm(false);
      setContractToDelete(null);
      setSuccessMessage("Xóa hợp đồng thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting contract:", error);
      setErrorMessage("Lỗi khi xóa hợp đồng: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowDetails(true);
  };

  const handleEdit = (contract) => {
    setSelectedContract(contract);
    setShowEditForm(true);
  };

  const handleDelete = (contract) => {
    setContractToDelete(contract);
    setShowDeleteConfirm(true);
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.maHopDong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.maPhong.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hợp đồng</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Thêm hợp đồng
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hợp đồng, mã SV, phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="HieuLuc">Đang hiệu lực</option>
              <option value="HetHan">Hết hạn</option>
              <option value="Huy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Contract List */}
      {!loading && !error && (
        <ContractList
          contracts={filteredContracts}
          onView={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={statusFilter}
          setFilterStatus={setStatusFilter}
        />
      )}

      {/* Add Contract Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thêm hợp đồng mới</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ContractForm
              onSubmit={handleAddContract}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Contract Form */}
      {showEditForm && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chỉnh sửa hợp đồng</h2>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedContract(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ContractForm
              contract={selectedContract}
              onSubmit={handleEditContract}
              onCancel={() => {
                setShowEditForm(false);
                setSelectedContract(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Contract Details */}
      {showDetails && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ContractDetails
              contract={selectedContract}
              onEdit={() => {
                setShowDetails(false);
                handleEdit(selectedContract);
              }}
              onBack={() => {
                setShowDetails(false);
                setSelectedContract(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && contractToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa hợp đồng của sinh viên{" "}
              <span className="font-semibold">{contractToDelete.maSV}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContractToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteContract(contractToDelete.maHopDong)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ContractManager;
