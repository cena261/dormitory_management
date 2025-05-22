import { useState, useEffect } from "react";
import { X } from "lucide-react";
import studentService from "../../services/student.service";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await studentService.getNotifications();
      if (response.code === 0) {
        setNotifications(response.result.content);
      } else {
        setError("Không thể tải thông báo");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);

    if (notification.trangThai === "CHUA_DOC") {
      try {
        await studentService.markNotificationAsRead(notification.id);
        // Update local state to reflect the read status
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id ? { ...n, trangThai: "DA_DOC" } : n
          )
        );
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
  };

  if (loading) {
    return <div className="flex-1 p-6">Đang tải thông báo...</div>;
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Thông báo</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  notification.trangThai === "CHUA_DOC" ? "bg-blue-50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {notification.tieuDe}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(notification.thoiGianGui)}
                    </p>
                  </div>
                  {notification.trangThai === "CHUA_DOC" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Mới
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Không có thông báo nào
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[90%] max-w-2xl shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedNotification.tieuDe}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedNotification.noiDung}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Thời gian: {formatDate(selectedNotification.thoiGianGui)}
              </p>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
