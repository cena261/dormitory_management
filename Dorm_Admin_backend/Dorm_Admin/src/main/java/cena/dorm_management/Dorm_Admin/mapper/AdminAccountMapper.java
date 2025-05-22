package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AdminAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminAccountMapper {

    @Mapping(target = "account", ignore = true)
    Administrator toAdministrator(AdminAccountRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vaiTro", constant = "QuanTriVien")
    @Mapping(target = "trangThaiTaiKhoan", constant = "KichHoat")
    @Mapping(target = "sinhVien", ignore = true)
    Account toAccount(AdminAccountRequestDto dto, @MappingTarget Account account);

    @Mapping(source = "quanLy.maQL", target = "maQL")
    @Mapping(source = "quanLy.hoTen", target = "hoTen")
    @Mapping(source = "quanLy.chucVu", target = "chucVu")
    @Mapping(source = "quanLy.email", target = "email")
    @Mapping(source = "quanLy.sdt", target = "sdt")
    AdminAccountResponseDto toResponseDto(Account account);
}


