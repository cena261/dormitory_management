package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.RoomTypeRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomTypeResponseDto;
import cena.dorm_management.Dorm_Admin.entity.RoomType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomTypeMapper {
    RoomType toEntity(RoomTypeRequestDto dto);
    RoomTypeResponseDto toDto(RoomType entity);
}

