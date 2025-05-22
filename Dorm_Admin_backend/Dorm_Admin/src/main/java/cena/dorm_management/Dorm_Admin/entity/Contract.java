package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hopdong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    @Id
    @Column(name = "maHopDong", length = 20)
    private String maHopDong;

    @Column(name = "ngayLap", nullable = false)
    private LocalDate ngayLap;

    @Column(name = "ngayBatDau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "ngayKetThucDuKien", nullable = false)
    private LocalDate ngayKetThucDuKien;

    @Column(name = "ngayKetThucThucTe")
    private LocalDate ngayKetThucThucTe;

    @Column(name = "tienCoc", nullable = false)
    private BigDecimal tienCoc;

    @Column(name = "trangThai", length = 20, nullable = false)
    private String status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maSV")
    private Student maSV;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhong")
    private Room maPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQuanLyLap")
    private Administrator maQuanLyLap;
}
