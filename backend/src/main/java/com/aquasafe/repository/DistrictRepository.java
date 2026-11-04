package com.aquasafe.repository;

import com.aquasafe.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    Optional<District> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<District> findAllByOrderByNameAsc();
    List<District> findByZoneIgnoreCase(String zone);
}
