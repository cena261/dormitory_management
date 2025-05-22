package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.ElectricWaterRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ElectricWaterResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.service.ElectricWaterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/electric-water")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ElectricWaterController {

    ElectricWaterService service;

    @PostMapping
    public ApiResponse<ElectricWaterResponseDto> create(@RequestBody ElectricWaterRequestDto dto) {
        return ApiResponse.<ElectricWaterResponseDto>builder()
                .message("Ghi chỉ số điện nước thành công")
                .result(service.create(dto))
                .build();
    }

    @GetMapping
    public ApiResponse<PagedResponse<ElectricWaterResponseDto>> getAll(
            @RequestParam(required = false) String kyGhiSo,
            @RequestParam(required = false) String maPhong,
            @RequestParam(required = false) String maQuanLyGhi,
            @PageableDefault(size = 10, sort = "ngayGhiSo", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<ElectricWaterResponseDto>>builder()
                .message("Danh sách bản ghi điện nước")
                .result(service.filter(kyGhiSo, maPhong, maQuanLyGhi, pageable))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ElectricWaterResponseDto> update(
            @PathVariable String id,
            @RequestBody ElectricWaterRequestDto dto
    ) {
        return ApiResponse.<ElectricWaterResponseDto>builder()
                .message("Cập nhật bản ghi điện nước thành công")
                .result(service.update(id, dto))
                .build();
    }

    @PutMapping("/{id}/attach-bill")
    public ApiResponse<ElectricWaterResponseDto> attachBill(
            @PathVariable String id,
            @RequestParam String maHoaDon
    ) {
        return ApiResponse.<ElectricWaterResponseDto>builder()
                .message("Gắn hóa đơn thành công")
                .result(service.attachToInvoice(id, maHoaDon))
                .build();
    }

}

