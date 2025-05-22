package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.MyRoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentBasicDto;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.entity.Student;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    @Mapping(source = "maKhu.maKhu", target = "maKhu")
    @Mapping(source = "maLoaiPhong.maLoaiPhong", target = "maLoaiPhong")
    @Mapping(source = "students", target = "sinhVienTrongPhong")
    RoomResponseDto toResponseDto(Room room);

    @Mapping(source = "maLoaiPhong.maLoaiPhong", target = "maLoaiPhong")
    @Mapping(source = "maKhu.maKhu", target = "maKhu")
    MyRoomResponseDto toRoomSummary(Room room);

    List<StudentBasicDto> mapStudents(List<Student> students);
}




