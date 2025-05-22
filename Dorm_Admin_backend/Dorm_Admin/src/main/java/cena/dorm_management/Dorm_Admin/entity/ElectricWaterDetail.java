package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "chitietdiennuoc")
@NoArgsConstructor
@AllArgsConstructor
public class ElectricWaterDetail {
    @Id
    @Column(name = "maChiTietDN", length = 20, nullable = false)
    private String maChiTietDN;

    @Column(name = "kyGhiSo", length = 20, nullable = false)
    private String kyGhiSo;

    @Column(name = "ngayGhiSo", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayGhiSo;

    @Column(name = "chiSoDienDau", nullable = false)
    private Integer chiSoDienDau;

    @Column(name = "chiSoDienCuoi", nullable = false)
    private Integer chiSoDienCuoi;

    @Column(name = "chiSoNuocDau", nullable = false)
    private Integer chiSoNuocDau;

    @Column(name = "chiSoNuocCuoi", nullable = false)
    private Integer chiSoNuocCuoi;

    @Column(name = "donGiaDien", precision = 10, scale = 2, nullable = false)
    private BigDecimal donGiaDien;

    @Column(name = "donGiaNuoc", precision = 10, scale = 2, nullable = false)
    private BigDecimal donGiaNuoc;

    @Column(name = "thanhTienDien", precision = 10, scale = 2, nullable = false)
    private BigDecimal thanhTienDien;

    @Column(name = "thanhTienNuoc", precision = 10, scale = 2, nullable = false)
    private BigDecimal thanhTienNuoc;

    @Column(name = "tongTien", precision = 10, scale = 2, nullable = false)
    private BigDecimal tongTien;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhong")
    private Room phong;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoaDon")
    private Invoice hoaDon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQuanLyGhi", referencedColumnName = "maQL")
    private Administrator quanLyGhi;

    @Transient
    public Integer getSoDienTieuThu() {
        return chiSoDienCuoi - chiSoDienDau;
    }

    @Transient
    public Integer getSoNuocTieuThu() {
        return chiSoNuocCuoi - chiSoNuocDau;
    }
}
