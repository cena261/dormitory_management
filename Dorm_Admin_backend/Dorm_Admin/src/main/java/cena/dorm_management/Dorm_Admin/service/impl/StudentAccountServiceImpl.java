package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.StudentAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Student;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.StudentAccountMapper;
import cena.dorm_management.Dorm_Admin.repository.AccountRepository;
import cena.dorm_management.Dorm_Admin.repository.StudentRepository;
import cena.dorm_management.Dorm_Admin.service.StudentAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentAccountServiceImpl implements StudentAccountService {

    StudentRepository studentRepository;
    AccountRepository accountRepository;
    StudentAccountMapper mapper;
    PasswordEncoder passwordEncoder;

    @Override
    public StudentAccountResponseDto createStudentAccount(StudentAccountRequestDto dto) {
        if (accountRepository.existsByTaiKhoan(dto.getTaiKhoan())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (studentRepository.existsByMaSV(dto.getMaSV())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Student student = mapper.toStudent(dto);
        Account account = mapper.toAccount(dto, new Account());

        account.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
        account.setVaiTro(Account.VaiTro.SinhVien);
        account.setTrangThaiTaiKhoan(Account.TrangThai.KichHoat);

        account.setSinhVien(student);
        student.setAccount(account);

        studentRepository.save(student);

        return mapper.toResponseDto(account);
    }

    @Override
    public List<StudentAccountResponseDto> getAllStudentAccounts() {
        return studentRepository.findAll().stream()
                .map(student -> mapper.toResponseDto(student.getAccount()))
                .toList();
    }

    @Override
    public StudentAccountResponseDto updateStudentAccount(String maSV, StudentAccountRequestDto dto) {
        Student student = studentRepository.findById(maSV)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        student.setHoTen(dto.getHoTen());
        student.setLop(dto.getLop());
        student.setKhoa(dto.getKhoa());
        student.setEmail(dto.getEmail());
        student.setSdt(dto.getSdt());
        student.setGioiTinh(dto.getGioiTinh());
        student.setDoiTuongUuTien(dto.getDoiTuongUuTien());
        student.setTrangThai(dto.getTrangThaiSinhVien());
        student.setDiaChiThuongTru(dto.getDiaChiThuongTru());

        Account account = student.getAccount();
        account.setTaiKhoan(dto.getTaiKhoan());
        account.setMatKhau(new BCryptPasswordEncoder().encode(dto.getMatKhau()));

        studentRepository.save(student);
        return mapper.toResponseDto(account);
    }

    @Override
    public void deleteStudentAccount(String maSV) {
        Student student = studentRepository.findById(maSV)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        studentRepository.delete(student);
    }

    @Override
    public void disableStudentAccount(String maSV) {
        Student student = studentRepository.findById(maSV)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Account account = student.getAccount();
        if (account == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        account.setTrangThaiTaiKhoan(Account.TrangThai.Khoa);
        accountRepository.save(account);
    }

}
