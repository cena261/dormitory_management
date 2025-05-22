package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.AreaRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.AreaResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Area;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.AreaMapper;
import cena.dorm_management.Dorm_Admin.repository.AreaRepository;
import cena.dorm_management.Dorm_Admin.service.AreaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AreaServiceImpl implements AreaService {

    AreaRepository repository;
    AreaMapper mapper;

    @Override
    public AreaResponseDto create(AreaRequestDto dto) {
        if (repository.existsById(dto.getMaKhu())) {
            throw new AppException(ErrorCode.AREA_EXISTED);
        }
        Area area = mapper.toEntity(dto);
        repository.save(area);
        return mapper.toDto(area);
    }

    @Override
    public List<AreaResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public void delete(String maKhu) {
        Area area = repository.findById(maKhu)
                .orElseThrow(() -> new AppException(ErrorCode.AREA_NOT_FOUND));

        if (!area.getRooms().isEmpty()) {
            throw new AppException(ErrorCode.AREA_IN_USE);
        }

        repository.delete(area);
    }
}

