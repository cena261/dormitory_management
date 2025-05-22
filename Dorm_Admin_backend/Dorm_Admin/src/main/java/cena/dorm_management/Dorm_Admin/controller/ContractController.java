package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.ContractEndDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.ContractUpdateRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ContractResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.service.ContractService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContractController {

    ContractService service;

    @PostMapping
    public ApiResponse<ContractResponseDto> create(@RequestBody ContractRequestDto dto) {
        return ApiResponse.<ContractResponseDto>builder()
                .message("Tạo hợp đồng thành công")
                .result(service.createContract(dto))
                .build();
    }

    @GetMapping
    public ApiResponse<PagedResponse<ContractResponseDto>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String maSV,
            @RequestParam(required = false) String maPhong,
            @PageableDefault(size = 10, page = 0, sort = "ngayLap", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<ContractResponseDto>>builder()
                .message("Danh sách hợp đồng")
                .result(service.getContracts(status, maSV, maPhong, pageable))
                .build();
    }

    @GetMapping("/{maHopDong}")
    public ApiResponse<ContractResponseDto> getById(@PathVariable String maHopDong) {
        ContractResponseDto dto = service.getById(maHopDong);
        return ApiResponse.<ContractResponseDto>builder()
                .message("Lấy hợp đồng thành công")
                .result(dto)
                .build();
    }

    @PutMapping("/{maHopDong}")
    public ApiResponse<ContractResponseDto> update(
            @PathVariable String maHopDong,
            @RequestBody ContractUpdateRequestDto dto
    ) {
        ContractResponseDto result = service.update(maHopDong, dto);
        return ApiResponse.<ContractResponseDto>builder()
                .message("Cập nhật hợp đồng thành công")
                .result(result)
                .build();
    }


    @PutMapping("/{maHopDong}/end")
    public ApiResponse<ContractResponseDto> endContract(
            @PathVariable String maHopDong,
            @RequestBody ContractEndDto dto
    ) {
        return ApiResponse.<ContractResponseDto>builder()
                .message("Cập nhật trạng thái hợp đồng thành công")
                .result(service.endContract(maHopDong, dto))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<ContractResponseDto> getMyContract(Principal principal) {
        return ApiResponse.<ContractResponseDto>builder()
                .message("Hợp đồng của bạn")
                .result(service.getMyContract(principal.getName()))
                .build();
    }


}

