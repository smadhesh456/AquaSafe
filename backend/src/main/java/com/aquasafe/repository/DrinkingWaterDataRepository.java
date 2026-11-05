package com.aquasafe.repository;

import com.aquasafe.entity.DrinkingWaterData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DrinkingWaterDataRepository extends JpaRepository<DrinkingWaterData, Long> {
    Optional<DrinkingWaterData> findByDistrictIgnoreCase(String district);
    boolean existsByDistrictIgnoreCase(String district);
}

