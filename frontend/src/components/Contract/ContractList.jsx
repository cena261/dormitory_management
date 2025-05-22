"use client";

import { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const ContractList = ({
  contracts,
  onEdit,
  onEnd,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endingContract, setEndingContract] = useState(null);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = contracts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contracts.length / itemsPerPage);

  const statusColors = {
    DangHieuLuc: "bg-green-100 text-green-800",
    HetHan: "bg-gray-100 text-gray-800",
    DaHuy: "bg-red-100 text-red-800",
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

  const handleEndClick = (contract) => {
    setEndingContract(contract);
    setShowEndConfirm(true);
  };

  const handleConfirmEnd = () => {
    if (endingContract) {
      onEnd(endingContract);
      setShowEndConfirm(false);
      setEndingContract(null);
    }
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Mã hợp đồng</th>
              <th className="py-3 px-4 text-left">Mã SV</th>
              <th className="py-3 px-4 text-left">Phòng</th>
              <th className="py-3 px-4 text-left">Thời hạn</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
              <th className="py-3 px-4 text-left">Tiền cọc</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {currentContracts.length > 0 ? (
              currentContracts.map((contract) => (
                <tr
                  key={contract.maHopDong}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{contract.maHopDong}</td>
                  <td className="py-3 px-4">{contract.maSV}</td>
                  <td className="py-3 px-4">{contract.maPhong}</td>
                  <td className="py-3 px-4">
                    <div>{formatDate(contract.ngayBatDau)}</div>
                    <div className="text-gray-500">
                      đến {formatDate(contract.ngayKetThucDuKien)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusColors[contract.status]
                      }`}
                    >
                      {contract.status === "DangHieuLuc"
                        ? "Đang hiệu lực"
                        : contract.status === "HetHan"
                        ? "Hết hạn"
                        : "Đã hủy"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(contract.tienCoc)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => onEdit(contract)}
                        className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleEndClick(contract)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Kết thúc hợp đồng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  Không tìm thấy hợp đồng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* End Contract Confirmation Dialog */}
      {showEndConfirm && endingContract && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận kết thúc hợp đồng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn kết thúc hợp đồng của sinh viên{" "}
              {endingContract.maSV} (Mã hợp đồng: {endingContract.maHopDong})?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  setEndingContract(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmEnd}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Kết thúc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Hiển thị {indexOfFirstItem + 1} đến{" "}
            {Math.min(indexOfLastItem, contracts.length)} trong tổng số{" "}
            {contracts.length} hợp đồng
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
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
  );
};

export default ContractList;
