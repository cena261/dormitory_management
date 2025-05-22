package cena.dorm_management.Dorm_Admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HandoverDetailId implements Serializable {
    @Column(name = "maBienBan", length = 20)
    private String maBienBan;

    @Column(name = "maVatDung", length = 20)
    private String maVatDung;
}
