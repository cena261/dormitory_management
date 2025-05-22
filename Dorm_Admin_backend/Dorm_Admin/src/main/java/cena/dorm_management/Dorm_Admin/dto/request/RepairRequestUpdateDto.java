package cena.dorm_management.Dorm_Admin.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RepairRequestUpdateDto {
    String trangThai;
    Date ngayXuLy;
    Date ngayHoanThanh;
    BigDecimal chiPhi;
    String ghiChu;
    String maQLXuLy;
}

