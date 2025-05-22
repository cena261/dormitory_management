package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.NotificationRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.NotificationResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "nguoiNhan", ignore = true)
    @Mapping(target = "nguoiGui", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trangThai", ignore = true)
    @Mapping(target = "thoiGianGui", ignore = true)
    Notification toEntity(NotificationRequestDto dto);

    @Mapping(source = "nguoiNhan.maSV", target = "maSV")
    @Mapping(source = "nguoiGui.maQL", target = "maQLGui")
    NotificationResponseDto toDto(Notification entity);
}

