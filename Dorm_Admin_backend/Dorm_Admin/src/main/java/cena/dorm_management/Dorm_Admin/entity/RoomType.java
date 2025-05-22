package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "loaiphong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomType {
    @Id
    @Column(name = "maLoaiPhong", length = 10)
    private String maLoaiPhong;

    @Column(name = "soNguoiToiDa", nullable = false)
    private int soNguoiToiDa;

    @OneToMany(mappedBy = "maLoaiPhong")
    private List<Room> rooms;
}
