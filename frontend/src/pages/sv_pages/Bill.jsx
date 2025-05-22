import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../../services/student.service";

function BillPayment() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await studentService.getInvoices();
        if (response.code === 0) {
          setInvoices(response.result.content);
        } else {
          setError("Không thể lấy thông tin hóa đơn");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handlePayment = () => {
    navigate("/payment-confirmation");
  };

  const calculateTotal = () => {
    return invoices.reduce((total, invoice) => total + invoice.soTien, 0);
  };

  if (loading) {
    return <div className="flex-1 p-6">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6">Thanh toán trực tuyến</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#1e5bb7] text-white">
                <th className="py-3 px-4 border border-gray-300 text-center">
                  Mã
                </th>
                <th className="py-3 px-4 border border-gray-300 text-center">
                  Nội dung thu
                </th>
                <th className="py-3 px-4 border border-gray-300 text-center">
                  Số lượng
                </th>
                <th className="py-3 px-4 border border-gray-300 text-center">
                  Số tiền (VND)
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {invoices.map((invoice) => (
                <tr key={invoice.maHoaDon}>
                  <td className="py-3 px-4 border border-gray-300 text-center">
                    {invoice.maHoaDon}
                  </td>
                  <td className="py-3 px-4 border border-gray-300">
                    {invoice.loaiHoaDon}
                  </td>
                  <td className="py-3 px-4 border border-gray-300 text-center">
                    1
                  </td>
                  <td className="py-3 px-4 border border-gray-300 text-right">
                    {Math.round(invoice.soTien).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="3"
                  className="py-3 px-4 border border-gray-300 font-bold"
                >
                  Tổng số tiền cần thanh toán
                </td>
                <td className="py-3 px-4 border border-gray-300 text-right font-bold">
                  {Math.round(calculateTotal()).toLocaleString("vi-VN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex">
          <button
            onClick={handlePayment}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-8 rounded-md transition-colors"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillPayment;
