package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "bienbanbangiao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HandoverRecord {
    @Id
    @Column(name = "maBienBan", length = 20)
    private String maBienBan;

    @Column(name = "ngayBanGiao", nullable = false)
    private LocalDate ngayBanGiao;

    @Column(name = "loaiBienBan", length = 20)
    private String loaiBienBan;

    @Column(name = "nguoiNhanBanGiao", length = 100, nullable = false)
    private String nguoiNhanBanGiao;

    @Column(name = "ghiChu", columnDefinition = "text")
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHopDong")
    private Contract maHopDong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQLBanGiao")
    private Administrator maQLBanGiao;
}
