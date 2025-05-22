package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.InvoiceRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.InvoiceUpdateStatusDto;
import cena.dorm_management.Dorm_Admin.dto.response.InvoiceResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface InvoiceService {
    InvoiceResponseDto createInvoice(InvoiceRequestDto dto);
    PagedResponse<InvoiceResponseDto> filterInvoices(
            String trangThai,
            String maHopDong,
            String loaiHoaDon,
            String kyThanhToan,
            Pageable pageable
    );
    InvoiceResponseDto updateInvoiceStatus(String maHoaDon, InvoiceUpdateStatusDto dto);
    PagedResponse<InvoiceResponseDto> getInvoicesForStudent(String username, Pageable pageable);
    void updateExpiredInvoices();

}

