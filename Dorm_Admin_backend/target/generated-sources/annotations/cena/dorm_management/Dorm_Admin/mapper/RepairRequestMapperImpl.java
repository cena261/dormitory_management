package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.RepairRequestResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.RepairRequest;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.entity.Student;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class RepairRequestMapperImpl implements RepairRequestMapper {

    @Override
    public RepairRequestResponseDto toDto(RepairRequest entity) {
        if ( entity == null ) {
            return null;
        }

        RepairRequestResponseDto.RepairRequestResponseDtoBuilder repairRequestResponseDto = RepairRequestResponseDto.builder();

        repairRequestResponseDto.maPhong( entityPhongMaPhong( entity ) );
        repairRequestResponseDto.maSV( entityMaSVMaSV( entity ) );
        repairRequestResponseDto.maQLXuLy( entityQuanLyMaQL( entity ) );
        repairRequestResponseDto.maYeuCau( entity.getMaYeuCau() );
        repairRequestResponseDto.noiDung( entity.getNoiDung() );
        if ( entity.getTrangThai() != null ) {
            repairRequestResponseDto.trangThai( entity.getTrangThai().name() );
        }
        if ( entity.getMucDoUuTien() != null ) {
            repairRequestResponseDto.mucDoUuTien( entity.getMucDoUuTien().name() );
        }
        repairRequestResponseDto.ngayYeuCau( entity.getNgayYeuCau() );
        repairRequestResponseDto.ngayXuLy( entity.getNgayXuLy() );
        repairRequestResponseDto.ngayHoanThanh( entity.getNgayHoanThanh() );
        repairRequestResponseDto.chiPhi( entity.getChiPhi() );
        repairRequestResponseDto.ghiChu( entity.getGhiChu() );

        return repairRequestResponseDto.build();
    }

    private String entityPhongMaPhong(RepairRequest repairRequest) {
        Room phong = repairRequest.getPhong();
        if ( phong == null ) {
            return null;
        }
        return phong.getMaPhong();
    }

    private String entityMaSVMaSV(RepairRequest repairRequest) {
        Student maSV = repairRequest.getMaSV();
        if ( maSV == null ) {
            return null;
        }
        return maSV.getMaSV();
    }

    private String entityQuanLyMaQL(RepairRequest repairRequest) {
        Administrator quanLy = repairRequest.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getMaQL();
    }
}
