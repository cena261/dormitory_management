package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.ContractEndDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ContractResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface ContractService {
    ContractResponseDto createContract(ContractRequestDto dto);
    PagedResponse<ContractResponseDto> getContracts(String status, String maSV, String maPhong, Pageable pageable);
    ContractResponseDto endContract(String maHopDong, ContractEndDto dto);
    ContractResponseDto getMyContract(String username);
    ContractResponseDto getById(String maHopDong);
    ContractResponseDto update(String maHopDong, ContractUpdateRequestDto dto);

}

