package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findByHopDong_MaHopDong(String maHopDong);
    List<Invoice> findByHopDong_MaHopDongAndTrangThai(Invoice.TrangThai trangThai, String maHopDong);
    List<Invoice> findAllByTrangThai(Invoice.TrangThai trangThai);

    @Query("""
    SELECT i FROM Invoice i
    WHERE (:trangThai IS NULL OR i.trangThai = :trangThai)
      AND (:maHopDong IS NULL OR i.hopDong.maHopDong = :maHopDong)
      AND (:loaiHoaDon IS NULL OR i.loaiHoaDon = :loaiHoaDon)
      AND (:kyThanhToan IS NULL OR i.kyThanhToan = :kyThanhToan)
""")
    Page<Invoice> filterInvoices(
            @Param("trangThai") Invoice.TrangThai trangThai,
            @Param("maHopDong") String maHopDong,
            @Param("loaiHoaDon") String loaiHoaDon,
            @Param("kyThanhToan") String kyThanhToan,
            Pageable pageable
    );

    @Query("""
    SELECT i FROM Invoice i
    WHERE i.hopDong.maSV.maSV = :maSV
""")
    Page<Invoice> findBySinhVien(@Param("maSV") String maSV, Pageable pageable);

}

