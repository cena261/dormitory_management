package cena.dorm_management.Dorm_Admin.dto.request;

import cena.dorm_management.Dorm_Admin.entity.Account;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentAccountRequestDto {
    @NotBlank(message = "USERNAME_INVALID")
    String taiKhoan;

    @NotBlank(message = "PASSWORD_INVALID")
    String matKhau;

    @NotBlank(message = "USER_NOT_EXISTED")
    String maSV;

    String hoTen;
    String lop;
    String khoa;
    String sdt;
    String email;
    String gioiTinh;
    String diaChiThuongTru;
    String doiTuongUuTien;
    String trangThaiSinhVien;

    Date ngaySinh;
    String cccd;

    Account.TrangThai trangThaiTaiKhoan;
}
