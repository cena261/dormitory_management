package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "khuvuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Area {
    @Id
    @Column(name = "maKhu", length = 10)
    private String maKhu;

    @Column(name = "tenKhu", length = 100, nullable = false)
    private String tenKhu;

    @Column(name = "soTang", nullable = false)
    private int soTang;

    @OneToMany(mappedBy = "maKhu")
    private List<Room> rooms;
}
