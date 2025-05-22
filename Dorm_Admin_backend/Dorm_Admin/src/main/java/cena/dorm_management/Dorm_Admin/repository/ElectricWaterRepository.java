package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.ElectricWaterDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectricWaterRepository extends JpaRepository<ElectricWaterDetail, String> {
    List<ElectricWaterDetail> findByKyGhiSoAndPhong_MaPhong(String kyGhiSo, String maPhong);
    boolean existsByKyGhiSoAndPhong_MaPhong(String kyGhiSo, String maPhong);
    @Query("""
    SELECT e FROM ElectricWaterDetail e
    WHERE (:kyGhiSo IS NULL OR e.kyGhiSo = :kyGhiSo)
      AND (:maPhong IS NULL OR e.phong.maPhong = :maPhong)
      AND (:maQuanLyGhi IS NULL OR e.quanLyGhi.maQL = :maQuanLyGhi)
""")
    Page<ElectricWaterDetail> filter(
            @Param("kyGhiSo") String kyGhiSo,
            @Param("maPhong") String maPhong,
            @Param("maQuanLyGhi") String maQuanLyGhi,
            Pageable pageable
    );
}

