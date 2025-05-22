package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.StudentAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentAccountResponseDto;

import java.util.List;

public interface StudentAccountService {
    StudentAccountResponseDto createStudentAccount(StudentAccountRequestDto dto);
    List<StudentAccountResponseDto> getAllStudentAccounts();
    StudentAccountResponseDto updateStudentAccount(String maSV, StudentAccountRequestDto dto);
    void deleteStudentAccount(String maSV);
    void disableStudentAccount(String maSV);

}
