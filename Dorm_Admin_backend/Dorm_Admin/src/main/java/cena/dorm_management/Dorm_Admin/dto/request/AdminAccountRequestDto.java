package cena.dorm_management.Dorm_Admin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminAccountRequestDto {

    @NotBlank(message = "USERNAME_NOT_BLANK")
    @Size(min = 3, max = 20, message = "USERNAME_INVALID")
    String taiKhoan;

    @NotBlank(message = "PASSWORD_NOT_BLANK")
    @Size(min = 6, message = "PASSWORD_REQUIREMENT")
    String matKhau;

    @NotBlank(message = "ADMIN_ID_NOT_BLANK")
    String maQL;

    @NotBlank(message = "FULL_NAME_NOT_BLANK")
    String hoTen;

    String chucVu;

    @Size(min = 10, max = 11, message = "PHONE_NUMBER_INVALID")
    String sdt;

    @Email(message = "EMAIL_INVALID")
    String email;
}
