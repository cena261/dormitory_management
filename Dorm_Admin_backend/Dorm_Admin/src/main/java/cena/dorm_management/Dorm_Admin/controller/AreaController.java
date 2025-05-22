package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.AreaRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AreaResponseDto;
import cena.dorm_management.Dorm_Admin.service.AreaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/areas")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AreaController {

    AreaService service;

    @PostMapping
    public ApiResponse<AreaResponseDto> create(@RequestBody AreaRequestDto dto) {
        return ApiResponse.<AreaResponseDto>builder()
                .message("Tạo khu vực thành công")
                .result(service.create(dto))
                .build();
    }

    @GetMapping
    public ApiResponse<List<AreaResponseDto>> getAll() {
        return ApiResponse.<List<AreaResponseDto>>builder()
                .message("Lấy danh sách khu vực thành công")
                .result(service.getAll())
                .build();
    }

    @DeleteMapping("/{maKhu}")
    public ApiResponse<?> delete(@PathVariable String maKhu) {
        service.delete(maKhu);
        return ApiResponse.builder()
                .message("Xoá khu vực thành công")
                .build();
    }
}

