package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.InvoiceRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.InvoiceResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    @Mapping(target = "hopDong", ignore = true)
    @Mapping(target = "quanLyThu", ignore = true)
    @Mapping(target = "maHoaDon", ignore = true)
    @Mapping(target = "trangThai", ignore = true)
    Invoice toEntity(InvoiceRequestDto dto);

    @Mapping(source = "hopDong.maHopDong", target = "maHopDong")
    @Mapping(source = "quanLyThu.maQL", target = "maQLThu")
    InvoiceResponseDto toDto(Invoice entity);
}

