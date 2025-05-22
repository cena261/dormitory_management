package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.request.StudentAccountRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentAccountResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Account;
import cena.dorm_management.Dorm_Admin.entity.Student;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface StudentAccountMapper {
    @Mapping(source = "trangThaiSinhVien", target = "trangThai")
    Student toStudent(StudentAccountRequestDto dto);

    @Mapping(source = "trangThaiTaiKhoan", target = "trangThaiTaiKhoan")
    Account toAccount(StudentAccountRequestDto dto, @MappingTarget Account account);

    @Mapping(source = "sinhVien.maSV", target = "maSV")
    @Mapping(source = "sinhVien.hoTen", target = "hoTen")
    @Mapping(source = "sinhVien.lop", target = "lop")
    @Mapping(source = "sinhVien.khoa", target = "khoa")
    @Mapping(source = "sinhVien.email", target = "email")
    @Mapping(source = "sinhVien.sdt", target = "sdt")
    @Mapping(source = "sinhVien.gioiTinh", target = "gioiTinh")
    @Mapping(source = "sinhVien.diaChiThuongTru", target = "diaChiThuongTru")
    @Mapping(source = "sinhVien.doiTuongUuTien", target = "doiTuongUuTien")
    @Mapping(source = "sinhVien.trangThai", target = "trangThaiSinhVien") // nếu tên trong entity Student là "trangThai"
    @Mapping(source = "trangThaiTaiKhoan", target = "trangThai")
    @Mapping(source = "sinhVien.ngaySinh", target = "ngaySinh")
    @Mapping(source = "sinhVien.cccd", target = "cccd")
    @Mapping(target = "maPhong", expression = "java(account.getSinhVien() != null && account.getSinhVien().getRoom() != null ? account.getSinhVien().getRoom().getMaPhong() : null)")
    StudentAccountResponseDto toResponseDto(Account account);
}
