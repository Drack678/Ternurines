package com.veterinaria.vetclinic.repository;

import com.veterinaria.vetclinic.entity.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {
}
