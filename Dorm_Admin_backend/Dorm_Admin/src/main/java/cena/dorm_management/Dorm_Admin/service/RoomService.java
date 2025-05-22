package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.RoomRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.*;

import java.awt.print.Pageable;
import java.util.List;

public interface RoomService {
    RoomResponseDto createRoom(RoomRequestDto dto);
    List<RoomResponseDto> getAllRooms(String trangThai, String maKhu, String maLoaiPhong);
    RoomResponseDto updateRoom(String maPhong, RoomRequestDto dto);
    void deleteRoom(String maPhong);
    RoomResponseDto updateRoomStatus(String maPhong, String trangThai);
    RoomResponseDto addStudentToRoom(String maPhong, String maSV);
    RoomResponseDto removeStudentFromRoom(String maPhong, String maSV);
    List<StudentBasicDto> getStudentsInRoom(String maPhong);
    MyRoomResponseDto getRoomOfCurrentStudent(String username);
}
