package cena.dorm_management.Dorm_Admin.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định"),
    INVALID_KEY(1001, "Khóa không hợp lệ"),
    USER_EXISTED(1002, "Tài khoản đã tồn tại"),
    USERNAME_INVALID(1003, "Tên tài khoản phải từ 3 ký tự trở lên và ít hơn 20 ký tự"),
    PASSWORD_INVALID(1004, "Mật khẩu phải từ 8 ký tự trở lên"),
    USER_NOT_EXISTED(1005, "Tài khoản không tồn tại"),
    ADMIN_ID_EXISTED(1006, "Mã quản trị viên đã tồn tại"),
    ACCOUNT_NOT_FOUND(1007, "Không tìm thấy tài khoản"),
    USERNAME_NOT_BLANK(1008, "Tên đăng nhập không được để trống"),
    PASSWORD_NOT_BLANK(1009, "Mật khẩu không được để trống"),
    PASSWORD_REQUIREMENT(1010, "Mật khẩu phải có ít nhất 6 ký tự"),
    ADMIN_ID_NOT_BLANK(1011, "Mã quản lý không được để trống"),
    FULL_NAME_NOT_BLANK(1012, "Họ tên không được để trống"),
    PHONE_NUMBER_INVALID(1013, "Số điện thoại không hợp lệ"),
    EMAIL_INVALID(1014, "Email không hợp lệ"),
    ACCOUNT_DISABLED(1015, "Tài khoản đã bị vô hiệu hóa"),
    UNAUTHENTICATED(1016, "Unauthenticated"),
    UNAUTHORIZED(1017, "Unauthorized"),
    ROOM_ALREADY_EXISTS(1018, "Phòng đã tồn tại"),
    ROOM_NOT_FOUND(1019, "Không tìm thấy phòng"),
    ROOM_TYPE_NOT_FOUND(1020, "Loại phòng không tồn tại"),
    AREA_NOT_FOUND(1021, "Khu vực không tồn tại"),
    ROOM_IS_FULL(1022, "Phòng đã đủ số người tối đa"),
    ROOM_EMPTY(1023, "Phòng không có sinh viên"),
    STUDENT_ALREADY_ASSIGNED(1024, "Sinh viên đã ở phòng khác"),
    STUDENT_NOT_IN_THIS_ROOM(1025, "Sinh viên không thuộc phòng này"),
    ROOM_TYPE_EXISTED(1026, "Loại phòng đã tồn tại"),
    ROOM_TYPE_IN_USE(1027, "Không thể xoá vì loại phòng đang được sử dụng"),
    AREA_EXISTED(1028, "Khu vực đã tồn tại"),
    AREA_IN_USE(1029, "Không thể xoá vì khu vực đang chứa phòng"),
    FURNITURE_EXISTED(1030, "Vật dụng đã tồn tại"),
    FURNITURE_NOT_FOUND(1031, "Vật dụng không tồn tại"),
    REQUEST_NOT_FOUND(1032, "Yêu cầu sửa chữa không tồn tại"),
    ADMIN_NOT_FOUND(1033, "Không tồn tại quản lý này"),
    INVOICE_NOT_FOUND(1044, "Không tìm thấy hóa đơn"),
    CONTRACT_NOT_FOUND(1045, "Không tìm thấy hợp đồng"),
    NOTIFICATION_NOT_FOUND(1046, "Không tìm thấy thông báo"),
    ELECTRIC_DETAIL_NOT_FOUND(1047, "Không tìm thấy chi tiết điện nước"),
    DUPLICATE_ELECTRIC_DETAIL(1048, "Đã tồn tại bản ghi điện/nước cho phòng này và kỳ này"),
    REPAIR_REQUEST_NOT_FOUND(1049, "Không tìm thấy yêu cầu"),
    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
