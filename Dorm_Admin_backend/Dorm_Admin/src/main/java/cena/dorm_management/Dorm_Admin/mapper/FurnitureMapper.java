package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.FurnitureRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.FurnitureResponseDto;
import cena.dorm_management.Dorm_Admin.entity.AvailableFurniture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FurnitureMapper {
    @Mapping(target = "room", ignore = true)
    AvailableFurniture toEntity(FurnitureRequestDto dto);

    @Mapping(source = "room.maPhong", target = "maPhong")
    FurnitureResponseDto toDto(AvailableFurniture entity);
}

