package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "yeucausuachua")
@NoArgsConstructor
@AllArgsConstructor
public class RepairRequest {
    @Id
    @Column(name = "maYeuCau", length = 20, nullable = false)
    private String maYeuCau;

    @Column(name = "ngayYeuCau", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayYeuCau;

    @Column(name = "noiDung", columnDefinition = "TEXT", nullable = false)
    private String noiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "mucDoUuTien", nullable = false)
    private MucDoUuTien mucDoUuTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", nullable = false)
    private TrangThai trangThai;

    @Column(name = "ngayXuLy")
    @Temporal(TemporalType.DATE)
    private Date ngayXuLy;

    @Column(name = "ngayHoanThanh")
    @Temporal(TemporalType.DATE)
    private Date ngayHoanThanh;

    @Column(name = "chiPhi", precision = 10, scale = 2)
    private BigDecimal chiPhi = BigDecimal.ZERO;

    @Column(name = "ghiChu", columnDefinition = "TEXT")
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maSV")
    private Student maSV;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhong")
    private Room phong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQLXuLy", referencedColumnName = "maQL")
    private Administrator quanLy;

    public enum MucDoUuTien {
        Cao, TrungBinh, Thap
    }

    public enum TrangThai {
        DangCho, DangXuLy, HoanThanh
    }

    @Transient
    public boolean isDangCho() {
        return this.trangThai == TrangThai.DangCho;
    }

    @Transient
    public boolean isDangXuLy() {
        return this.trangThai == TrangThai.DangXuLy;
    }

    @Transient
    public boolean isHoanThanh() {
        return this.trangThai == TrangThai.HoanThanh;
    }

    @Transient
    public Long getTongSoNgayXuLy() {
        if (ngayHoanThanh == null || ngayYeuCau == null) {
            return null;
        }
        return (ngayHoanThanh.getTime() - ngayYeuCau.getTime()) / (1000 * 60 * 60 * 24);
    }
}
