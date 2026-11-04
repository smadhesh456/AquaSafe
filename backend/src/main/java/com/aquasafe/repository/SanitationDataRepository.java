package com.aquasafe.repository;

import com.aquasafe.entity.SanitationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SanitationDataRepository extends JpaRepository<SanitationData, Long> {
    Optional<SanitationData> findByDistrictIgnoreCase(String district);
    boolean existsByDistrictIgnoreCase(String district);
}

