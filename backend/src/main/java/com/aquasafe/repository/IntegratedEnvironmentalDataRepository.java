package com.aquasafe.repository;

import com.aquasafe.entity.IntegratedEnvironmentalData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IntegratedEnvironmentalDataRepository extends JpaRepository<IntegratedEnvironmentalData, Long> {

    Optional<IntegratedEnvironmentalData> findTopByDistrictIgnoreCaseOrderByObservationDateDescIntegrationTimestampDesc(String district);

    Optional<IntegratedEnvironmentalData> findByDistrictIgnoreCaseAndObservationDate(String district, LocalDate observationDate);

    List<IntegratedEnvironmentalData> findByDistrictIgnoreCaseOrderByObservationDateDesc(String district);

    Page<IntegratedEnvironmentalData> findAllByOrderByIntegrationTimestampDesc(Pageable pageable);

    boolean existsByDistrictIgnoreCaseAndObservationDate(String district, LocalDate observationDate);
}

