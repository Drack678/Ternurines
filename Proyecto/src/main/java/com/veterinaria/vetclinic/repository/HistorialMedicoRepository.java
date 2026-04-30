package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Long> {
}
