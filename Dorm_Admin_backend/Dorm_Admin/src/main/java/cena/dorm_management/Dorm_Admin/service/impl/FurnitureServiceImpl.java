package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.FurnitureRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.FurnitureResponseDto;
import cena.dorm_management.Dorm_Admin.entity.AvailableFurniture;
import cena.dorm_management.Dorm_Admin.entity.Room;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.FurnitureMapper;
import cena.dorm_management.Dorm_Admin.repository.FurnitureRepository;
import cena.dorm_management.Dorm_Admin.repository.RoomRepository;
import cena.dorm_management.Dorm_Admin.service.FurnitureService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FurnitureServiceImpl implements FurnitureService {

    FurnitureRepository repository;
    RoomRepository roomRepository;
    FurnitureMapper mapper;

    @Override
    public FurnitureResponseDto create(FurnitureRequestDto dto) {
        if (repository.existsById(dto.getMaVatDung())) {
            throw new AppException(ErrorCode.FURNITURE_EXISTED);
        }

        Room room = roomRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        AvailableFurniture furniture = mapper.toEntity(dto);
        furniture.setRoom(room);
        repository.save(furniture);
        return mapper.toDto(furniture);
    }

    @Override
    public FurnitureResponseDto update(String maVatDung, FurnitureRequestDto dto) {
        AvailableFurniture furniture = repository.findById(maVatDung)
                .orElseThrow(() -> new AppException(ErrorCode.FURNITURE_NOT_FOUND));

        furniture.setTenVatDung(dto.getTenVatDung());
        furniture.setMoTa(dto.getMoTa());
        furniture.setNgayNhap(dto.getNgayNhap());
        furniture.setGiaTri(dto.getGiaTri());
        furniture.setTinhTrang(AvailableFurniture.EquipmentStatus.valueOf(dto.getTinhTrang()));

        repository.save(furniture);
        return mapper.toDto(furniture);
    }

    @Override
    public FurnitureResponseDto updateStatus(String maVatDung, String tinhTrang) {
        AvailableFurniture furniture = repository.findById(maVatDung)
                .orElseThrow(() -> new AppException(ErrorCode.FURNITURE_NOT_FOUND));

        furniture.setTinhTrang(AvailableFurniture.EquipmentStatus.valueOf(tinhTrang));
        repository.save(furniture);
        return mapper.toDto(furniture);
    }

    @Override
    public List<FurnitureResponseDto> getByRoom(String maPhong) {
        return repository.findByRoom_MaPhong(maPhong).stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public void delete(String maVatDung) {
        if (!repository.existsById(maVatDung)) {
            throw new AppException(ErrorCode.FURNITURE_NOT_FOUND);
        }
        repository.deleteById(maVatDung);
    }
}

