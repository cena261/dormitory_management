package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chitietbangiao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HandoverDetail {
    @EmbeddedId
    private HandoverDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maBienBan")
    @JoinColumn(name = "maBienBan")
    private HandoverRecord maBienBan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maVatDung")
    @JoinColumn(name = "maVatDung")
    private AvailableFurniture maVatDung;

    @Column(name = "tinhTrangKhiBanGiao", length = 20)
    private String tinhTrangKhiBanGiao;

    @Column(name = "soLuong", nullable = false)
    private int soLuong;
}
