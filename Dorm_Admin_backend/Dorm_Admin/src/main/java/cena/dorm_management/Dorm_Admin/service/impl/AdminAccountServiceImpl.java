package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AdminAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.AdminAccountMapper;
import cena.dorm_management.Dorm_Admin.repository.AccountRepository;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import cena.dorm_management.Dorm_Admin.service.AdminAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminAccountServiceImpl implements AdminAccountService {

    AccountRepository accountRepository;
    AdministratorRepository administratorRepository;
    AdminAccountMapper mapper;
    PasswordEncoder passwordEncoder;

    @Override
    public AdminAccountResponseDto createAdminAccount(AdminAccountRequestDto dto) {
        if (accountRepository.existsByTaiKhoan(dto.getTaiKhoan())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (administratorRepository.existsByMaQL(dto.getMaQL())) {
            throw new AppException(ErrorCode.ADMIN_ID_EXISTED);
        }

        Administrator admin = mapper.toAdministrator(dto);

        Account account = mapper.toAccount(dto, new Account());

        account.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));

        account.setQuanLy(admin);
        admin.setAccount(account);

        administratorRepository.save(admin);

        return mapper.toResponseDto(account);
    }

    @Override
    public AdminAccountResponseDto getById(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        return mapper.toResponseDto(account);
    }

    @Override
    public List<AdminAccountResponseDto> getAll() {
        return accountRepository.findAll().stream()
                .filter(Account::isQuanTriVien)
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AdminAccountResponseDto updateAdminAccount(Integer id, AdminAccountUpdateRequestDto dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!account.getTaiKhoan().equals(dto.getTaiKhoan()) &&
                accountRepository.existsByTaiKhoan(dto.getTaiKhoan())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        account.setTaiKhoan(dto.getTaiKhoan());
        account.setMatKhau(dto.getMatKhau());

        Administrator admin = account.getQuanLy();
        if (admin == null) throw new AppException(ErrorCode.ADMIN_ID_NOT_BLANK);

        admin.setHoTen(dto.getHoTen());
        admin.setChucVu(dto.getChucVu());
        admin.setEmail(dto.getEmail());
        admin.setSdt(dto.getSdt());

        accountRepository.save(account);

        return mapper.toResponseDto(account);
    }

    @Override
    public void deactivateAccount(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        account.setTrangThaiTaiKhoan(Account.TrangThai.Khoa);
        accountRepository.save(account);
    }

    @Override
    public void deleteById(Integer id) {
        if (!accountRepository.existsById(id)) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        accountRepository.deleteById(id);
    }
}
