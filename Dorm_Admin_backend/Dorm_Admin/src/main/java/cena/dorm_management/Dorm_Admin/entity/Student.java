package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "sinhvien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @Column(name = "maSV", length = 11)
    private String maSV;

    @Column(name = "hoTen", length = 100)
    private String hoTen;

    @Column(name = "ngaySinh")
    private LocalDate ngaySinh;

    @Column(name = "gioiTinh", length = 10)
    private String gioiTinh;

    @Column(name = "cccd", length = 13)
    private String cccd;

    @Column(name = "sdt", length = 12)
    private String sdt;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "khoa", length = 100)
    private String khoa;

    @Column(name = "diaChiThuongTru", length = 100)
    private String diaChiThuongTru;

    @Column(name = "doiTuongUuTien", length = 50)
    private String doiTuongUuTien;

    @Column(name = "ghiChu", length = 100)
    private String ghiChu;

    @Column(name = "trangThai", length = 20)
    private String trangThai;

    @Column(name = "lop", length = 50)
    private String lop;

    @OneToOne(mappedBy = "maSV", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Contract contract;

    @OneToOne(mappedBy = "sinhVien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Account account;

    @OneToMany(mappedBy = "maSV")
    private List<RepairRequest> repairRequests;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhong")
    private Room room;

}
