package cena.dorm_management.Dorm_Admin.repository;

import cena.dorm_management.Dorm_Admin.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByTaiKhoan(String taiKhoan);

    boolean existsByTaiKhoan(String taiKhoan);
}
