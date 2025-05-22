import { useState, useEffect } from "react";
import studentService from "@/services/student.service";
import Frame from "@/assets/img/Frame.png";

function PersonalInfo() {
  const [studentData, setStudentData] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentResponse, contractResponse] = await Promise.all([
          studentService.getStudentInfo(),
          studentService.getContractInfo(),
        ]);

        if (studentResponse.code === 0 && contractResponse.code === 0) {
          setStudentData(studentResponse.result);
          setContractData(contractResponse.result);
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

  if (loading) {
    return <div className="flex-1 p-6">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  if (!studentData || !contractData) {
    return <div className="flex-1 p-6">Không tìm thấy thông tin</div>;
  }

  const getContractStatus = (status) => {
    return status === "DangHieuLuc" ? "Còn hạn" : "Hết hạn";
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin sinh viên</h2>

      <div className="bg-gray-100 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-[150px] h-[150px] relative mx-auto md:mx-0 mb-6 md:mb-0 md:mr-8">
            <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
              <img
                src={Frame}
                alt="Student profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <InfoItem label="MSSV" value={studentData.maSV} />
              <InfoItem label="Họ tên" value={studentData.hoTen} />
              <InfoItem label="Giới tính" value={studentData.gioiTinh} />
              <InfoItem label="Quê quán" value={studentData.diaChiThuongTru} />
              <InfoItem label="Số điện thoại" value={studentData.sdt} />
              <InfoItem label="Email" value={studentData.email} />
              <InfoItem
                label="Đối tượng ưu tiên"
                value={studentData.doiTuongUuTien}
              />
            </div>

            <div>
              <InfoItem label="Số phòng" value={contractData.maPhong} />
              <InfoItem label="Lớp" value={studentData.lop} />
              <InfoItem label="Khoa" value={studentData.khoa} />
              <InfoItem
                label="Ngày bắt đầu thuê phòng"
                value={new Date(contractData.ngayBatDau).toLocaleDateString(
                  "vi-VN"
                )}
              />
              <InfoItem
                label="Ngày hết hạn"
                value={new Date(
                  contractData.ngayKetThucDuKien
                ).toLocaleDateString("vi-VN")}
              />
              <InfoItem
                label="Tiền cọc"
                value={`${contractData.tienCoc.toLocaleString("vi-VN")} VNĐ`}
              />
              <InfoItem
                label="Trạng thái hợp đồng"
                value={getContractStatus(contractData.status)}
              />
            </div>
          </div>
        </div>
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

export default PersonalInfo;
