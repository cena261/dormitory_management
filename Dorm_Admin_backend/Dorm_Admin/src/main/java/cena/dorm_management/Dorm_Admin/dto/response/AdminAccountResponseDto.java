package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminAccountResponseDto {
    Integer id;
    String taiKhoan;
    String vaiTro;
    String trangThai;
    String maQL;
    String hoTen;
    String chucVu;
    String email;
    String sdt;
}
