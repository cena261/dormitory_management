package cena.dorm_management.Dorm_Admin.configuration;

import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.repository.AccountRepository;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    AccountRepository accountRepository;
    AdministratorRepository administratorRepository;

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            String defaultUsername = "admin";

            if (accountRepository.findByTaiKhoan(defaultUsername).isEmpty()) {
                Administrator admin = new Administrator();
                admin.setMaQL("QL_DEFAULT");
                admin.setHoTen("Quản trị viên hệ thống");
                admin.setChucVu("Admin hệ thống");
                admin.setEmail("admin@ktx.edu.vn");
                admin.setSdt("0123456789");

                Account account = new Account();
                account.setTaiKhoan(defaultUsername);
                account.setMatKhau(passwordEncoder.encode("admin"));
                account.setVaiTro(Account.VaiTro.QuanTriVien);
                account.setTrangThaiTaiKhoan(Account.TrangThai.KichHoat);
                account.setQuanLy(admin);

                admin.setAccount(account);

                administratorRepository.save(admin);

                log.warn("✅ Tài khoản mặc định [admin/admin] đã được tạo. Vui lòng thay đổi mật khẩu ngay.");
            }
        };
    }
}
