package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.RepairRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, String> {
    List<RepairRequest> findByTrangThai(RepairRequest.TrangThai trangThai);

    @Query("""
    SELECT r FROM RepairRequest r
    WHERE (:trangThai IS NULL OR r.trangThai = :trangThai)
      AND (:maPhong IS NULL OR r.phong.maPhong = :maPhong)
      AND (:maSV IS NULL OR r.maSV.maSV = :maSV)
""")
    Page<RepairRequest> filterRequests(
            @Param("trangThai") RepairRequest.TrangThai trangThai,
            @Param("maPhong") String maPhong,
            @Param("maSV") String maSV,
            Pageable pageable
    );


}

