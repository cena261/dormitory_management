"use client";

import { useState, useEffect } from "react";

const ContractForm = ({ contract, onSubmit, onCancel }) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const maQuanLyLap = userData?.maQuanLy || "QL001";

  const initialFormState = {
    ngayLap: new Date().toISOString().split("T")[0],
    ngayBatDau: "",
    ngayKetThucDuKien: "",
    tienCoc: "",
    maSV: "",
    maPhong: "",
    maQuanLyLap: maQuanLyLap,
    status: "DangHieuLuc",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    if (contract) {
      setFormData(contract);
    }
  }, [contract]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoadingRooms(true);
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.log("No user data found");
          return;
        }

        const { access_token } = JSON.parse(userData);
        if (!access_token) {
          console.log("No token found");
          return;
        }

        const response = await fetch("http://localhost:8080/api/rooms", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        if (data.code === 0 && data.result) {
          const availableRooms = data.result.filter(
            (room) =>
              room.trangThai === "Trong" ||
              room.trangThai === "DangO" ||
              room.trangThai === "Day"
          );
          setRooms(availableRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.maSV) newErrors.maSV = "Vui lòng nhập mã sinh viên";
    if (!formData.maPhong) newErrors.maPhong = "Vui lòng chọn phòng";
    if (!formData.ngayLap) newErrors.ngayLap = "Vui lòng chọn ngày lập";
    if (!formData.ngayBatDau)
      newErrors.ngayBatDau = "Vui lòng chọn ngày bắt đầu";
    if (!formData.ngayKetThucDuKien)
      newErrors.ngayKetThucDuKien = "Vui lòng chọn ngày kết thúc";
    if (!formData.tienCoc) newErrors.tienCoc = "Vui lòng nhập số tiền đặt cọc";

    if (
      formData.ngayBatDau &&
      formData.ngayKetThucDuKien &&
      new Date(formData.ngayKetThucDuKien) <= new Date(formData.ngayBatDau)
    ) {
      newErrors.ngayKetThucDuKien = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        tienCoc: Number(formData.tienCoc),
        status: "DangHieuLuc",
      };
      onSubmit(submitData);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">
        {contract ? "Chỉnh sửa hợp đồng" : "Thêm hợp đồng mới"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin sinh viên */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin sinh viên</h3>

            <div>
              <label
                htmlFor="maSV"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mã sinh viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="maSV"
                name="maSV"
                value={formData.maSV}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.maSV ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập mã sinh viên"
              />
              {errors.maSV && (
                <p className="mt-1 text-sm text-red-500">{errors.maSV}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="maPhong"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phòng <span className="text-red-500">*</span>
              </label>
              <select
                id="maPhong"
                name="maPhong"
                value={formData.maPhong}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.maPhong ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoadingRooms}
              >
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.maPhong} value={room.maPhong}>
                    {room.maPhong} - {room.maKhu} -{" "}
                    {formatCurrency(room.giaPhong)}/tháng
                    {room.trangThai === "DangO" && " (Đang có người ở)"}
                    {room.trangThai === "Day" && " (Đã đầy)"}
                  </option>
                ))}
              </select>
              {errors.maPhong && (
                <p className="mt-1 text-sm text-red-500">{errors.maPhong}</p>
              )}
              {isLoadingRooms && (
                <p className="mt-1 text-sm text-gray-500">
                  Đang tải danh sách phòng...
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tienCoc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tiền đặt cọc <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tienCoc"
                name="tienCoc"
                value={formData.tienCoc}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.tienCoc ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập số tiền đặt cọc"
              />
              {errors.tienCoc && (
                <p className="mt-1 text-sm text-red-500">{errors.tienCoc}</p>
              )}
            </div>
          </div>

          {/* Thông tin hợp đồng */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin hợp đồng</h3>

            <div>
              <label
                htmlFor="ngayLap"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ngày lập <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="ngayLap"
                name="ngayLap"
                value={formData.ngayLap}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.ngayLap ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ngayLap && (
                <p className="mt-1 text-sm text-red-500">{errors.ngayLap}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ngayBatDau"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="ngayBatDau"
                name="ngayBatDau"
                value={formData.ngayBatDau}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.ngayBatDau ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ngayBatDau && (
                <p className="mt-1 text-sm text-red-500">{errors.ngayBatDau}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ngayKetThucDuKien"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="ngayKetThucDuKien"
                name="ngayKetThucDuKien"
                value={formData.ngayKetThucDuKien}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.ngayKetThucDuKien
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.ngayKetThucDuKien && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.ngayKetThucDuKien}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            {contract ? "Cập nhật" : "Tạo hợp đồng"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;
