package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.ElectricWaterRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.ElectricWaterResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.entity.*;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.ElectricWaterMapper;
import cena.dorm_management.Dorm_Admin.repository.*;
import cena.dorm_management.Dorm_Admin.service.ElectricWaterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ElectricWaterServiceImpl implements ElectricWaterService {

    ElectricWaterRepository repository;
    RoomRepository roomRepository;
    AdministratorRepository adminRepository;
    ContractRepository contractRepository;
    InvoiceRepository invoiceRepository;
    ElectricWaterMapper mapper;

    @Override
    public ElectricWaterResponseDto create(ElectricWaterRequestDto dto) {
        if (repository.existsByKyGhiSoAndPhong_MaPhong(dto.getKyGhiSo(), dto.getMaPhong())) {
            throw new AppException(ErrorCode.DUPLICATE_ELECTRIC_DETAIL);
        }

        Room room = roomRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        Administrator admin = adminRepository.findById(dto.getMaQuanLyGhi())
                .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));

        ElectricWaterDetail detail = mapper.toEntity(dto);
        detail.setMaChiTietDN(UUID.randomUUID().toString());
        detail.setPhong(room);
        detail.setQuanLyGhi(admin);

        int soDien = dto.getChiSoDienCuoi() - dto.getChiSoDienDau();
        int soNuoc = dto.getChiSoNuocCuoi() - dto.getChiSoNuocDau();

        BigDecimal tienDien = dto.getDonGiaDien().multiply(BigDecimal.valueOf(soDien));
        BigDecimal tienNuoc = dto.getDonGiaNuoc().multiply(BigDecimal.valueOf(soNuoc));
        BigDecimal tong = tienDien.add(tienNuoc);

        detail.setThanhTienDien(tienDien);
        detail.setThanhTienNuoc(tienNuoc);
        detail.setTongTien(tong);

        Contract contract = room.getContracts().stream()
                .filter(c -> c.getStatus().equalsIgnoreCase("DangHieuLuc"))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        Invoice invoice = new Invoice();
        invoice.setMaHoaDon(UUID.randomUUID().toString());
        invoice.setLoaiHoaDon("DienNuoc");
        invoice.setNgayLap(dto.getNgayGhiSo());
        invoice.setKyThanhToan(dto.getKyGhiSo());
        invoice.setSoTien(tong);
        invoice.setHanThanhToan(Date.from(LocalDate.now().plusDays(7)
                .atStartOfDay(ZoneId.systemDefault()).toInstant()));
        invoice.setTrangThai(Invoice.TrangThai.ChuaThanhToan);
        invoice.setHopDong(contract);
        invoice.setQuanLyThu(admin);
        invoiceRepository.save(invoice);

        detail.setHoaDon(invoice);

        repository.save(detail);
        return mapper.toDto(detail);
    }


    @Override
    public PagedResponse<ElectricWaterResponseDto> filter(String kyGhiSo, String maPhong, String maQuanLyGhi, Pageable pageable) {
        Page<ElectricWaterDetail> page = repository.filter(kyGhiSo, maPhong, maQuanLyGhi, pageable);

        return PagedResponse.<ElectricWaterResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public ElectricWaterResponseDto update(String maChiTietDN, ElectricWaterRequestDto dto) {
        ElectricWaterDetail detail = repository.findById(maChiTietDN)
                .orElseThrow(() -> new AppException(ErrorCode.ELECTRIC_DETAIL_NOT_FOUND));

        Room room = roomRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        Administrator admin = adminRepository.findById(dto.getMaQuanLyGhi())
                .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));

        detail.setKyGhiSo(dto.getKyGhiSo());
        detail.setNgayGhiSo(dto.getNgayGhiSo());
        detail.setChiSoDienDau(dto.getChiSoDienDau());
        detail.setChiSoDienCuoi(dto.getChiSoDienCuoi());
        detail.setChiSoNuocDau(dto.getChiSoNuocDau());
        detail.setChiSoNuocCuoi(dto.getChiSoNuocCuoi());
        detail.setDonGiaDien(dto.getDonGiaDien());
        detail.setDonGiaNuoc(dto.getDonGiaNuoc());
        detail.setPhong(room);
        detail.setQuanLyGhi(admin);

        int soDien = dto.getChiSoDienCuoi() - dto.getChiSoDienDau();
        int soNuoc = dto.getChiSoNuocCuoi() - dto.getChiSoNuocDau();
        BigDecimal tienDien = dto.getDonGiaDien().multiply(BigDecimal.valueOf(soDien));
        BigDecimal tienNuoc = dto.getDonGiaNuoc().multiply(BigDecimal.valueOf(soNuoc));

        detail.setThanhTienDien(tienDien);
        detail.setThanhTienNuoc(tienNuoc);
        detail.setTongTien(tienDien.add(tienNuoc));

        repository.save(detail);
        return mapper.toDto(detail);
    }

    @Override
    public ElectricWaterResponseDto attachToInvoice(String maChiTietDN, String maHoaDon) {
        ElectricWaterDetail detail = repository.findById(maChiTietDN)
                .orElseThrow(() -> new AppException(ErrorCode.ELECTRIC_DETAIL_NOT_FOUND));

        Invoice invoice = invoiceRepository.findById(maHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        detail.setHoaDon(invoice);
        repository.save(detail);

        return mapper.toDto(detail);
    }

}

