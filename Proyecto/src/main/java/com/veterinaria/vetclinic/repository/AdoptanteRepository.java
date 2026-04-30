package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.Adoptante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdoptanteRepository extends JpaRepository<Adoptante, Long> {
}
