package cena.dorm_management.Dorm_Admin.dto.response;

import cena.dorm_management.Dorm_Admin.entity.Account;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentResponseDto {
    String maSV;
    String hoTen;
    String lop;
    String khoa;
    String email;
    String sdt;
    String gioiTinh;
    String diaChiThuongTru;
    String doiTuongUuTien;
    String trangThai;
    Account.TrangThai trangThaiTaiKhoan;
}
