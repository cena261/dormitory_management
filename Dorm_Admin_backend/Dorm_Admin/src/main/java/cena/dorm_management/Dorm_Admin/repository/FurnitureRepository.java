package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.AvailableFurniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FurnitureRepository extends JpaRepository<AvailableFurniture, String> {
    List<AvailableFurniture> findByRoom_MaPhong(String maPhong);
}
