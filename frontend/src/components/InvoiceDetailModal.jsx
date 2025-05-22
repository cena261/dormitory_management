"use client";

import { XCircle, CheckCircle, Clock, Download, Printer } from "lucide-react";

function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case "OVERDUE":
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Chi tiết hóa đơn</h2>
            <button
              onClick={onClose}
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
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Trạng thái
              </h3>
              <div>{getStatusBadge(invoice.status)}</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Sinh viên
              </h3>
              <p>{invoice.studentName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phòng</h3>
              <p>{invoice.roomNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Ngày tạo
              </h3>
              <p>{formatDate(invoice.createdDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Hạn thanh toán
              </h3>
              <p>{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h3>
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
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
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
  );
}

export default InvoiceDetailModal;
