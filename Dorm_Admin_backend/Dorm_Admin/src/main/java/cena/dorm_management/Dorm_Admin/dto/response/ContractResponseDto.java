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
public class ContractResponseDto {
    String maHopDong;
    LocalDate ngayLap;
    LocalDate ngayBatDau;
    LocalDate ngayKetThucDuKien;
    LocalDate ngayKetThucThucTe;
    BigDecimal tienCoc;
    String status;
    String maSV;
    String maPhong;
    String maQuanLyLap;
}

