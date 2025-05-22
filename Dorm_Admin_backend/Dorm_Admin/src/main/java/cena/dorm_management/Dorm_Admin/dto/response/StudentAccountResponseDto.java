package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentAccountResponseDto {
    Integer id;
    String taiKhoan;
    String vaiTro;
    String trangThai;

    String maSV;
    String hoTen;
    String lop;
    String khoa;
    String email;
    String sdt;
    String gioiTinh;
    String diaChiThuongTru;
    String doiTuongUuTien;
    String trangThaiSinhVien;
    Date ngaySinh;
    String cccd;
    String maPhong;
}
