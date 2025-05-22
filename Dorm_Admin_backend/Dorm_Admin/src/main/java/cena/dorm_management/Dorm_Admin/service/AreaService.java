package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.AreaRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AreaResponseDto;

import java.util.List;

public interface AreaService {
    AreaResponseDto create(AreaRequestDto dto);
    List<AreaResponseDto> getAll();
    void delete(String maKhu);
}

