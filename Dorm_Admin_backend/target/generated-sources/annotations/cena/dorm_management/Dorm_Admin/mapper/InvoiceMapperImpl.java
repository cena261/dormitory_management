package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.InvoiceRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.InvoiceResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Contract;
import cena.dorm_management.Dorm_Admin.entity.Invoice;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

    @Override
    public Invoice toEntity(InvoiceRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Invoice invoice = new Invoice();

        invoice.setLoaiHoaDon( dto.getLoaiHoaDon() );
        invoice.setNgayLap( dto.getNgayLap() );
        invoice.setKyThanhToan( dto.getKyThanhToan() );
        invoice.setSoTien( dto.getSoTien() );
        invoice.setHanThanhToan( dto.getHanThanhToan() );

        return invoice;
    }

    @Override
    public InvoiceResponseDto toDto(Invoice entity) {
        if ( entity == null ) {
            return null;
        }

        InvoiceResponseDto.InvoiceResponseDtoBuilder invoiceResponseDto = InvoiceResponseDto.builder();

        invoiceResponseDto.maHopDong( entityHopDongMaHopDong( entity ) );
        invoiceResponseDto.maQLThu( entityQuanLyThuMaQL( entity ) );
        invoiceResponseDto.maHoaDon( entity.getMaHoaDon() );
        invoiceResponseDto.loaiHoaDon( entity.getLoaiHoaDon() );
        invoiceResponseDto.ngayLap( entity.getNgayLap() );
        invoiceResponseDto.kyThanhToan( entity.getKyThanhToan() );
        invoiceResponseDto.soTien( entity.getSoTien() );
        invoiceResponseDto.hanThanhToan( entity.getHanThanhToan() );
        invoiceResponseDto.ngayThanhToan( entity.getNgayThanhToan() );
        if ( entity.getTrangThai() != null ) {
            invoiceResponseDto.trangThai( entity.getTrangThai().name() );
        }

        return invoiceResponseDto.build();
    }

    private String entityHopDongMaHopDong(Invoice invoice) {
        Contract hopDong = invoice.getHopDong();
        if ( hopDong == null ) {
            return null;
        }
        return hopDong.getMaHopDong();
    }

    private String entityQuanLyThuMaQL(Invoice invoice) {
        Administrator quanLyThu = invoice.getQuanLyThu();
        if ( quanLyThu == null ) {
            return null;
        }
        return quanLyThu.getMaQL();
    }
}
