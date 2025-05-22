package cena.dorm_management.Dorm_Admin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaRequestDto {
    private String maKhu;
    private String tenKhu;
    private int soTang;
}

