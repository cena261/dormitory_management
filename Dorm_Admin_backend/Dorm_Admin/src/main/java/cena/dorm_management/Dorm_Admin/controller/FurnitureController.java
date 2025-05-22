package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.FurnitureRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.FurnitureResponseDto;
import cena.dorm_management.Dorm_Admin.service.FurnitureService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/furniture")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FurnitureController {

    FurnitureService service;

    @PostMapping
    public ApiResponse<FurnitureResponseDto> create(@RequestBody FurnitureRequestDto dto) {
        return ApiResponse.<FurnitureResponseDto>builder()
                .message("Thêm vật dụng thành công")
                .result(service.create(dto))
                .build();
    }

    @PutMapping("/{maVatDung}")
    public ApiResponse<FurnitureResponseDto> update(
            @PathVariable String maVatDung,
            @RequestBody FurnitureRequestDto dto
    ) {
        return ApiResponse.<FurnitureResponseDto>builder()
                .message("Cập nhật vật dụng thành công")
                .result(service.update(maVatDung, dto))
                .build();
    }

    @PutMapping("/{maVatDung}/status")
    public ApiResponse<FurnitureResponseDto> updateStatus(
            @PathVariable String maVatDung,
            @RequestParam String tinhTrang
    ) {
        return ApiResponse.<FurnitureResponseDto>builder()
                .message("Cập nhật tình trạng vật dụng thành công")
                .result(service.updateStatus(maVatDung, tinhTrang))
                .build();
    }

    @GetMapping("/room/{maPhong}")
    public ApiResponse<List<FurnitureResponseDto>> getByRoom(@PathVariable String maPhong) {
        return ApiResponse.<List<FurnitureResponseDto>>builder()
                .message("Danh sách vật dụng trong phòng")
                .result(service.getByRoom(maPhong))
                .build();
    }

    @DeleteMapping("/{maVatDung}")
    public ApiResponse<?> delete(@PathVariable String maVatDung) {
        service.delete(maVatDung);
        return ApiResponse.builder()
                .message("Xoá vật dụng thành công")
                .build();
    }
}

