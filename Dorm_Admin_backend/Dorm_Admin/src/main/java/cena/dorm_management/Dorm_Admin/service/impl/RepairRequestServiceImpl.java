package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestCreateDto;
import cena.dorm_management.Dorm_Admin.dto.request.RepairRequestUpdateDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.dto.response.RepairRequestResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.RepairRequest;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.entity.Student;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.RepairRequestMapper;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import cena.dorm_management.Dorm_Admin.repository.RepairRequestRepository;
import cena.dorm_management.Dorm_Admin.repository.RoomRepository;
import cena.dorm_management.Dorm_Admin.repository.StudentRepository;
import cena.dorm_management.Dorm_Admin.service.RepairRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RepairRequestServiceImpl implements RepairRequestService {

    RepairRequestRepository repository;
    StudentRepository studentRepository;
    RoomRepository roomRepository;
    AdministratorRepository adminRepository;
    RepairRequestMapper mapper;

    @Override
    public RepairRequestResponseDto create(String username, RepairRequestCreateDto dto) {
        Student student = studentRepository.findByAccount_TaiKhoan(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Room room = roomRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        RepairRequest request = new RepairRequest();
        String shortUUID = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        request.setMaYeuCau(shortUUID);
        request.setNgayYeuCau(new Date());
        request.setNoiDung(dto.getNoiDung());
        request.setPhong(room);
        request.setMaSV(student);
        request.setMucDoUuTien(RepairRequest.MucDoUuTien.TrungBinh);
        request.setTrangThai(RepairRequest.TrangThai.DangCho);

        repository.save(request);
        return mapper.toDto(request);
    }

    @Override
    public List<RepairRequestResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public RepairRequestResponseDto update(String maYeuCau, RepairRequestUpdateDto dto) {
        RepairRequest request = repository.findById(maYeuCau)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (dto.getTrangThai() != null) {
            request.setTrangThai(RepairRequest.TrangThai.valueOf(dto.getTrangThai()));
        }

        request.setNgayXuLy(dto.getNgayXuLy());
        request.setNgayHoanThanh(dto.getNgayHoanThanh());
        request.setChiPhi(dto.getChiPhi());
        request.setGhiChu(dto.getGhiChu());

        if (dto.getMaQLXuLy() != null) {
            Administrator admin = adminRepository.findById(dto.getMaQLXuLy())
                    .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));
            request.setQuanLy(admin);
        }

        repository.save(request);
        return mapper.toDto(request);
    }

    @Override
    public List<RepairRequestResponseDto> getAll(String trangThai) {
        List<RepairRequest> list;

        if (trangThai != null) {
            try {
                RepairRequest.TrangThai enumTrangThai = RepairRequest.TrangThai.valueOf(trangThai);
                list = repository.findByTrangThai(enumTrangThai);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        } else {
            list = repository.findAll();
        }

        return list.stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PagedResponse<RepairRequestResponseDto> filterPaged(
            String trangThai,
            String maPhong,
            String maSV,
            Pageable pageable
    ) {
        RepairRequest.TrangThai parsedTrangThai = null;

        if (trangThai != null && !trangThai.isBlank()) {
            try {
                parsedTrangThai = RepairRequest.TrangThai.valueOf(trangThai);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        }

        Page<RepairRequest> page = (Page<RepairRequest>) repository.filterRequests(parsedTrangThai, maPhong, maSV, pageable);

        return PagedResponse.<RepairRequestResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    @Transactional
    public void deleteById(String maYeuCau) {
        RepairRequest repairRequest = repository.findById(maYeuCau)
                .orElseThrow(() -> new AppException(ErrorCode.REPAIR_REQUEST_NOT_FOUND));

        repository.delete(repairRequest);
    }

}

