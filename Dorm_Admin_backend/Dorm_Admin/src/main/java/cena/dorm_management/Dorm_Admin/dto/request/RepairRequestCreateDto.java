package cena.dorm_management.Dorm_Admin.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RepairRequestCreateDto {
    String noiDung;
    String maPhong;
}

