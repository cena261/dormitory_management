package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyRoomResponseDto {
    String maPhong;
    String maLoaiPhong;
    String maKhu;
    int soNguoiHienTai;
    BigDecimal giaPhong;
    int tang;
}

