package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.response.AdminAccountResponseDto;
import cena.dorm_management.Dorm_Admin.service.AdminAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin-accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AdminAccountResponseDto>> createAccount(@Valid @RequestBody AdminAccountRequestDto dto) {
        AdminAccountResponseDto created = adminAccountService.createAdminAccount(dto);
        return ResponseEntity.ok(ApiResponse.<AdminAccountResponseDto>builder()
                .result(created)
                .message("Tạo tài khoản quản trị viên thành công")
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccountResponseDto>> getById(@PathVariable Integer id) {
        AdminAccountResponseDto response = adminAccountService.getById(id);
        return ResponseEntity.ok(ApiResponse.<AdminAccountResponseDto>builder()
                .result(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminAccountResponseDto>>> getAllAdmins() {
        List<AdminAccountResponseDto> response = adminAccountService.getAll();
        return ResponseEntity.ok(ApiResponse.<List<AdminAccountResponseDto>>builder()
                .result(response)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccountResponseDto>> updateAccount(
            @PathVariable Integer id,
            @Valid @RequestBody AdminAccountUpdateRequestDto dto) {
        AdminAccountResponseDto updated = adminAccountService.updateAdminAccount(id, dto);
        return ResponseEntity.ok(ApiResponse.<AdminAccountResponseDto>builder()
                .message("Cập nhật thông tin quản trị viên thành công")
                .result(updated)
                .build());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(@PathVariable Integer id) {
        adminAccountService.deactivateAccount(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Vô hiệu hóa tài khoản quản trị viên thành công")
                .build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Integer id) {
        adminAccountService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Xoá tài khoản quản trị viên thành công")
                .build());
    }

}
