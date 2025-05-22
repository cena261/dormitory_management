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
public class ContractRequestDto {
    LocalDate ngayLap;
    LocalDate ngayBatDau;
    LocalDate ngayKetThucDuKien;
    BigDecimal tienCoc;
    String maSV;
    String maPhong;
    String maQuanLyLap;
}

