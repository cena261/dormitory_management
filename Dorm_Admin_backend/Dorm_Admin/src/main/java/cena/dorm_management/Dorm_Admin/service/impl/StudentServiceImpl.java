package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.StudentMapper;
import cena.dorm_management.Dorm_Admin.repository.AccountRepository;
import cena.dorm_management.Dorm_Admin.service.StudentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentServiceImpl implements StudentService {
    AccountRepository accountRepository;
    StudentMapper studentMapper;

    @Override
    public StudentResponseDto getCurrentStudent(String username) {
        Account account = accountRepository.findByTaiKhoan(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!account.isSinhVien() || account.getSinhVien() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return studentMapper.toStudentResponse(account.getSinhVien());
    }

}
