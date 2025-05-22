package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FurnitureResponseDto {
    String maVatDung;
    String tenVatDung;
    String moTa;
    String tinhTrang;
    LocalDate ngayNhap;
    BigDecimal giaTri;
    String maPhong;
}


