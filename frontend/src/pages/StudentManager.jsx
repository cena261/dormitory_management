"use client";

import { useState, useEffect } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function StudentManager() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStudentOverlay, setShowAddStudentOverlay] = useState(false);
  const [newStudent, setNewStudent] = useState({
    maSV: "",
    hoTen: "",
    lop: "",
    khoa: "",
    sdt: "",
    email: "",
    gioiTinh: "Nam",
    diaChiThuongTru: "",
    doiTuongUuTien: "Không",
    trangThaiSinhVien: "Rời đi",
    ngaySinh: "",
    cccd: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showEditStudentOverlay, setShowEditStudentOverlay] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [showEditSuccessNotification, setShowEditSuccessNotification] =
    useState(false);
  const [showEditErrorNotification, setShowEditErrorNotification] =
    useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessNotification, setShowDeleteSuccessNotification] =
    useState(false);
  const [showDeleteErrorNotification, setShowDeleteErrorNotification] =
    useState(false);

  const facultyList = [
    "Công nghệ thực phẩm",
    "Sinh học và môi trường",
    "Công nghệ hóa học",
    "Công nghệ thông tin",
    "Công nghệ điện - điện tử",
    "May - thiết kế thời trang",
    "Công nghệ cơ khí",
    "Tài chính kế toán",
    "Ngoại ngữ",
    "Quản trị kinh doanh",
    "Khoa học ứng dụng",
    "Luật",
    "Du lịch và ẩm thực",
    "Thương mại",
  ];

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "DangO":
        return "Đang ở";
      case "RoiDi":
        return "Rời đi";
      default:
        return status;
    }
  };

  const getStatusValue = (displayStatus) => {
    switch (displayStatus) {
      case "Đang ở":
        return "DangO";
      case "Rời đi":
        return "RoiDi";
      default:
        return displayStatus;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const userData = localStorage.getItem("user");

        if (!userData) {
          logout();
          navigate("/login");
          return;
        }

        const { access_token, isAdmin } = JSON.parse(userData);

        if (!access_token || !isAdmin) {
          logout();
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/student-accounts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("user");
          logout();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.result && Array.isArray(data.result)) {
          const validStudents = data.result.filter(
            (student) => student !== null
          );
          setStudents(validStudents);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Không thể tải danh sách sinh viên. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [logout, navigate]);

  const filteredStudents = students.filter((student) => {
    if (!student) return false;

    const matchesSearch =
      student.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.maSV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      getStatusDisplay(student.trangThaiSinhVien) === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const validateForm = () => {
    const newErrors = {};

    if (!newStudent.maSV) {
      newErrors.maSV = "Mã sinh viên không được để trống";
    }

    if (!newStudent.hoTen) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!newStudent.lop) {
      newErrors.lop = "Lớp không được để trống";
    }

    if (!newStudent.khoa) {
      newErrors.khoa = "Khoa không được để trống";
    }

    if (!newStudent.sdt) {
      newErrors.sdt = "Số điện thoại không được để trống";
    } else if (!/^0\d{9,10}$/.test(newStudent.sdt)) {
      newErrors.sdt =
        "Số điện thoại phải bắt đầu bằng số 0 và có tối đa 11 ký tự";
    }

    if (!newStudent.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!newStudent.cccd) {
      newErrors.cccd = "CCCD không được để trống";
    } else if (!/^\d{12}$/.test(newStudent.cccd)) {
      newErrors.cccd = "CCCD phải có đúng 12 số";
    }

    if (!newStudent.ngaySinh) {
      newErrors.ngaySinh = "Ngày sinh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const studentData = {
        ...newStudent,
        taiKhoan: newStudent.maSV,
        matKhau: "huit@140ltt",
        trangThaiTaiKhoan: "KichHoat",
      };

      const response = await fetch(
        "http://localhost:8080/api/student-accounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const updatedResponse = await fetch(
        "http://localhost:8080/api/student-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setStudents(updatedData.result.filter((student) => student !== null));
      }

      setShowAddStudentOverlay(false);
      setNewStudent({
        maSV: "",
        hoTen: "",
        lop: "",
        khoa: "",
        sdt: "",
        email: "",
        gioiTinh: "Nam",
        diaChiThuongTru: "",
        doiTuongUuTien: "Không",
        trangThaiSinhVien: "Rời đi",
        ngaySinh: "",
        cccd: "",
      });

      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    } catch (error) {
      setErrors({ submit: "Không thể tạo sinh viên. Vui lòng thử lại sau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddStudent = () => {
    setShowAddStudentOverlay(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent({
      ...student,
      matKhau: "",
    });
    setShowEditStudentOverlay(true);
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editingStudent.hoTen) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!editingStudent.lop) {
      newErrors.lop = "Lớp không được để trống";
    }

    if (!editingStudent.khoa) {
      newErrors.khoa = "Khoa không được để trống";
    }

    if (!editingStudent.sdt) {
      newErrors.sdt = "Số điện thoại không được để trống";
    } else if (!/^0\d{9,10}$/.test(editingStudent.sdt)) {
      newErrors.sdt =
        "Số điện thoại phải bắt đầu bằng số 0 và có tối đa 11 ký tự";
    }

    if (!editingStudent.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingStudent.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    setIsEditSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const studentData = {
        ...editingStudent,
        matKhau: editingStudent.matKhau || undefined,
      };

      const response = await fetch(
        `http://localhost:8080/api/student-accounts/${editingStudent.maSV}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedResponse = await fetch(
        "http://localhost:8080/api/student-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setStudents(updatedData.result.filter((student) => student !== null));
      }

      setShowEditStudentOverlay(false);
      setEditingStudent(null);

      setShowEditSuccessNotification(true);
      setTimeout(() => {
        setShowEditSuccessNotification(false);
      }, 3000);
    } catch (error) {
      setEditErrors({
        submit: "Không thể cập nhật thông tin sinh viên. Vui lòng thử lại sau.",
      });
      setShowEditErrorNotification(true);
      setTimeout(() => {
        setShowEditErrorNotification(false);
      }, 3000);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (editErrors[name]) {
      setEditErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDeleteStudent = (student) => {
    setDeletingStudent(student);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;

    setIsDeleting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.access_token;

      const response = await fetch(
        `http://localhost:8080/api/student-accounts/${deletingStudent.maSV}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      const updatedResponse = await fetch(
        "http://localhost:8080/api/student-accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.code === 0 && updatedData.result) {
        setStudents(updatedData.result.filter((student) => student !== null));
      }

      setShowDeleteConfirm(false);
      setDeletingStudent(null);

      setShowDeleteSuccessNotification(true);
      setTimeout(() => {
        setShowDeleteSuccessNotification(false);
      }, 3000);
    } catch (error) {
      setShowDeleteErrorNotification(true);
      setTimeout(() => {
        setShowDeleteErrorNotification(false);
      }, 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="p-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
            Quản lý sinh viên
          </h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAddStudent}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm sinh viên</span>
            </button>
            {/* <button
              onClick={handleExportData}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download size={18} />
              <span>Xuất Excel</span>
            </button>
            <button
              onClick={handleImportData}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Upload size={18} />
              <span>Nhập Excel</span>
            </button> */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã SV"
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative">
              <select
                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang ở">Đang ở</option>
                <option value="Rời đi">Rời đi</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Mã SV</th>
                  <th className="py-3 px-4 text-left">Họ và tên</th>
                  <th className="py-3 px-4 text-left">Lớp</th>
                  <th className="py-3 px-4 text-left">Phòng</th>
                  <th className="py-3 px-4 text-left">Ngày sinh</th>
                  <th className="py-3 px-4 text-left">Giới tính</th>
                  <th className="py-3 px-4 text-left">Số điện thoại</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{student.maSV}</td>
                      <td className="py-3 px-4 font-medium">{student.hoTen}</td>
                      <td className="py-3 px-4">{student.lop}</td>
                      <td className="py-3 px-4">
                        {student.maPhong || "Chưa phân phòng"}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(student.ngaySinh)}
                      </td>
                      <td className="py-3 px-4">{student.gioiTinh}</td>
                      <td className="py-3 px-4">
                        {student.sdt || "Chưa cập nhật"}
                      </td>
                      <td className="py-3 px-4">{student.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            getStatusDisplay(student.trangThaiSinhVien) ===
                            "Đang ở"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getStatusDisplay(student.trangThaiSinhVien)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-6 text-center text-gray-500">
                      Không tìm thấy sinh viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {filteredStudents.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstStudent + 1} đến{" "}
                {Math.min(indexOfLastStudent, filteredStudents.length)} trong
                tổng số {filteredStudents.length} sinh viên
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}
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

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Thêm sinh viên thành công!</span>
          </div>
        )}

        {/* Edit Success Notification */}
        {showEditSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Cập nhật thông tin sinh viên thành công!</span>
          </div>
        )}

        {/* Edit Error Notification */}
        {showEditErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>Không thể cập nhật thông tin sinh viên!</span>
          </div>
        )}

        {/* Delete Success Notification */}
        {showDeleteSuccessNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Xóa sinh viên thành công!</span>
          </div>
        )}

        {/* Delete Error Notification */}
        {showDeleteErrorNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>Không thể xóa sinh viên!</span>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && deletingStudent && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
                Xác nhận xóa sinh viên
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sinh viên {deletingStudent.hoTen} (Mã
                SV: {deletingStudent.maSV})? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingStudent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Đang xử lý..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Student Overlay */}
        {showAddStudentOverlay && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Thêm sinh viên mới</h2>
                <button
                  onClick={() => setShowAddStudentOverlay(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã sinh viên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="maSV"
                      value={newStudent.maSV}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.maSV ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.maSV && (
                      <p className="text-red-500 text-xs mt-1">{errors.maSV}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hoTen"
                      value={newStudent.hoTen}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.hoTen ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.hoTen && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.hoTen}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lop"
                      value={newStudent.lop}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.lop ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lop && (
                      <p className="text-red-500 text-xs mt-1">{errors.lop}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoa <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="khoa"
                      value={newStudent.khoa}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.khoa ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Chọn khoa</option>
                      {facultyList.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                    {errors.khoa && (
                      <p className="text-red-500 text-xs mt-1">{errors.khoa}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sdt"
                      value={newStudent.sdt}
                      onChange={handleInputChange}
                      maxLength={11}
                      className={`w-full p-2 border rounded-lg ${
                        errors.sdt ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.sdt && (
                      <p className="text-red-500 text-xs mt-1">{errors.sdt}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gioiTinh"
                      value={newStudent.gioiTinh}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="ngaySinh"
                      value={newStudent.ngaySinh}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.ngaySinh ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.ngaySinh && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ngaySinh}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CCCD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cccd"
                      value={newStudent.cccd}
                      onChange={handleInputChange}
                      maxLength={12}
                      className={`w-full p-2 border rounded-lg ${
                        errors.cccd ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cccd && (
                      <p className="text-red-500 text-xs mt-1">{errors.cccd}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ thường trú
                    </label>
                    <input
                      type="text"
                      name="diaChiThuongTru"
                      value={newStudent.diaChiThuongTru}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đối tượng ưu tiên
                    </label>
                    <select
                      name="doiTuongUuTien"
                      value={newStudent.doiTuongUuTien}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Không">Không</option>
                      <option value="Có">Có</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái sinh viên
                    </label>
                    <select
                      name="trangThaiSinhVien"
                      value={newStudent.trangThaiSinhVien}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Đang ở">Đang ở</option>
                      <option value="Rời đi">Rời đi</option>
                    </select>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentOverlay(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Thêm sinh viên"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Overlay */}
        {showEditStudentOverlay && editingStudent && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[90%] max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Chỉnh sửa thông tin sinh viên
                </h2>
                <button
                  onClick={() => {
                    setShowEditStudentOverlay(false);
                    setEditingStudent(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã sinh viên
                    </label>
                    <input
                      type="text"
                      value={editingStudent.maSV}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="matKhau"
                      value={editingStudent.matKhau}
                      onChange={handleEditInputChange}
                      placeholder="Để trống nếu không muốn thay đổi"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hoTen"
                      value={editingStudent.hoTen}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.hoTen ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {editErrors.hoTen && (
                      <p className="text-red-500 text-xs mt-1">
                        {editErrors.hoTen}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lop"
                      value={editingStudent.lop}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.lop ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {editErrors.lop && (
                      <p className="text-red-500 text-xs mt-1">
                        {editErrors.lop}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoa <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="khoa"
                      value={editingStudent.khoa}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.khoa ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Chọn khoa</option>
                      {facultyList.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                    {editErrors.khoa && (
                      <p className="text-red-500 text-xs mt-1">
                        {editErrors.khoa}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sdt"
                      value={editingStudent.sdt}
                      onChange={handleEditInputChange}
                      maxLength={11}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.sdt ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {editErrors.sdt && (
                      <p className="text-red-500 text-xs mt-1">
                        {editErrors.sdt}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingStudent.email}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {editErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {editErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gioiTinh"
                      value={editingStudent.gioiTinh}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ thường trú
                    </label>
                    <input
                      type="text"
                      name="diaChiThuongTru"
                      value={editingStudent.diaChiThuongTru}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đối tượng ưu tiên
                    </label>
                    <select
                      name="doiTuongUuTien"
                      value={editingStudent.doiTuongUuTien}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Không">Không</option>
                      <option value="Có">Có</option>
                    </select>
                  </div>
                </div>

                {editErrors.submit && (
                  <p className="text-red-500 text-sm mt-4">
                    {editErrors.submit}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditStudentOverlay(false);
                      setEditingStudent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isEditSubmitting ? "Đang xử lý..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default StudentManager;
