package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponseDto {
    String maPhong;
    int tang;
    int soNguoiHienTai;
    String trangThai;
    BigDecimal giaPhong;
    float dienTich;
    String moTa;
    String maKhu;
    String maLoaiPhong;
    List<StudentBasicDto> sinhVienTrongPhong;
}

