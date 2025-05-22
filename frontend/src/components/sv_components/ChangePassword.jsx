import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import studentService from "../../services/student.service";
import { useAuth } from "../../contexts/AuthContext";

function PasswordChange({ isOpen, onClose }) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/[A-Za-z]/.test(password)) {
      errors.password = "Mật khẩu phải chứa ít nhất một chữ cái";
    } else if (!/\d/.test(password)) {
      errors.password = "Mật khẩu phải chứa ít nhất một số";
    }
    return errors;
  };

  const validateConfirmPassword = (confirm) => {
    const errors = {};
    if (confirm !== newPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    return errors;
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (touched.newPassword) {
      const passwordErrors = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordErrors.password }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      const confirmErrors = validateConfirmPassword(value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmErrors.confirmPassword,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "newPassword") {
      const passwordErrors = validatePassword(newPassword);
      setErrors((prev) => ({ ...prev, password: passwordErrors.password }));
    } else if (field === "confirmPassword") {
      const confirmErrors = validateConfirmPassword(confirmPassword);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmErrors.confirmPassword,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordErrors = validatePassword(newPassword);
    const confirmErrors = validateConfirmPassword(confirmPassword);
    const newErrors = {
      ...passwordErrors,
      ...confirmErrors,
    };

    setErrors(newErrors);
    setTouched({
      newPassword: true,
      confirmPassword: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyResponse = await studentService.verifyPassword(
        user.username,
        currentPassword
      );

      if (verifyResponse.code === 0) {
        const changeResponse = await studentService.changePassword(
          user.username,
          newPassword
        );

        if (changeResponse.code === 0) {
          setShowSuccessNotification(true);
          setTimeout(() => {
            setShowSuccessNotification(false);
            onClose();
          }, 2000);
        } else {
          throw new Error(
            changeResponse.message || "Không thể thay đổi mật khẩu"
          );
        }
      } else {
        throw new Error("Mật khẩu hiện tại không đúng");
      }
    } catch (error) {
      setErrorMessage(error.message || "Có lỗi xảy ra khi thay đổi mật khẩu");
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] max-w-md shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Thay đổi mật khẩu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              onBlur={() => handleBlur("newPassword")}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu mới"
            />
            {touched.newPassword && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Xác nhận mật khẩu mới"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Đổi mật khẩu thành công!</span>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default PasswordChange;
