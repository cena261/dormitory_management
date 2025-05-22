package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.ElectricWaterRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ElectricWaterResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface ElectricWaterService {
    ElectricWaterResponseDto create(ElectricWaterRequestDto dto);
    PagedResponse<ElectricWaterResponseDto> filter(String kyGhiSo, String maPhong, String maQuanLyGhi, Pageable pageable);
    ElectricWaterResponseDto update(String maChiTietDN, ElectricWaterRequestDto dto);
    ElectricWaterResponseDto attachToInvoice(String maChiTietDN, String maHoaDon);

}
