package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.FurnitureRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.FurnitureResponseDto;
import cena.dorm_management.Dorm_Admin.entity.AvailableFurniture;
import cena.dorm_management.Dorm_Admin.entity.Room;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class FurnitureMapperImpl implements FurnitureMapper {

    @Override
    public AvailableFurniture toEntity(FurnitureRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        AvailableFurniture availableFurniture = new AvailableFurniture();

        availableFurniture.setMaVatDung( dto.getMaVatDung() );
        availableFurniture.setTenVatDung( dto.getTenVatDung() );
        availableFurniture.setMoTa( dto.getMoTa() );
        if ( dto.getTinhTrang() != null ) {
            availableFurniture.setTinhTrang( Enum.valueOf( AvailableFurniture.EquipmentStatus.class, dto.getTinhTrang() ) );
        }
        availableFurniture.setNgayNhap( dto.getNgayNhap() );
        availableFurniture.setGiaTri( dto.getGiaTri() );

        return availableFurniture;
    }

    @Override
    public FurnitureResponseDto toDto(AvailableFurniture entity) {
        if ( entity == null ) {
            return null;
        }

        FurnitureResponseDto.FurnitureResponseDtoBuilder furnitureResponseDto = FurnitureResponseDto.builder();

        furnitureResponseDto.maPhong( entityRoomMaPhong( entity ) );
        furnitureResponseDto.maVatDung( entity.getMaVatDung() );
        furnitureResponseDto.tenVatDung( entity.getTenVatDung() );
        furnitureResponseDto.moTa( entity.getMoTa() );
        if ( entity.getTinhTrang() != null ) {
            furnitureResponseDto.tinhTrang( entity.getTinhTrang().name() );
        }
        furnitureResponseDto.ngayNhap( entity.getNgayNhap() );
        furnitureResponseDto.giaTri( entity.getGiaTri() );

        return furnitureResponseDto.build();
    }

    private String entityRoomMaPhong(AvailableFurniture availableFurniture) {
        Room room = availableFurniture.getRoom();
        if ( room == null ) {
            return null;
        }
        return room.getMaPhong();
    }
}
