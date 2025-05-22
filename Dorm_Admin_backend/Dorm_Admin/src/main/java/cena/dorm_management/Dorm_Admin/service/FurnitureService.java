package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.FurnitureRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.FurnitureResponseDto;

import java.util.List;

public interface FurnitureService {
    FurnitureResponseDto create(FurnitureRequestDto dto);
    FurnitureResponseDto update(String maVatDung, FurnitureRequestDto dto);
    FurnitureResponseDto updateStatus(String maVatDung, String tinhTrang);
    List<FurnitureResponseDto> getByRoom(String maPhong);
    void delete(String maVatDung);
}

