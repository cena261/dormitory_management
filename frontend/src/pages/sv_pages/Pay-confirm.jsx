function PaymentConfirmation() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6">Cổng thanh toán</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#1e5bb7] text-white">
                <th className="py-3 px-4 border border-gray-300 text-center">Mã</th>
                <th className="py-3 px-4 border border-gray-300 text-center">Nội dung thu</th>
                <th className="py-3 px-4 border border-gray-300 text-center">Số lượng</th>
                <th className="py-3 px-4 border border-gray-300 text-center">Số tiền (VND)</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="py-3 px-4 border border-gray-300 text-center">003</td>
                <td className="py-3 px-4 border border-gray-300">Tiền thuê phòng tháng 3</td>
                <td className="py-3 px-4 border border-gray-300 text-center">1</td>
                <td className="py-3 px-4 border border-gray-300 text-right">1,500,000</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-300 text-center">005</td>
                <td className="py-3 px-4 border border-gray-300">Tiền nước tháng 3</td>
                <td className="py-3 px-4 border border-gray-300 text-center">3</td>
                <td className="py-3 px-4 border border-gray-300 text-right">30,000</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-300 text-center">006</td>
                <td className="py-3 px-4 border border-gray-300">Tiền điện tháng 3</td>
                <td className="py-3 px-4 border border-gray-300 text-center">50</td>
                <td className="py-3 px-4 border border-gray-300 text-right">175,000</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 border border-gray-300 font-bold">
                  Tổng số tiền cần thanh toán
                </td>
                <td className="py-3 px-4 border border-gray-300 text-right font-bold">1,705,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-start">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-8 rounded-md transition-colors">
            Tạo mã QR
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-lg">1. Để thanh toán trực tuyến qua ngân hàng thẻ ATM phải đăng ký Thanh toán online.</p>
        <p className="text-lg">2. Vui lòng kiểm tra HẠN MỨC THẺ trước khi thanh toán</p>
        <p className="text-lg">3. Khuyến cáo thanh toán qua QR-Code, thẻ ATM nội địa.</p>
      </div>
    </div>
  );
}

export default PaymentConfirmation;