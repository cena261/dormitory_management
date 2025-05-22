package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.RoomRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.MyRoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.StudentBasicDto;
import cena.dorm_management.Dorm_Admin.entity.*;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.RoomMapper;
import cena.dorm_management.Dorm_Admin.repository.*;
import cena.dorm_management.Dorm_Admin.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomServiceImpl implements RoomService {

    RoomRepository roomRepository;
    RoomMapper roomMapper;
    RoomTypeRepository roomTypeRepository;
    AreaRepository areaRepository;
    StudentRepository studentRepository;
    AccountRepository accountRepository;

    @Override
    public RoomResponseDto createRoom(RoomRequestDto dto) {
        if (roomRepository.existsByMaPhong(dto.getMaPhong())) {
            throw new AppException(ErrorCode.ROOM_ALREADY_EXISTS);
        }

        RoomType roomType = roomTypeRepository.findById(dto.getMaLoaiPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));

        Area area = areaRepository.findById(dto.getMaKhu())
                .orElseThrow(() -> new AppException(ErrorCode.AREA_NOT_FOUND));

        Room room = new Room();
        room.setMaPhong(dto.getMaPhong());
        room.setTang(dto.getTang());
        room.setSoNguoiHienTai(dto.getSoNguoiHienTai());
        room.setTrangThai(dto.getTrangThai());
        room.setGiaPhong(dto.getGiaPhong());
        room.setDienTich(dto.getDienTich());
        room.setMoTa(dto.getMoTa());
        room.setMaLoaiPhong(roomType);
        room.setMaKhu(area);

        roomRepository.save(room);
        return roomMapper.toResponseDto(room);
    }

    @Override
    public List<RoomResponseDto> getAllRooms(String trangThai, String maKhu, String maLoaiPhong) {
        List<Room> rooms;

        if (trangThai != null || maKhu != null || maLoaiPhong != null) {
            rooms = roomRepository.findByFilters(trangThai, maKhu, maLoaiPhong);
        } else {
            rooms = roomRepository.findAll();
        }

        return rooms.stream()
                .map(roomMapper::toResponseDto)
                .toList();
    }

    @Override
    public RoomResponseDto updateRoom(String maPhong, RoomRequestDto dto) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setTang(dto.getTang());
        room.setSoNguoiHienTai(dto.getSoNguoiHienTai());
        room.setTrangThai(dto.getTrangThai());
        room.setGiaPhong(dto.getGiaPhong());
        room.setDienTich(dto.getDienTich());
        room.setMoTa(dto.getMoTa());

        RoomType roomType = roomTypeRepository.findById(dto.getMaLoaiPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));
        Area area = areaRepository.findById(dto.getMaKhu())
                .orElseThrow(() -> new AppException(ErrorCode.AREA_NOT_FOUND));

        room.setMaLoaiPhong(roomType);
        room.setMaKhu(area);

        roomRepository.save(room);
        return roomMapper.toResponseDto(room);
    }

    @Override
    public MyRoomResponseDto getRoomOfCurrentStudent(String username) {
        Account account = accountRepository.findByTaiKhoan(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!account.isSinhVien() || account.getSinhVien() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Student student = account.getSinhVien();
        Room room = student.getRoom();

        if (room == null) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }

        return roomMapper.toRoomSummary(room);
    }

    @Override
    public void deleteRoom(String maPhong) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        roomRepository.delete(room);
    }

    @Override
    public RoomResponseDto updateRoomStatus(String maPhong, String trangThai) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setTrangThai(trangThai);
        roomRepository.save(room);

        return roomMapper.toResponseDto(room);
    }

    @Override
    public RoomResponseDto addStudentToRoom(String maPhong, String maSV) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        Student student = studentRepository.findById(maSV)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (student.getRoom() != null) {
            throw new AppException(ErrorCode.STUDENT_ALREADY_ASSIGNED);
        }

        if (room.getSoNguoiHienTai() >= room.getMaLoaiPhong().getSoNguoiToiDa()) {
            throw new AppException(ErrorCode.ROOM_IS_FULL);
        }

        student.setRoom(room);
        student.setTrangThai("Đang ở");

        room.setSoNguoiHienTai(room.getSoNguoiHienTai() + 1);

        studentRepository.save(student); // Room sẽ tự cập nhật
        return roomMapper.toResponseDto(room);
    }


    @Override
    public RoomResponseDto removeStudentFromRoom(String maPhong, String maSV) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        Student student = studentRepository.findById(maSV)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!maPhong.equals(student.getRoom() != null ? student.getRoom().getMaPhong() : null)) {
            throw new AppException(ErrorCode.STUDENT_NOT_IN_THIS_ROOM);
        }

        student.setRoom(null);
        student.setTrangThai("Chưa ở");

        room.setSoNguoiHienTai(room.getSoNguoiHienTai() - 1);

        studentRepository.save(student);
        return roomMapper.toResponseDto(room);
    }

    @Override
    public List<StudentBasicDto> getStudentsInRoom(String maPhong) {
        Room room = roomRepository.findById(maPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        return room.getStudents().stream()
                .map(student -> StudentBasicDto.builder()
                        .maSV(student.getMaSV())
                        .hoTen(student.getHoTen())
                        .lop(student.getLop())
                        .build())
                .toList();
    }


}
