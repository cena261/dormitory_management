package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.ContractRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ContractResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Contract;
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
public class ContractMapperImpl implements ContractMapper {

    @Override
    public Contract toEntity(ContractRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Contract contract = new Contract();

        contract.setNgayLap( dto.getNgayLap() );
        contract.setNgayBatDau( dto.getNgayBatDau() );
        contract.setNgayKetThucDuKien( dto.getNgayKetThucDuKien() );
        contract.setTienCoc( dto.getTienCoc() );

        return contract;
    }

    @Override
    public ContractResponseDto toDto(Contract entity) {
        if ( entity == null ) {
            return null;
        }

        ContractResponseDto.ContractResponseDtoBuilder contractResponseDto = ContractResponseDto.builder();

        contractResponseDto.maSV( entityMaSVMaSV( entity ) );
        contractResponseDto.maPhong( entityMaPhongMaPhong( entity ) );
        contractResponseDto.maQuanLyLap( entityMaQuanLyLapMaQL( entity ) );
        contractResponseDto.maHopDong( entity.getMaHopDong() );
        contractResponseDto.ngayLap( entity.getNgayLap() );
        contractResponseDto.ngayBatDau( entity.getNgayBatDau() );
        contractResponseDto.ngayKetThucDuKien( entity.getNgayKetThucDuKien() );
        contractResponseDto.ngayKetThucThucTe( entity.getNgayKetThucThucTe() );
        contractResponseDto.tienCoc( entity.getTienCoc() );
        contractResponseDto.status( entity.getStatus() );

        return contractResponseDto.build();
    }

    private String entityMaSVMaSV(Contract contract) {
        Student maSV = contract.getMaSV();
        if ( maSV == null ) {
            return null;
        }
        return maSV.getMaSV();
    }

    private String entityMaPhongMaPhong(Contract contract) {
        Room maPhong = contract.getMaPhong();
        if ( maPhong == null ) {
            return null;
        }
        return maPhong.getMaPhong();
    }

    private String entityMaQuanLyLapMaQL(Contract contract) {
        Administrator maQuanLyLap = contract.getMaQuanLyLap();
        if ( maQuanLyLap == null ) {
            return null;
        }
        return maQuanLyLap.getMaQL();
    }
}
