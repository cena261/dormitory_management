package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.StudentAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentAccountResponseDto;
import cena.dorm_management.Dorm_Admin.service.StudentAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentAccountController {

    StudentAccountService studentAccountService;

    @PostMapping
    public ApiResponse<StudentAccountResponseDto> createStudent(@Valid @RequestBody StudentAccountRequestDto dto) {
        var result = studentAccountService.createStudentAccount(dto);
        return ApiResponse.<StudentAccountResponseDto>builder()
                .message("Tạo tài khoản sinh viên thành công")
                .result(result)
                .build();
    }
    @GetMapping
    public ApiResponse<List<StudentAccountResponseDto>> getAllStudents() {
        var result = studentAccountService.getAllStudentAccounts();
        return ApiResponse.<List<StudentAccountResponseDto>>builder()
                .message("Lấy danh sách sinh viên thành công")
                .result(result)
                .build();
    }

    @PutMapping("/{maSV}")
    public ApiResponse<StudentAccountResponseDto> updateStudent(
            @PathVariable String maSV,
            @Valid @RequestBody StudentAccountRequestDto dto) {
        var result = studentAccountService.updateStudentAccount(maSV, dto);
        return ApiResponse.<StudentAccountResponseDto>builder()
                .message("Cập nhật thông tin sinh viên thành công")
                .result(result)
                .build();
    }

    @PutMapping("/{maSV}/disable")
    public ApiResponse<?> disableStudent(@PathVariable String maSV) {
        studentAccountService.disableStudentAccount(maSV);
        return ApiResponse.builder()
                .code(0)
                .message("Vô hiệu hóa tài khoản sinh viên thành công")
                .build();
    }

    @DeleteMapping("/{maSV}")
    public ApiResponse<Void> deleteStudent(@PathVariable String maSV) {
        studentAccountService.deleteStudentAccount(maSV);
        return ApiResponse.<Void>builder()
                .message("Xóa tài khoản sinh viên thành công")
                .build();
    }

}
