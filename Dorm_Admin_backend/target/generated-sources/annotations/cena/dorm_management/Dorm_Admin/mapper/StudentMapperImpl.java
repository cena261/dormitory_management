package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Student;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T10:47:21+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class StudentMapperImpl implements StudentMapper {

    @Override
    public StudentResponseDto toStudentResponse(Student student) {
        if ( student == null ) {
            return null;
        }

        StudentResponseDto.StudentResponseDtoBuilder studentResponseDto = StudentResponseDto.builder();

        studentResponseDto.maSV( student.getMaSV() );
        studentResponseDto.hoTen( student.getHoTen() );
        studentResponseDto.lop( student.getLop() );
        studentResponseDto.khoa( student.getKhoa() );
        studentResponseDto.email( student.getEmail() );
        studentResponseDto.sdt( student.getSdt() );
        studentResponseDto.gioiTinh( student.getGioiTinh() );
        studentResponseDto.diaChiThuongTru( student.getDiaChiThuongTru() );
        studentResponseDto.doiTuongUuTien( student.getDoiTuongUuTien() );
        studentResponseDto.trangThai( student.getTrangThai() );

        return studentResponseDto.build();
    }
}
