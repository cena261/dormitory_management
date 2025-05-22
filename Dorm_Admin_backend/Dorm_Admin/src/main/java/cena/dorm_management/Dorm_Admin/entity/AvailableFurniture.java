package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "vatdungcosan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableFurniture {
    @Id
    @Column(name = "maVatDung", length = 20)
    private String maVatDung;

    @Column(name = "tenVatDung", length = 100, nullable = false)
    private String tenVatDung;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tinhTrang", nullable = false)
    private EquipmentStatus tinhTrang;

    @Column(name = "ngayNhap", nullable = false)
    private LocalDate ngayNhap;

    @Column(name = "giaTri", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaTri;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhong")
    private Room room;

    @OneToMany(mappedBy = "maVatDung")
    private List<HandoverDetail> handoverDetails;

    public enum EquipmentStatus {
        HoatDong, Hong, CanSua
    }
}
