package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.RoomTypeRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomTypeResponseDto;
import cena.dorm_management.Dorm_Admin.entity.RoomType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class RoomTypeMapperImpl implements RoomTypeMapper {

    @Override
    public RoomType toEntity(RoomTypeRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        RoomType roomType = new RoomType();

        roomType.setMaLoaiPhong( dto.getMaLoaiPhong() );
        roomType.setSoNguoiToiDa( dto.getSoNguoiToiDa() );

        return roomType;
    }

    @Override
    public RoomTypeResponseDto toDto(RoomType entity) {
        if ( entity == null ) {
            return null;
        }

        RoomTypeResponseDto.RoomTypeResponseDtoBuilder roomTypeResponseDto = RoomTypeResponseDto.builder();

        roomTypeResponseDto.maLoaiPhong( entity.getMaLoaiPhong() );
        roomTypeResponseDto.soNguoiToiDa( entity.getSoNguoiToiDa() );

        return roomTypeResponseDto.build();
    }
}
