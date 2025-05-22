package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.RoomTypeRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.RoomTypeResponseDto;
import cena.dorm_management.Dorm_Admin.entity.RoomType;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.RoomTypeMapper;
import cena.dorm_management.Dorm_Admin.repository.RoomTypeRepository;
import cena.dorm_management.Dorm_Admin.service.RoomTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomTypeServiceImpl implements RoomTypeService {

    RoomTypeRepository repository;
    RoomTypeMapper mapper;

    @Override
    public RoomTypeResponseDto create(RoomTypeRequestDto dto) {
        if (repository.existsById(dto.getMaLoaiPhong())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
        }

        RoomType entity = mapper.toEntity(dto);
        repository.save(entity);
        return mapper.toDto(entity);
    }

    @Override
    public List<RoomTypeResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public void delete(String maLoaiPhong) {
        RoomType type = repository.findById(maLoaiPhong)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));

        if (!type.getRooms().isEmpty()) {
            throw new AppException(ErrorCode.ROOM_TYPE_IN_USE);
        }

        repository.delete(type);
    }
}

