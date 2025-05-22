package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.NotificationRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.NotificationResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Notification;
import cena.dorm_management.Dorm_Admin.entity.Student;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public Notification toEntity(NotificationRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Notification notification = new Notification();

        notification.setTieuDe( dto.getTieuDe() );
        notification.setNoiDung( dto.getNoiDung() );
        if ( dto.getLoai() != null ) {
            notification.setLoai( Enum.valueOf( Notification.LoaiThongBao.class, dto.getLoai() ) );
        }

        return notification;
    }

    @Override
    public NotificationResponseDto toDto(Notification entity) {
        if ( entity == null ) {
            return null;
        }

        NotificationResponseDto.NotificationResponseDtoBuilder notificationResponseDto = NotificationResponseDto.builder();

        notificationResponseDto.maSV( entityNguoiNhanMaSV( entity ) );
        notificationResponseDto.maQLGui( entityNguoiGuiMaQL( entity ) );
        notificationResponseDto.id( entity.getId() );
        notificationResponseDto.tieuDe( entity.getTieuDe() );
        notificationResponseDto.noiDung( entity.getNoiDung() );
        if ( entity.getLoai() != null ) {
            notificationResponseDto.loai( entity.getLoai().name() );
        }
        if ( entity.getTrangThai() != null ) {
            notificationResponseDto.trangThai( entity.getTrangThai().name() );
        }
        notificationResponseDto.thoiGianGui( entity.getThoiGianGui() );

        return notificationResponseDto.build();
    }

    private String entityNguoiNhanMaSV(Notification notification) {
        Student nguoiNhan = notification.getNguoiNhan();
        if ( nguoiNhan == null ) {
            return null;
        }
        return nguoiNhan.getMaSV();
    }

    private String entityNguoiGuiMaQL(Notification notification) {
        Administrator nguoiGui = notification.getNguoiGui();
        if ( nguoiGui == null ) {
            return null;
        }
        return nguoiGui.getMaQL();
    }
}
