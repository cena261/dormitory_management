package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.StudentAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Student;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class StudentAccountMapperImpl implements StudentAccountMapper {

    @Override
    public Student toStudent(StudentAccountRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Student student = new Student();

        student.setTrangThai( dto.getTrangThaiSinhVien() );
        student.setMaSV( dto.getMaSV() );
        student.setHoTen( dto.getHoTen() );
        if ( dto.getNgaySinh() != null ) {
            student.setNgaySinh( LocalDateTime.ofInstant( dto.getNgaySinh().toInstant(), ZoneOffset.UTC ).toLocalDate() );
        }
        student.setGioiTinh( dto.getGioiTinh() );
        student.setCccd( dto.getCccd() );
        student.setSdt( dto.getSdt() );
        student.setEmail( dto.getEmail() );
        student.setKhoa( dto.getKhoa() );
        student.setDiaChiThuongTru( dto.getDiaChiThuongTru() );
        student.setDoiTuongUuTien( dto.getDoiTuongUuTien() );
        student.setLop( dto.getLop() );

        return student;
    }

    @Override
    public Account toAccount(StudentAccountRequestDto dto, Account account) {
        if ( dto == null ) {
            return account;
        }

        account.setTrangThaiTaiKhoan( dto.getTrangThaiTaiKhoan() );
        account.setTaiKhoan( dto.getTaiKhoan() );
        account.setMatKhau( dto.getMatKhau() );

        return account;
    }

    @Override
    public StudentAccountResponseDto toResponseDto(Account account) {
        if ( account == null ) {
            return null;
        }

        StudentAccountResponseDto.StudentAccountResponseDtoBuilder studentAccountResponseDto = StudentAccountResponseDto.builder();

        studentAccountResponseDto.maSV( accountSinhVienMaSV( account ) );
        studentAccountResponseDto.hoTen( accountSinhVienHoTen( account ) );
        studentAccountResponseDto.lop( accountSinhVienLop( account ) );
        studentAccountResponseDto.khoa( accountSinhVienKhoa( account ) );
        studentAccountResponseDto.email( accountSinhVienEmail( account ) );
        studentAccountResponseDto.sdt( accountSinhVienSdt( account ) );
        studentAccountResponseDto.gioiTinh( accountSinhVienGioiTinh( account ) );
        studentAccountResponseDto.diaChiThuongTru( accountSinhVienDiaChiThuongTru( account ) );
        studentAccountResponseDto.doiTuongUuTien( accountSinhVienDoiTuongUuTien( account ) );
        studentAccountResponseDto.trangThaiSinhVien( accountSinhVienTrangThai( account ) );
        if ( account.getTrangThaiTaiKhoan() != null ) {
            studentAccountResponseDto.trangThai( account.getTrangThaiTaiKhoan().name() );
        }
        LocalDate ngaySinh = accountSinhVienNgaySinh( account );
        if ( ngaySinh != null ) {
            studentAccountResponseDto.ngaySinh( Date.from( ngaySinh.atStartOfDay( ZoneOffset.UTC ).toInstant() ) );
        }
        studentAccountResponseDto.cccd( accountSinhVienCccd( account ) );
        studentAccountResponseDto.id( account.getId() );
        studentAccountResponseDto.taiKhoan( account.getTaiKhoan() );
        if ( account.getVaiTro() != null ) {
            studentAccountResponseDto.vaiTro( account.getVaiTro().name() );
        }

        studentAccountResponseDto.maPhong( account.getSinhVien() != null && account.getSinhVien().getRoom() != null ? account.getSinhVien().getRoom().getMaPhong() : null );

        return studentAccountResponseDto.build();
    }

    private String accountSinhVienMaSV(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getMaSV();
    }

    private String accountSinhVienHoTen(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getHoTen();
    }

    private String accountSinhVienLop(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getLop();
    }

    private String accountSinhVienKhoa(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getKhoa();
    }

    private String accountSinhVienEmail(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getEmail();
    }

    private String accountSinhVienSdt(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getSdt();
    }

    private String accountSinhVienGioiTinh(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getGioiTinh();
    }

    private String accountSinhVienDiaChiThuongTru(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getDiaChiThuongTru();
    }

    private String accountSinhVienDoiTuongUuTien(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getDoiTuongUuTien();
    }

    private String accountSinhVienTrangThai(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getTrangThai();
    }

    private LocalDate accountSinhVienNgaySinh(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getNgaySinh();
    }

    private String accountSinhVienCccd(Account account) {
        Student sinhVien = account.getSinhVien();
        if ( sinhVien == null ) {
            return null;
        }
        return sinhVien.getCccd();
    }
}
