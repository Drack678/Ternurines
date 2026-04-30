package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.MascotaAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MascotaAdopcionRepository extends JpaRepository<MascotaAdopcion, Long> {
}
