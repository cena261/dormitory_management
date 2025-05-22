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
public class ElectricWaterRequestDto {
    String kyGhiSo;
    Date ngayGhiSo;
    Integer chiSoDienDau;
    Integer chiSoDienCuoi;
    Integer chiSoNuocDau;
    Integer chiSoNuocCuoi;
    BigDecimal donGiaDien;
    BigDecimal donGiaNuoc;
    String maPhong;
    String maQuanLyGhi;
}

