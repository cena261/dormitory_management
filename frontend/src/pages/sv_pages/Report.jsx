import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../../services/student.service";
import { CheckCircle } from "lucide-react";

function Report() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [formData, setFormData] = useState({
    noiDung: "",
    agreed: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentResponse, roomResponse] = await Promise.all([
          studentService.getStudentInfo(),
          studentService.getRoomInfo(),
        ]);

        if (studentResponse.code === 0 && roomResponse.code === 0) {
          setStudentData(studentResponse.result);
          setRoomData(roomResponse.result);
        } else {
          setError("Không thể lấy thông tin sinh viên");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      alert("Vui lòng đồng ý với nội quy ký túc xá");
      return;
    }

    try {
      const response = await studentService.createRepairRequest({
        noiDung: formData.noiDung,
        maPhong: roomData.maPhong,
      });

      if (response.code === 0) {
        setShowSuccessNotification(true);
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 2000);
      } else {
        setError("Không thể gửi yêu cầu");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi yêu cầu");
    }
  };

  if (loading) {
    return <div className="flex-1 p-6">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 p-6">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Gửi yêu cầu thành công!</span>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold">Phiếu yêu cầu</h2>
      </div>

      <div className="bg-gray-100 rounded-xl p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">A. Thông tin cá nhân</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-200 rounded-md"
                  value={studentData?.hoTen || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số phòng</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-200 rounded-md"
                  value={roomData?.maPhong || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">MSSV</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-200 rounded-md"
                  value={studentData?.maSV || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-200 rounded-md"
                  value={studentData?.sdt || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">B. Thông tin yêu cầu</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Chi tiết thông tin yêu cầu muốn gửi đến ban quản lý
              </label>
              <textarea
                className="w-full px-4 py-2 bg-gray-200 rounded-md"
                rows="6"
                placeholder="Nhập nội dung"
                value={formData.noiDung}
                onChange={(e) =>
                  setFormData({ ...formData, noiDung: e.target.value })
                }
                required
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={formData.agreed}
                  onChange={(e) =>
                    setFormData({ ...formData, agreed: e.target.checked })
                  }
                />
                <span className="ml-2">
                  Cam kết thực hiện nội quy của ký túc xá
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
            >
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Report;
