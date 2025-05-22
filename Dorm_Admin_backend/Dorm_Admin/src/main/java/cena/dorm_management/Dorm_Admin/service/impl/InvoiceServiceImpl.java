package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.InvoiceRequestDto;
import cena.dorm_management.Dorm_Admin.dto.request.InvoiceUpdateStatusDto;
import cena.dorm_management.Dorm_Admin.dto.response.InvoiceResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Invoice;
import cena.dorm_management.Dorm_Admin.entity.Student;
import cena.dorm_management.Dorm_Admin.entity.Contract;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.InvoiceMapper;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import cena.dorm_management.Dorm_Admin.repository.ContractRepository;
import cena.dorm_management.Dorm_Admin.repository.InvoiceRepository;
import cena.dorm_management.Dorm_Admin.repository.StudentRepository;
import cena.dorm_management.Dorm_Admin.service.InvoiceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceServiceImpl implements InvoiceService {

    InvoiceRepository invoiceRepository;
    ContractRepository contractRepository;
    AdministratorRepository adminRepository;
    StudentRepository studentRepository;
    InvoiceMapper mapper;

    @Override
    public InvoiceResponseDto createInvoice(InvoiceRequestDto dto) {
        Contract contract = contractRepository.findById(dto.getMaHopDong())
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        Administrator admin = adminRepository.findById(dto.getMaQLThu())
                .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));

        Invoice invoice = mapper.toEntity(dto);
        String shortUUID = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        invoice.setMaHoaDon(shortUUID);
        invoice.setHopDong(contract);
        invoice.setQuanLyThu(admin);

        invoiceRepository.save(invoice);
        return mapper.toDto(invoice);
    }

    @Override
    public PagedResponse<InvoiceResponseDto> filterInvoices(
            String trangThai,
            String maHopDong,
            String loaiHoaDon,
            String kyThanhToan,
            Pageable pageable
    ) {
        Invoice.TrangThai parsedTrangThai = null;

        if (trangThai != null && !trangThai.isBlank()) {
            try {
                parsedTrangThai = Invoice.TrangThai.valueOf(trangThai);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        }

        Page<Invoice> page = invoiceRepository.filterInvoices(
                parsedTrangThai, maHopDong, loaiHoaDon, kyThanhToan, pageable
        );

        return PagedResponse.<InvoiceResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
    @Override
    public InvoiceResponseDto updateInvoiceStatus(String maHoaDon, InvoiceUpdateStatusDto dto) {
        Invoice invoice = invoiceRepository.findById(maHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        if (dto.getTrangThai() != null) {
            try {
                invoice.setTrangThai(Invoice.TrangThai.valueOf(dto.getTrangThai()));
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        }

        invoice.setNgayThanhToan(dto.getNgayThanhToan());

        if (dto.getMaQLThu() != null) {
            Administrator admin = adminRepository.findById(dto.getMaQLThu())
                    .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));
            invoice.setQuanLyThu(admin);
        }

        invoiceRepository.save(invoice);
        return mapper.toDto(invoice);
    }

    @Override
    public PagedResponse<InvoiceResponseDto> getInvoicesForStudent(String username, Pageable pageable) {
        Student student = studentRepository.findByAccount_TaiKhoan(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Page<Invoice> page = invoiceRepository.findBySinhVien(student.getMaSV(), pageable);

        return PagedResponse.<InvoiceResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Scheduled(cron = "0 0 0 * * *") // chạy mỗi ngày lúc 00:00
    @Override
    public void updateExpiredInvoices() {
        List<Invoice> invoices = invoiceRepository.findAllByTrangThai(Invoice.TrangThai.ChuaThanhToan);
        Date today = new Date();

        for (Invoice invoice : invoices) {
            if (invoice.getHanThanhToan().before(today) && invoice.getNgayThanhToan() == null) {
                invoice.setTrangThai(Invoice.TrangThai.QuaHan);
            }
        }

        invoiceRepository.saveAll(invoices);
    }

}

