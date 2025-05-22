package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "quanly")
@NoArgsConstructor
@AllArgsConstructor
public class Administrator {
    @Id
    @Column(name = "maQL", length = 20, nullable = false)
    private String maQL;

    @Column(name = "hoTen", length = 100, nullable = false)
    private String hoTen;

    @Column(name = "chucVu", length = 50)
    private String chucVu;

    @Column(name = "sdt", length = 20)
    private String sdt;

    @Column(name = "email", length = 100)
    private String email;

    @OneToOne(mappedBy = "quanLy", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Account account;
}
