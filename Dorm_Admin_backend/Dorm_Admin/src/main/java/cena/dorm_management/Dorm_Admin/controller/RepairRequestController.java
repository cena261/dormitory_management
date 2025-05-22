package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestCreateDto;
import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestUpdateDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.dto.response.RepairRequestResponseDto;
import cena.dorm_management.Dorm_Admin.service.RepairRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.security.Principal;

@RestController
@RequestMapping("/repair-requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RepairRequestController {

    RepairRequestService service;

    @PostMapping
    public ApiResponse<RepairRequestResponseDto> create(
            @RequestBody RepairRequestCreateDto dto,
            Principal principal
    ) {
        return ApiResponse.<RepairRequestResponseDto>builder()
                .message("Yêu cầu đã được gửi")
                .result(service.create(principal.getName(), dto))
                .build();
    }

    @PutMapping("/{maYeuCau}")
    public ApiResponse<RepairRequestResponseDto> update(
            @PathVariable String maYeuCau,
            @RequestBody RepairRequestUpdateDto dto
    ) {
        return ApiResponse.<RepairRequestResponseDto>builder()
                .message("Cập nhật yêu cầu thành công")
                .result(service.update(maYeuCau, dto))
                .build();
    }

    @GetMapping("/paged")
    public ApiResponse<PagedResponse<RepairRequestResponseDto>> getPagedFiltered(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maPhong,
            @RequestParam(required = false) String maSV,
            Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<RepairRequestResponseDto>>builder()
                .message("Danh sách yêu cầu có phân trang")
                .result(service.filterPaged(trangThai, maPhong, maSV, pageable))
                .build();
    }

    @DeleteMapping("/{maYeuCau}")
    public ApiResponse<Void> deleteRepairRequest(@PathVariable String maYeuCau) {
        service.deleteById(maYeuCau);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Xóa yêu cầu sửa chữa thành công")
                .build();
    }

}

