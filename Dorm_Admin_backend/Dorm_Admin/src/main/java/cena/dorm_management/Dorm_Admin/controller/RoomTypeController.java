package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.RoomTypeRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomTypeResponseDto;
import cena.dorm_management.Dorm_Admin.service.RoomTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomTypeController {

    RoomTypeService service;

    @PostMapping
    public ApiResponse<RoomTypeResponseDto> create(@RequestBody RoomTypeRequestDto dto) {
        return ApiResponse.<RoomTypeResponseDto>builder()
                .message("Tạo loại phòng thành công")
                .result(service.create(dto))
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoomTypeResponseDto>> getAll() {
        return ApiResponse.<List<RoomTypeResponseDto>>builder()
                .message("Lấy danh sách loại phòng thành công")
                .result(service.getAll())
                .build();
    }

    @DeleteMapping("/{maLoaiPhong}")
    public ApiResponse<?> delete(@PathVariable String maLoaiPhong) {
        service.delete(maLoaiPhong);
        return ApiResponse.builder()
                .message("Xoá loại phòng thành công")
                .build();
    }
}

