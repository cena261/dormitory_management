package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.ElectricWaterRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ElectricWaterResponseDto;
import cena.dorm_management.Dorm_Admin.entity.ElectricWaterDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ElectricWaterMapper {

    @Mapping(target = "maChiTietDN", ignore = true)
    @Mapping(target = "phong", ignore = true)
    @Mapping(target = "hoaDon", ignore = true)
    @Mapping(target = "quanLyGhi", ignore = true)
    @Mapping(target = "thanhTienDien", ignore = true)
    @Mapping(target = "thanhTienNuoc", ignore = true)
    @Mapping(target = "tongTien", ignore = true)
    ElectricWaterDetail toEntity(ElectricWaterRequestDto dto);

    @Mapping(source = "phong.maPhong", target = "maPhong")
    @Mapping(source = "quanLyGhi.maQL", target = "maQuanLyGhi")
    ElectricWaterResponseDto toDto(ElectricWaterDetail entity);
}

