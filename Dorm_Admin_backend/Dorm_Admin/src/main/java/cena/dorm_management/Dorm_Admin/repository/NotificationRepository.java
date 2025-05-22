package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByNguoiNhan_MaSV(String maSV);
    Page<Notification> findByNguoiNhan_Account_TaiKhoan(String taiKhoan, Pageable pageable);
    @Query("""
    SELECT n FROM Notification n
    WHERE (:loai IS NULL OR n.loai = :loai)
      AND (:trangThai IS NULL OR n.trangThai = :trangThai)
""")
    Page<Notification> filterNotifications(
            @Param("loai") Notification.LoaiThongBao loai,
            @Param("trangThai") Notification.TrangThai trangThai,
            Pageable pageable
    );
}

