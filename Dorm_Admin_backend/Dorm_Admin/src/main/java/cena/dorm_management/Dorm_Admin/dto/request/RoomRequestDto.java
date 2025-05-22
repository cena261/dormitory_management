package cena.dorm_management.Dorm_Admin.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequestDto {
    String maPhong;
    int tang;
    int soNguoiHienTai;
    String trangThai;
    BigDecimal giaPhong;
    float dienTich;
    String moTa;
    String maLoaiPhong;
    String maKhu;
}
