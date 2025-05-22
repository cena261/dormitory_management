package cena.dorm_management.Dorm_Admin.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FurnitureRequestDto {
    String maVatDung;
    String tenVatDung;
    String moTa;
    String tinhTrang; // HoatDong, Hong, CanSua
    LocalDate ngayNhap;
    BigDecimal giaTri;
    String maPhong;
}

