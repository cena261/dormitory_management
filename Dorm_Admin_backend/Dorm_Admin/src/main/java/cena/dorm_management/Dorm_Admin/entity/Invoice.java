package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "hoadon")
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @Column(name = "maHoaDon", length = 20, nullable = false)
    private String maHoaDon;

    @Column(name = "loaiHoaDon", length = 20, nullable = false)
    private String loaiHoaDon;

    @Column(name = "ngayLap", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayLap;

    @Column(name = "kyThanhToan", length = 20, nullable = false)
    private String kyThanhToan;

    @Column(name = "soTien", precision = 10, scale = 2, nullable = false)
    private BigDecimal soTien;

    @Column(name = "hanThanhToan", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date hanThanhToan;

    @Column(name = "ngayThanhToan")
    @Temporal(TemporalType.DATE)
    private Date ngayThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", nullable = false)
    private TrangThai trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHopDong")
    private Contract hopDong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQLThu", referencedColumnName = "maQL")
    private Administrator quanLyThu;

    public enum TrangThai {
        ChuaThanhToan, DaThanhToan, QuaHan
    }

    @PrePersist
    @PreUpdate
    public void updateTrangThai() {
        Date currentDate = new Date();

        if (ngayThanhToan != null) {
            this.trangThai = TrangThai.DaThanhToan;
        } else if (hanThanhToan.before(currentDate)) {
            this.trangThai = TrangThai.QuaHan;
        } else {
            this.trangThai = TrangThai.ChuaThanhToan;
        }
    }
}
