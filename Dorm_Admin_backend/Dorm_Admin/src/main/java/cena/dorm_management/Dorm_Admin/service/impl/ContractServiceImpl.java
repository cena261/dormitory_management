package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.ContractEndDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ContractResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Contract;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.entity.Student;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.ContractMapper;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import cena.dorm_management.Dorm_Admin.repository.ContractRepository;
import cena.dorm_management.Dorm_Admin.repository.RoomRepository;
import cena.dorm_management.Dorm_Admin.repository.StudentRepository;
import cena.dorm_management.Dorm_Admin.service.ContractService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContractServiceImpl implements ContractService {

    ContractRepository contractRepository;
    StudentRepository studentRepository;
    RoomRepository roomRepository;
    AdministratorRepository administratorRepository;
    ContractMapper mapper;

    @Override
    public ContractResponseDto createContract(ContractRequestDto dto) {
        Student student = studentRepository.findById(dto.getMaSV())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Room room = roomRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        Administrator admin = administratorRepository.findById(dto.getMaQuanLyLap())
                .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));

        Contract contract = (Contract) mapper.toEntity(dto);
        String shortUUID = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        contract.setMaHopDong(shortUUID);
        contract.setMaSV(student);
        contract.setMaPhong(room);
        contract.setMaQuanLyLap(admin);
        contract.setStatus("DangHieuLuc");

        contractRepository.save(contract);
        return mapper.toDto(contract);
    }

    @Override
    public PagedResponse<ContractResponseDto> getContracts(String status, String maSV, String maPhong, Pageable pageable) {
        Page<Contract> page = contractRepository.filterContracts(status, maSV, maPhong, pageable);

        return PagedResponse.<ContractResponseDto>builder()
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
    public ContractResponseDto update(String maHopDong, ContractUpdateRequestDto dto) {
        Contract contract = contractRepository.findById(maHopDong)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        contract.setNgayBatDau(dto.getNgayBatDau());
        contract.setNgayKetThucDuKien(dto.getNgayKetThucDuKien());
        contract.setTienCoc(dto.getTienCoc());
        contract.setStatus(dto.getStatus());

        if (!contract.getMaPhong().getMaPhong().equals(dto.getMaPhong())) {
            Room newRoom = roomRepository.findById(dto.getMaPhong())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
            contract.setMaPhong(newRoom);
        }

        return mapper   .toDto(contract);
    }


    @Override
    public ContractResponseDto getById(String maHopDong) {
        Contract contract = contractRepository.findById(maHopDong)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        return mapper.toDto(contract);
    }


    @Override
    public ContractResponseDto endContract(String maHopDong, ContractEndDto dto) {
        Contract contract = contractRepository.findById(maHopDong)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        contract.setNgayKetThucThucTe(dto.getNgayKetThucThucTe());
        contract.setStatus(dto.getStatus());

        contractRepository.save(contract);
        return mapper.toDto(contract);
    }

    @Override
    public ContractResponseDto getMyContract(String username) {
        Contract contract = contractRepository.findByStudentUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
        return mapper.toDto(contract);
    }

}

