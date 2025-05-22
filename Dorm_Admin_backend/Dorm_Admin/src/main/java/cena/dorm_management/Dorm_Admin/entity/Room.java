package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @Column(name = "maPhong", length = 10)
    private String maPhong;

    @Column(name = "tang", nullable = false)
    private int tang;

    @Column(name = "soNguoiHienTai", nullable = false)
    private int soNguoiHienTai = 0;

    @Column(name = "trangThai", length = 20, nullable = false)
    private String trangThai;

    @Column(name = "giaPhong", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaPhong;

    @Column(name = "dienTich", nullable = false)
    private float dienTich;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String moTa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiPhong")
    private RoomType maLoaiPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhu")
    private Area maKhu;

    @OneToMany(mappedBy = "room")
    private List<AvailableFurniture> equipmentList;

    @OneToMany(mappedBy = "maPhong")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Student> students = new ArrayList<>();
}
