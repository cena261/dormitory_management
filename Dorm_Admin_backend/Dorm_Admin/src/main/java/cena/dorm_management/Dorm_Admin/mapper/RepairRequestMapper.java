package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.RepairRequestResponseDto;
import cena.dorm_management.Dorm_Admin.entity.RepairRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RepairRequestMapper {

    @Mapping(source = "phong.maPhong", target = "maPhong")
    @Mapping(source = "maSV.maSV", target = "maSV")
    @Mapping(source = "quanLy.maQL", target = "maQLXuLy")
    RepairRequestResponseDto toDto(RepairRequest entity);
}


