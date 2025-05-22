package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.RoomRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.MyRoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentBasicDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;
import cena.dorm_management.Dorm_Admin.service.RoomService;
import cena.dorm_management.Dorm_Admin.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.actuate.web.exchanges.HttpExchange;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {

    RoomService roomService;
    StudentService studentService;

    @PostMapping
    public ApiResponse<RoomResponseDto> createRoom(@RequestBody RoomRequestDto dto) {
        RoomResponseDto room = roomService.createRoom(dto);
        return ApiResponse.<RoomResponseDto>builder()
                .message("Tạo phòng thành công")
                .result(room)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoomResponseDto>> getAllRooms(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maKhu,
            @RequestParam(required = false) String maLoaiPhong
    ) {
        List<RoomResponseDto> result = roomService.getAllRooms(trangThai, maKhu, maLoaiPhong);
        return ApiResponse.<List<RoomResponseDto>>builder()
                .message("Lấy danh sách phòng thành công")
                .result(result)
                .build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SinhVien')")
    public ApiResponse<MyRoomResponseDto> getMyRoom(HttpServletRequest request) {
        String username = request.getUserPrincipal().getName();
        return ApiResponse.<MyRoomResponseDto>builder()
                .message("Thông tin phòng của bạn")
                .result(roomService.getRoomOfCurrentStudent(username))
                .build();
    }

    @PutMapping("/{maPhong}")
    public ApiResponse<RoomResponseDto> updateRoom(
            @PathVariable String maPhong,
            @RequestBody RoomRequestDto dto
    ) {
        RoomResponseDto room = roomService.updateRoom(maPhong, dto);
        return ApiResponse.<RoomResponseDto>builder()
                .message("Cập nhật thông tin phòng thành công")
                .result(room)
                .build();
    }

    @DeleteMapping("/{maPhong}")
    public ApiResponse<?> deleteRoom(@PathVariable String maPhong) {
        roomService.deleteRoom(maPhong);
        return ApiResponse.builder()
                .message("Xoá phòng thành công")
                .build();
    }

    @PutMapping("/{maPhong}/status")
    public ApiResponse<RoomResponseDto> updateRoomStatus(
            @PathVariable String maPhong,
            @RequestParam String trangThai
    ) {
        RoomResponseDto updated = roomService.updateRoomStatus(maPhong, trangThai);
        return ApiResponse.<RoomResponseDto>builder()
                .message("Cập nhật trạng thái phòng thành công")
                .result(updated)
                .build();
    }

    @PutMapping("/{maPhong}/add-student/{maSV}")
    public ApiResponse<RoomResponseDto> addStudentToRoom(
            @PathVariable String maPhong,
            @PathVariable String maSV
    ) {
        RoomResponseDto room = roomService.addStudentToRoom(maPhong, maSV);
        return ApiResponse.<RoomResponseDto>builder()
                .message("Thêm sinh viên vào phòng thành công")
                .result(room)
                .build();
    }

    @PutMapping("/{maPhong}/remove-student/{maSV}")
    public ApiResponse<RoomResponseDto> removeStudentFromRoom(
            @PathVariable String maPhong,
            @PathVariable String maSV
    ) {
        RoomResponseDto room = roomService.removeStudentFromRoom(maPhong, maSV);
        return ApiResponse.<RoomResponseDto>builder()
                .message("Xóa sinh viên khỏi phòng thành công")
                .result(room)
                .build();
    }

    @GetMapping("/{maPhong}/students")
    public ApiResponse<List<StudentBasicDto>> getStudentsInRoom(@PathVariable String maPhong) {
        List<StudentBasicDto> students = roomService.getStudentsInRoom(maPhong);
        return ApiResponse.<List<StudentBasicDto>>builder()
                .message("Lấy danh sách sinh viên trong phòng thành công")
                .result(students)
                .build();
    }

}
