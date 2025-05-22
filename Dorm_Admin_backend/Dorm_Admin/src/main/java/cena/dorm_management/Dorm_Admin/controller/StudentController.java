package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;
import cena.dorm_management.Dorm_Admin.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentController {
    StudentService studentService;

    @GetMapping("/me")
    public ApiResponse<StudentResponseDto> getCurrentStudent(HttpServletRequest request) {
        String username = request.getUserPrincipal().getName();
        StudentResponseDto student = studentService.getCurrentStudent(username);
        return ApiResponse.<StudentResponseDto>builder()
                .message("Lấy thông tin sinh viên thành công")
                .result(student)
                .build();
    }
}
