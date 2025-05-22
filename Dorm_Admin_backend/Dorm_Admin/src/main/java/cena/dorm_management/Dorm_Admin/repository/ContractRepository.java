package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    Optional<Contract> findByMaSV_MaSV(String maSV);
    List<Contract> findByStatus(String status);
    @Query("""
    SELECT c FROM Contract c
    WHERE (:status IS NULL OR c.status = :status)
      AND (:maSV IS NULL OR c.maSV.maSV = :maSV)
      AND (:maPhong IS NULL OR c.maPhong.maPhong = :maPhong)
""")
    Page<Contract> filterContracts(
            @Param("status") String status,
            @Param("maSV") String maSV,
            @Param("maPhong") String maPhong,
            Pageable pageable
    );

    @Query("SELECT c FROM Contract c WHERE c.maSV.account.taiKhoan = :username")
    Optional<Contract> findByStudentUsername(@Param("username") String username);

}

