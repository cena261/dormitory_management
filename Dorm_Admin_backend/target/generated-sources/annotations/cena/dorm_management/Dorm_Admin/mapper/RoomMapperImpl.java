package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.MyRoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentBasicDto;
import cena.dorm_management.Dorm_Admin.entity.Area;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.entity.RoomType;
import cena.dorm_management.Dorm_Admin.entity.Student;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-20T16:45:34+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class RoomMapperImpl implements RoomMapper {

    @Override
    public RoomResponseDto toResponseDto(Room room) {
        if ( room == null ) {
            return null;
        }

        RoomResponseDto.RoomResponseDtoBuilder roomResponseDto = RoomResponseDto.builder();

        roomResponseDto.maKhu( roomMaKhuMaKhu( room ) );
        roomResponseDto.maLoaiPhong( roomMaLoaiPhongMaLoaiPhong( room ) );
        roomResponseDto.sinhVienTrongPhong( mapStudents( room.getStudents() ) );
        roomResponseDto.maPhong( room.getMaPhong() );
        roomResponseDto.tang( room.getTang() );
        roomResponseDto.soNguoiHienTai( room.getSoNguoiHienTai() );
        roomResponseDto.trangThai( room.getTrangThai() );
        roomResponseDto.giaPhong( room.getGiaPhong() );
        roomResponseDto.dienTich( room.getDienTich() );
        roomResponseDto.moTa( room.getMoTa() );

        return roomResponseDto.build();
    }

    @Override
    public MyRoomResponseDto toRoomSummary(Room room) {
        if ( room == null ) {
            return null;
        }

        MyRoomResponseDto.MyRoomResponseDtoBuilder myRoomResponseDto = MyRoomResponseDto.builder();

        myRoomResponseDto.maLoaiPhong( roomMaLoaiPhongMaLoaiPhong( room ) );
        myRoomResponseDto.maKhu( roomMaKhuMaKhu( room ) );
        myRoomResponseDto.maPhong( room.getMaPhong() );
        myRoomResponseDto.soNguoiHienTai( room.getSoNguoiHienTai() );
        myRoomResponseDto.giaPhong( room.getGiaPhong() );
        myRoomResponseDto.tang( room.getTang() );

        return myRoomResponseDto.build();
    }

    @Override
    public List<StudentBasicDto> mapStudents(List<Student> students) {
        if ( students == null ) {
            return null;
        }

        List<StudentBasicDto> list = new ArrayList<StudentBasicDto>( students.size() );
        for ( Student student : students ) {
            list.add( studentToStudentBasicDto( student ) );
        }

        return list;
    }

    private String roomMaKhuMaKhu(Room room) {
        Area maKhu = room.getMaKhu();
        if ( maKhu == null ) {
            return null;
        }
        return maKhu.getMaKhu();
    }

    private String roomMaLoaiPhongMaLoaiPhong(Room room) {
        RoomType maLoaiPhong = room.getMaLoaiPhong();
        if ( maLoaiPhong == null ) {
            return null;
        }
        return maLoaiPhong.getMaLoaiPhong();
    }

    protected StudentBasicDto studentToStudentBasicDto(Student student) {
        if ( student == null ) {
            return null;
        }

        StudentBasicDto.StudentBasicDtoBuilder studentBasicDto = StudentBasicDto.builder();

        studentBasicDto.maSV( student.getMaSV() );
        studentBasicDto.hoTen( student.getHoTen() );
        studentBasicDto.lop( student.getLop() );

        return studentBasicDto.build();
    }
}
