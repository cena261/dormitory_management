package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AdminAccountResponseDto;

import java.util.List;

public interface AdminAccountService {

    AdminAccountResponseDto createAdminAccount(AdminAccountRequestDto dto);

    AdminAccountResponseDto getById(Integer id);

    List<AdminAccountResponseDto> getAll();

    AdminAccountResponseDto updateAdminAccount(Integer id, AdminAccountUpdateRequestDto dto);

    void deactivateAccount(Integer id);

    void deleteById(Integer id);
}
