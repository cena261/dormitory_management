package cena.dorm_management.Dorm_Admin.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponseDto {
    Long id;
    String tieuDe;
    String noiDung;
    String loai;
    String trangThai;
    LocalDateTime thoiGianGui;
    String maSV;
    String maQLGui;
}

