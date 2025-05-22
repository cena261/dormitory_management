package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Table(name = "taikhoan")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "taiKhoan", nullable = false, unique = true)
    private String taiKhoan;

    @Column(name = "matKhau", nullable = false)
    private String matKhau;

    @Enumerated(EnumType.STRING)
    @Column(name = "vaiTro", nullable = false)
    private VaiTro vaiTro;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", nullable = false)
    private TrangThai trangThaiTaiKhoan = TrangThai.KichHoat;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maSV", unique = true)
    private Student sinhVien;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQL", unique = true)
    private Administrator quanLy;

    public enum VaiTro {
        SinhVien, QuanTriVien
    }

    public enum TrangThai {
        KichHoat, Khoa
    }

    // Phương thức tiện ích để kiểm tra loại tài khoản
    @Transient
    public boolean isSinhVien() {
        return vaiTro == VaiTro.SinhVien;
    }

    @Transient
    public boolean isQuanTriVien() {
        return vaiTro == VaiTro.QuanTriVien;
    }

//    // Phương thức để lấy thông tin người dùng tùy theo vai trò
//    @Transient
//    public String getHoTen() {
//        if (isSinhVien() && sinhVien != null) {
//            return sinhVien.getHoTen();
//        } else if (isQuanTriVien() && quanLy != null) {
//            return quanLy.getHoTen();
//        }
//        return null;
//    }
}
