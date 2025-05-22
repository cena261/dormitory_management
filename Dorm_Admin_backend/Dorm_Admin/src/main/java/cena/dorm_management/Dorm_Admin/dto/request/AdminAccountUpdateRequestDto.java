package cena.dorm_management.Dorm_Admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminAccountUpdateRequestDto {

    @NotBlank(message = "USERNAME_INVALID")
    String taiKhoan;

    @NotBlank(message = "PASSWORD_INVALID")
    String matKhau;

    @NotBlank(message = "USER_NOT_EXISTED")
    String maQL;

    String hoTen;
    String chucVu;
    String email;
    String sdt;
}
