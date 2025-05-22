package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    boolean existsByMaPhong(String maPhong);
    @Query("""
    SELECT r FROM Room r
    WHERE (:trangThai IS NULL OR r.trangThai = :trangThai)
    AND (:maKhu IS NULL OR r.maKhu.maKhu = :maKhu)
    AND (:maLoaiPhong IS NULL OR r.maLoaiPhong.maLoaiPhong = :maLoaiPhong)
""")
    List<Room> findByFilters(
            @Param("trangThai") String trangThai,
            @Param("maKhu") String maKhu,
            @Param("maLoaiPhong") String maLoaiPhong
    );
}
