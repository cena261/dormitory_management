package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.InvoiceRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.InvoiceUpdateStatusDto;
import cena.dorm_management.Dorm_Admin.dto.response.InvoiceResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.service.InvoiceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceController {

    InvoiceService invoiceService;

    @PostMapping
    public ApiResponse<InvoiceResponseDto> create(@RequestBody InvoiceRequestDto dto) {
        return ApiResponse.<InvoiceResponseDto>builder()
                .message("Tạo hóa đơn thành công")
                .result(invoiceService.createInvoice(dto))
                .build();
    }

    @GetMapping
    public ApiResponse<PagedResponse<InvoiceResponseDto>> getInvoices(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maHopDong,
            @RequestParam(required = false) String loaiHoaDon,
            @RequestParam(required = false) String kyThanhToan,
            @PageableDefault(size = 10, page = 0, sort = "ngayLap", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<InvoiceResponseDto>>builder()
                .message("Danh sách hóa đơn")
                .result(invoiceService.filterInvoices(trangThai, maHopDong, loaiHoaDon, kyThanhToan, pageable))
                .build();
    }

    @PutMapping("/{maHoaDon}/status")
    public ApiResponse<InvoiceResponseDto> updateStatus(
            @PathVariable String maHoaDon,
            @RequestBody InvoiceUpdateStatusDto dto
    ) {
        return ApiResponse.<InvoiceResponseDto>builder()
                .message("Cập nhật trạng thái hóa đơn thành công")
                .result(invoiceService.updateInvoiceStatus(maHoaDon, dto))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<PagedResponse<InvoiceResponseDto>> getStudentInvoices(
            Principal principal,
            @PageableDefault(size = 10, page = 0, sort = "ngayLap", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<InvoiceResponseDto>>builder()
                .message("Hóa đơn của sinh viên")
                .result(invoiceService.getInvoicesForStudent(principal.getName(), pageable))
                .build();
    }

}

