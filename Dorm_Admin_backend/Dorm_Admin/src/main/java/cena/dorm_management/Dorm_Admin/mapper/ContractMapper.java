package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.ContractRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ContractResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ContractMapper {

    @Mapping(target = "maHopDong", ignore = true)
    @Mapping(target = "maSV", ignore = true)
    @Mapping(target = "maPhong", ignore = true)
    @Mapping(target = "maQuanLyLap", ignore = true)
    Contract toEntity(ContractRequestDto dto);

    @Mapping(source = "maSV.maSV", target = "maSV")
    @Mapping(source = "maPhong.maPhong", target = "maPhong")
    @Mapping(source = "maQuanLyLap.maQL", target = "maQuanLyLap")
    ContractResponseDto toDto(Contract entity);
}

