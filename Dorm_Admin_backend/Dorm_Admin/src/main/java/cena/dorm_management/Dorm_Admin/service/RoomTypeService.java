package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.RoomTypeRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomTypeResponseDto;

import java.util.List;

public interface RoomTypeService {
    RoomTypeResponseDto create(RoomTypeRequestDto dto);
    List<RoomTypeResponseDto> getAll();
    void delete(String maLoaiPhong);
}

