import { useState, useEffect } from "react";
import studentService from "../../services/student.service";

function RoomInfo() {
  const [roomData, setRoomData] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [roommatesData, setRoommatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomResponse, contractResponse] = await Promise.all([
          studentService.getRoomInfo(),
          studentService.getContractInfo(),
        ]);

        if (roomResponse.code === 0 && contractResponse.code === 0) {
          setRoomData(roomResponse.result);
          setContractData(contractResponse.result);

          const studentsResponse = await studentService.getRoomStudents(
            roomResponse.result.maPhong
          );
          if (studentsResponse.code === 0) {
            setRoommatesData(studentsResponse.result);
          }
        } else {
          setError("Không thể lấy thông tin phòng");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex-1 p-6">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  if (!roomData || !contractData) {
    return <div className="flex-1 p-6">Không tìm thấy thông tin</div>;
  }

  const formatRoomType = (maLoaiPhong) => {
    const numberOfPeople = maLoaiPhong.replace("P", "");
    return `${numberOfPeople} người`;
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin phòng</h2>

      <div className="bg-gray-100 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-300">
          Thông Tin Cơ Bản
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <InfoItem label="Số phòng" value={roomData.maPhong} />
            <InfoItem label="Khu" value={roomData.maKhu} />
            <InfoItem label="Tầng" value={roomData.tang} />
            <InfoItem
              label="Ngày bắt đầu"
              value={new Date(contractData.ngayBatDau).toLocaleDateString(
                "vi-VN"
              )}
            />
          </div>

          <div>
            <InfoItem
              label="Loại phòng"
              value={formatRoomType(roomData.maLoaiPhong)}
            />
            <InfoItem
              label="Số người hiện tại"
              value={`${roomData.soNguoiHienTai} người`}
            />
            <InfoItem
              label="Giá phòng"
              value={`${roomData.giaPhong.toLocaleString("vi-VN")} VNĐ`}
            />
            <InfoItem
              label="Ngày hết hạn"
              value={new Date(
                contractData.ngayKetThucDuKien
              ).toLocaleDateString("vi-VN")}
            />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Danh sách sinh viên trong phòng
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#1e5bb7] text-white">
              <th className="py-3 px-4 border border-gray-300 text-center">
                MSSV
              </th>
              <th className="py-3 px-4 border border-gray-300 text-center">
                Họ tên sinh viên
              </th>
              <th className="py-3 px-4 border border-gray-300 text-center">
                Lớp
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {roommatesData.map((roommate, index) => (
              <tr key={index} className="bg-white">
                <td className="py-3 px-4 border border-gray-300 text-center">
                  {roommate.maSV}
                </td>
                <td className="py-3 px-4 border border-gray-300 text-center">
                  {roommate.hoTen}
                </td>
                <td className="py-3 px-4 border border-gray-300 text-center">
                  {roommate.lop}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500">{label}:</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default RoomInfo;
