"use client";

const ContractDetails = ({ contract, onEdit, onBack }) => {
  if (!contract) return null;

  const statusColors = {
    active: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-800",
    terminated: "bg-red-100 text-red-800",
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800",
    partial: "bg-yellow-100 text-yellow-800",
    unpaid: "bg-red-100 text-red-800",
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết hợp đồng</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Mã hợp đồng:</span>
                <span className="font-medium">{contract.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    statusColors[contract.status]
                  }`}
                >
                  {contract.status === "active"
                    ? "Đang hiệu lực"
                    : contract.status === "expired"
                    ? "Hết hạn"
                    : "Đã hủy"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Ngày bắt đầu:</span>
                <span>{formatDate(contract.startDate)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Ngày kết thúc:</span>
                <span>{formatDate(contract.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Thông tin sinh viên */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin sinh viên</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Mã sinh viên:</span>
                <span>{contract.studentId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Tên sinh viên:</span>
                <span>{contract.studentName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Phòng:</span>
                <span>{contract.roomId}</span>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    paymentStatusColors[contract.paymentStatus]
                  }`}
                >
                  {contract.paymentStatus === "paid"
                    ? "Đã thanh toán"
                    : contract.paymentStatus === "partial"
                    ? "Thanh toán một phần"
                    : "Chưa thanh toán"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Tiền đặt cọc:</span>
                <span>{contract.depositAmount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Phí hàng tháng:</span>
                <span>{contract.monthlyFee}</span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <h3 className="text-lg font-medium mb-4">Ghi chú</h3>
            <div className="p-3 bg-gray-50 rounded-lg min-h-[100px]">
              {contract.notes || "Không có ghi chú"}
            </div>
          </div>
        </div>

        {/* Lịch sử thanh toán (mẫu) */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Lịch sử thanh toán</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(contract.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Tiền đặt cọc
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contract.depositAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Đã thanh toán
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(
                      new Date(contract.startDate).setMonth(
                        new Date(contract.startDate).getMonth() + 1
                      )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Phí tháng đầu
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contract.monthlyFee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Đã thanh toán
                    </span>
                  </td>
                </tr>
                {contract.paymentStatus === "partial" && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(
                        new Date(contract.startDate).setMonth(
                          new Date(contract.startDate).getMonth() + 2
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      Phí tháng thứ hai
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {contract.monthlyFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Chưa thanh toán
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-6 border-t">
        <div className="flex justify-end">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
