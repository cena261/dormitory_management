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
public class ElectricWaterResponseDto {
    String maChiTietDN;
    String kyGhiSo;
    Date ngayGhiSo;
    Integer chiSoDienDau;
    Integer chiSoDienCuoi;
    Integer chiSoNuocDau;
    Integer chiSoNuocCuoi;
    BigDecimal donGiaDien;
    BigDecimal donGiaNuoc;
    BigDecimal thanhTienDien;
    BigDecimal thanhTienNuoc;
    BigDecimal tongTien;
    String maPhong;
    String maQuanLyGhi;
}

