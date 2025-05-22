package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestCreateDto;
import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestUpdateDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.dto.response.RepairRequestResponseDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RepairRequestService {
    RepairRequestResponseDto create(String username, RepairRequestCreateDto dto);
    List<RepairRequestResponseDto> getAll();
    RepairRequestResponseDto update(String maYeuCau, RepairRequestUpdateDto dto);
    List<RepairRequestResponseDto> getAll(String trangThai);
    PagedResponse<RepairRequestResponseDto> filterPaged(
            String trangThai,
            String maPhong,
            String maSV,
            Pageable pageable
    );
    void deleteById(String maYeuCau);
}

