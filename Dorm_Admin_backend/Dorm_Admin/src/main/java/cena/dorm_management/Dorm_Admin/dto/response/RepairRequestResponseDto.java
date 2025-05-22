package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RepairRequestResponseDto {
    String maYeuCau;
    String noiDung;
    String maPhong;
    String maSV;
    String trangThai;
    String mucDoUuTien;
    Date ngayYeuCau;
    Date ngayXuLy;
    Date ngayHoanThanh;
    BigDecimal chiPhi;
    String ghiChu;
    String maQLXuLy;
}

