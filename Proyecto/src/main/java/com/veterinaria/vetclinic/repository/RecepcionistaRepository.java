package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.Recepcionista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecepcionistaRepository extends JpaRepository<Recepcionista, Long> {
}
