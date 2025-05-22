package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.AreaRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AreaResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Area;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class AreaMapperImpl implements AreaMapper {

    @Override
    public Area toEntity(AreaRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Area area = new Area();

        area.setMaKhu( dto.getMaKhu() );
        area.setTenKhu( dto.getTenKhu() );
        area.setSoTang( dto.getSoTang() );

        return area;
    }

    @Override
    public AreaResponseDto toDto(Area entity) {
        if ( entity == null ) {
            return null;
        }

        AreaResponseDto.AreaResponseDtoBuilder areaResponseDto = AreaResponseDto.builder();

        areaResponseDto.maKhu( entity.getMaKhu() );
        areaResponseDto.tenKhu( entity.getTenKhu() );
        areaResponseDto.soTang( entity.getSoTang() );

        return areaResponseDto.build();
    }
}
