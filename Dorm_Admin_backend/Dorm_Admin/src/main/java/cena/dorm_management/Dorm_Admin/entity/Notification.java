package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tieuDe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String noiDung;

    @Column(nullable = false)
    private LocalDateTime thoiGianGui;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThai trangThai = TrangThai.CHUA_DOC;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoaiThongBao loai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoiNhan") // sinh viên
    private Student nguoiNhan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoiGui") // quản trị viên
    private Administrator nguoiGui;

    public enum TrangThai {
        CHUA_DOC, DA_DOC
    }

    public enum LoaiThongBao {
        HE_THONG, HOC_PHI, SUA_CHUA, KHAC
    }
}

