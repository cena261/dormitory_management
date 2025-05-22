package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.AreaRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AreaResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Area;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AreaMapper {
    Area toEntity(AreaRequestDto dto);
    AreaResponseDto toDto(Area entity);
}

