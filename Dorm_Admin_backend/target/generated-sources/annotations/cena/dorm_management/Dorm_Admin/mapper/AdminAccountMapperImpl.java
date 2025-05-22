package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.AdminAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AdminAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class AdminAccountMapperImpl implements AdminAccountMapper {

    @Override
    public Administrator toAdministrator(AdminAccountRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Administrator administrator = new Administrator();

        administrator.setMaQL( dto.getMaQL() );
        administrator.setHoTen( dto.getHoTen() );
        administrator.setChucVu( dto.getChucVu() );
        administrator.setSdt( dto.getSdt() );
        administrator.setEmail( dto.getEmail() );

        return administrator;
    }

    @Override
    public Account toAccount(AdminAccountRequestDto dto, Account account) {
        if ( dto == null ) {
            return account;
        }

        account.setTaiKhoan( dto.getTaiKhoan() );
        account.setMatKhau( dto.getMatKhau() );

        account.setVaiTro( Account.VaiTro.QuanTriVien );
        account.setTrangThaiTaiKhoan( Account.TrangThai.KichHoat );

        return account;
    }

    @Override
    public AdminAccountResponseDto toResponseDto(Account account) {
        if ( account == null ) {
            return null;
        }

        AdminAccountResponseDto.AdminAccountResponseDtoBuilder adminAccountResponseDto = AdminAccountResponseDto.builder();

        adminAccountResponseDto.maQL( accountQuanLyMaQL( account ) );
        adminAccountResponseDto.hoTen( accountQuanLyHoTen( account ) );
        adminAccountResponseDto.chucVu( accountQuanLyChucVu( account ) );
        adminAccountResponseDto.email( accountQuanLyEmail( account ) );
        adminAccountResponseDto.sdt( accountQuanLySdt( account ) );
        adminAccountResponseDto.id( account.getId() );
        adminAccountResponseDto.taiKhoan( account.getTaiKhoan() );
        if ( account.getVaiTro() != null ) {
            adminAccountResponseDto.vaiTro( account.getVaiTro().name() );
        }

        return adminAccountResponseDto.build();
    }

    private String accountQuanLyMaQL(Account account) {
        Administrator quanLy = account.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getMaQL();
    }

    private String accountQuanLyHoTen(Account account) {
        Administrator quanLy = account.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getHoTen();
    }

    private String accountQuanLyChucVu(Account account) {
        Administrator quanLy = account.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getChucVu();
    }

    private String accountQuanLyEmail(Account account) {
        Administrator quanLy = account.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getEmail();
    }

    private String accountQuanLySdt(Account account) {
        Administrator quanLy = account.getQuanLy();
        if ( quanLy == null ) {
            return null;
        }
        return quanLy.getSdt();
    }
}
