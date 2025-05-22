package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.ElectricWaterRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ElectricWaterResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.ElectricWaterDetail;
import cena.dorm_management.Dorm_Admin.entity.Room;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class ElectricWaterMapperImpl implements ElectricWaterMapper {

    @Override
    public ElectricWaterDetail toEntity(ElectricWaterRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        ElectricWaterDetail electricWaterDetail = new ElectricWaterDetail();

        electricWaterDetail.setKyGhiSo( dto.getKyGhiSo() );
        electricWaterDetail.setNgayGhiSo( dto.getNgayGhiSo() );
        electricWaterDetail.setChiSoDienDau( dto.getChiSoDienDau() );
        electricWaterDetail.setChiSoDienCuoi( dto.getChiSoDienCuoi() );
        electricWaterDetail.setChiSoNuocDau( dto.getChiSoNuocDau() );
        electricWaterDetail.setChiSoNuocCuoi( dto.getChiSoNuocCuoi() );
        electricWaterDetail.setDonGiaDien( dto.getDonGiaDien() );
        electricWaterDetail.setDonGiaNuoc( dto.getDonGiaNuoc() );

        return electricWaterDetail;
    }

    @Override
    public ElectricWaterResponseDto toDto(ElectricWaterDetail entity) {
        if ( entity == null ) {
            return null;
        }

        ElectricWaterResponseDto.ElectricWaterResponseDtoBuilder electricWaterResponseDto = ElectricWaterResponseDto.builder();

        electricWaterResponseDto.maPhong( entityPhongMaPhong( entity ) );
        electricWaterResponseDto.maQuanLyGhi( entityQuanLyGhiMaQL( entity ) );
        electricWaterResponseDto.maChiTietDN( entity.getMaChiTietDN() );
        electricWaterResponseDto.kyGhiSo( entity.getKyGhiSo() );
        electricWaterResponseDto.ngayGhiSo( entity.getNgayGhiSo() );
        electricWaterResponseDto.chiSoDienDau( entity.getChiSoDienDau() );
        electricWaterResponseDto.chiSoDienCuoi( entity.getChiSoDienCuoi() );
        electricWaterResponseDto.chiSoNuocDau( entity.getChiSoNuocDau() );
        electricWaterResponseDto.chiSoNuocCuoi( entity.getChiSoNuocCuoi() );
        electricWaterResponseDto.donGiaDien( entity.getDonGiaDien() );
        electricWaterResponseDto.donGiaNuoc( entity.getDonGiaNuoc() );
        electricWaterResponseDto.thanhTienDien( entity.getThanhTienDien() );
        electricWaterResponseDto.thanhTienNuoc( entity.getThanhTienNuoc() );
        electricWaterResponseDto.tongTien( entity.getTongTien() );

        return electricWaterResponseDto.build();
    }

    private String entityPhongMaPhong(ElectricWaterDetail electricWaterDetail) {
        Room phong = electricWaterDetail.getPhong();
        if ( phong == null ) {
            return null;
        }
        return phong.getMaPhong();
    }

    private String entityQuanLyGhiMaQL(ElectricWaterDetail electricWaterDetail) {
        Administrator quanLyGhi = electricWaterDetail.getQuanLyGhi();
        if ( quanLyGhi == null ) {
            return null;
        }
        return quanLyGhi.getMaQL();
    }
}
