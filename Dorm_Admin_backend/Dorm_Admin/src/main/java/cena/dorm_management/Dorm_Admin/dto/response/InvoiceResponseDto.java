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
public class InvoiceResponseDto {
    String maHoaDon;
    String loaiHoaDon;
    Date ngayLap;
    String kyThanhToan;
    BigDecimal soTien;
    Date hanThanhToan;
    Date ngayThanhToan;
    String trangThai;
    String maHopDong;
    String maQLThu;
}

