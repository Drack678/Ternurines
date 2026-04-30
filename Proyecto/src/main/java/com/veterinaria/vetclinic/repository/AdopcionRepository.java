package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.Adopcion;
import com.veterinaria.vetclinic.entity.AdopcionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdopcionRepository extends JpaRepository<Adopcion, AdopcionId> {
}
